const express = require('express');
const { getDb } = require('../db');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { isMockMode, mockExtractSkills } = require('../mockData');

const router = express.Router();

router.post('/assess', authMiddleware, validate({
  resume_text: { required: true, type: 'string', minLength: 20, maxLength: 15000 },
}), async (req, res, next) => {
  try {
    const db = getDb();
    const { resume_text } = req.body;
    let skills;

    if (isMockMode()) {
      skills = mockExtractSkills(resume_text);
    } else {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a career skills analyst. Extract professional skills from resume text and return structured JSON. Map each skill to O*NET categories. Return an array of objects with: name (string), category (one of: Technical, Management, Analytical, Interpersonal, Design, Marketing), proficiency (number 0-100 estimated from context), onet_code (string, approximate O*NET element code).`
          },
          {
            role: 'user',
            content: `Extract all professional skills from this resume/experience text and return as JSON array:\n\n${resume_text}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      skills = parsed.skills || parsed;
    }

    // Clear old skills for this user and insert new
    db.prepare('DELETE FROM skill_profiles WHERE user_id = ?').run(req.user.id);

    const insertMany = db.transaction((skillList) => {
      for (const skill of skillList) {
        db.prepare(
          'INSERT INTO skill_profiles (user_id, skill_name, category, proficiency, onet_code, source) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(req.user.id, skill.name, skill.category, skill.proficiency, skill.onet_code || '', 'assessment');
      }
    });

    insertMany(skills);

    db.prepare('INSERT INTO session_logs (user_id, action, details) VALUES (?, ?, ?)').run(
      req.user.id, 'skill_assessment', `Extracted ${skills.length} skills`
    );

    res.json({
      skills,
      count: skills.length,
      mock_mode: isMockMode(),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/profile', authMiddleware, (req, res) => {
  const db = getDb();
  const skills = db.prepare(
    'SELECT id, skill_name, category, proficiency, onet_code, source, created_at FROM skill_profiles WHERE user_id = ? ORDER BY proficiency DESC'
  ).all(req.user.id);

  const categories = {};
  for (const skill of skills) {
    if (!categories[skill.category]) categories[skill.category] = [];
    categories[skill.category].push(skill);
  }

  res.json({ skills, categories, count: skills.length });
});

module.exports = router;
