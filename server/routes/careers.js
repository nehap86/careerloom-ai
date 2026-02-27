const express = require('express');
const { getDb } = require('../db');
const authMiddleware = require('../middleware/auth');
const { isMockMode, mockCareerPaths } = require('../mockData');

const router = express.Router();

// GET saved career paths (no regeneration — fast, for dashboard)
router.get('/saved', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT current_role FROM users WHERE id = ?').get(req.user.id);
  const stored = db.prepare(
    'SELECT * FROM career_paths WHERE user_id = ? ORDER BY feasibility_score DESC'
  ).all(req.user.id);

  const result = stored.map(p => ({
    ...p,
    skill_gaps: JSON.parse(p.skill_gaps),
  }));

  res.json({
    paths: result,
    source_role: (user && user.current_role) || 'General Professional',
  });
});

// GET explore — generates/regenerates career paths (AI call)
router.get('/explore', authMiddleware, async (req, res, next) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT current_role FROM users WHERE id = ?').get(req.user.id);
    const skills = db.prepare('SELECT skill_name, category, proficiency FROM skill_profiles WHERE user_id = ?').all(req.user.id);

    let paths;

    if (isMockMode()) {
      paths = mockCareerPaths(user ? user.current_role : '', skills);
    } else {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const skillSummary = skills.map(s => `${s.skill_name} (${s.category}, ${s.proficiency}%)`).join(', ');

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a career transition advisor. Given a person's current role and skills, suggest 5-7 realistic career transition paths. For each, provide: target_role, median_salary (USD integer), growth_rate (percentage), market_demand (Low/Medium/High/Very High), skill_overlap (0-100), feasibility_score (0-100), skill_gaps (array of 3 specific skills to acquire), transition_time_months (integer). Return as JSON with a "paths" array.`
          },
          {
            role: 'user',
            content: `Current role: ${(user && user.current_role) || 'General Professional'}\nSkills: ${skillSummary || 'No skills assessed yet'}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      paths = parsed.paths || parsed;
    }

    const sourceRole = (user && user.current_role) || 'General Professional';

    // Store career paths in DB
    db.prepare('DELETE FROM career_paths WHERE user_id = ?').run(req.user.id);

    const insertMany = db.transaction((pathList) => {
      for (const p of pathList) {
        db.prepare(
          `INSERT INTO career_paths (user_id, source_role, target_role, skill_overlap, feasibility_score, median_salary, growth_rate, market_demand, skill_gaps, transition_time_months)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          req.user.id, sourceRole, p.target_role, p.skill_overlap, p.feasibility_score,
          p.median_salary, p.growth_rate, p.market_demand,
          JSON.stringify(p.skill_gaps), p.transition_time_months
        );
      }
    });

    insertMany(paths);

    // Re-fetch with IDs
    const stored = db.prepare(
      'SELECT * FROM career_paths WHERE user_id = ? ORDER BY feasibility_score DESC'
    ).all(req.user.id);

    const result = stored.map(p => ({
      ...p,
      skill_gaps: JSON.parse(p.skill_gaps),
    }));

    db.prepare('INSERT INTO session_logs (user_id, action, details) VALUES (?, ?, ?)').run(
      req.user.id, 'career_explore', `Generated ${result.length} career paths`
    );

    res.json({ paths: result, source_role: sourceRole, mock_mode: isMockMode() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
