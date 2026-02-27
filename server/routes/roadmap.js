const express = require('express');
const { getDb } = require('../db');
const authMiddleware = require('../middleware/auth');
const { isMockMode, mockGenerateRoadmap } = require('../mockData');

const router = express.Router();

router.post('/generate', authMiddleware, async (req, res, next) => {
  try {
    const db = getDb();
    const { career_path_id } = req.body;
    if (!career_path_id) {
      return res.status(400).json({ error: 'career_path_id is required' });
    }

    const careerPath = db.prepare('SELECT * FROM career_paths WHERE id = ? AND user_id = ?').get(career_path_id, req.user.id);
    if (!careerPath) {
      return res.status(404).json({ error: 'Career path not found' });
    }

    // Check if roadmap already exists
    const existing = db.prepare('SELECT * FROM learning_roadmaps WHERE career_path_id = ? AND user_id = ?').get(career_path_id, req.user.id);
    if (existing) {
      return res.json({
        roadmap: {
          ...existing,
          weeks_data: JSON.parse(existing.weeks_data),
          progress: JSON.parse(existing.progress),
        },
        career_path: { ...careerPath, skill_gaps: JSON.parse(careerPath.skill_gaps) },
      });
    }

    const skillGaps = JSON.parse(careerPath.skill_gaps);
    let roadmapData;

    if (isMockMode()) {
      roadmapData = mockGenerateRoadmap(careerPath.target_role, skillGaps);
    } else {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const skills = db.prepare('SELECT skill_name, proficiency FROM skill_profiles WHERE user_id = ?').all(req.user.id);
      const skillSummary = skills.map(s => `${s.skill_name} (${s.proficiency}%)`).join(', ');

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a career learning advisor. Create a detailed 12-week learning roadmap for a career transition. Return JSON with: title (string), description (string), weeks (array of objects with: week (number 1-12), topic (string), description (string), resources (array of 3 strings - course names, books, or tools), hours (estimated study hours as integer)).`
          },
          {
            role: 'user',
            content: `Create a 12-week roadmap for transitioning to: ${careerPath.target_role}\nCurrent skills: ${skillSummary}\nSkill gaps to fill: ${skillGaps.join(', ')}\nTransition from: ${careerPath.source_role}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      roadmapData = JSON.parse(response.choices[0].message.content);
    }

    const progress = new Array(12).fill(false);

    const result = db.prepare(
      `INSERT INTO learning_roadmaps (user_id, career_path_id, title, description, weeks_data, progress)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      req.user.id,
      career_path_id,
      roadmapData.title,
      roadmapData.description,
      JSON.stringify(roadmapData.weeks),
      JSON.stringify(progress)
    );

    db.prepare('INSERT INTO session_logs (user_id, action, details) VALUES (?, ?, ?)').run(
      req.user.id, 'roadmap_generate', `Generated roadmap for ${careerPath.target_role}`
    );

    res.status(201).json({
      roadmap: {
        id: result.lastInsertRowid,
        user_id: req.user.id,
        career_path_id,
        title: roadmapData.title,
        description: roadmapData.description,
        weeks_data: roadmapData.weeks,
        progress,
        status: 'active',
      },
      career_path: { ...careerPath, skill_gaps: skillGaps },
      mock_mode: isMockMode(),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:pathId', authMiddleware, (req, res) => {
  const db = getDb();
  const { pathId } = req.params;

  const roadmap = db.prepare(
    'SELECT * FROM learning_roadmaps WHERE career_path_id = ? AND user_id = ?'
  ).get(pathId, req.user.id);

  if (!roadmap) {
    return res.status(404).json({ error: 'Roadmap not found. Generate one first.' });
  }

  const careerPath = db.prepare('SELECT * FROM career_paths WHERE id = ? AND user_id = ?').get(pathId, req.user.id);

  res.json({
    roadmap: {
      ...roadmap,
      weeks_data: JSON.parse(roadmap.weeks_data),
      progress: JSON.parse(roadmap.progress),
    },
    career_path: careerPath ? { ...careerPath, skill_gaps: JSON.parse(careerPath.skill_gaps) } : null,
  });
});

router.patch('/:id/progress', authMiddleware, (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { week_index, completed } = req.body;

  if (week_index === undefined || completed === undefined) {
    return res.status(400).json({ error: 'week_index and completed are required' });
  }

  const roadmap = db.prepare('SELECT * FROM learning_roadmaps WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!roadmap) {
    return res.status(404).json({ error: 'Roadmap not found' });
  }

  const progress = JSON.parse(roadmap.progress);
  if (week_index < 0 || week_index >= progress.length) {
    return res.status(400).json({ error: 'Invalid week index' });
  }

  progress[week_index] = !!completed;

  db.prepare("UPDATE learning_roadmaps SET progress = ?, updated_at = datetime('now') WHERE id = ?").run(
    JSON.stringify(progress), id
  );

  db.prepare('INSERT INTO session_logs (user_id, action, details) VALUES (?, ?, ?)').run(
    req.user.id, 'progress_update', `Week ${week_index + 1}: ${completed ? 'completed' : 'uncompleted'}`
  );

  res.json({ progress, updated: true });
});

module.exports = router;
