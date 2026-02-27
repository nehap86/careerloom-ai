const express = require('express');
const { getDb } = require('../db');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Update profile settings
router.patch('/settings', authMiddleware, validate({
  name: { required: false, type: 'string', minLength: 2, maxLength: 100 },
  current_role: { required: false, type: 'string', maxLength: 100 },
}), (req, res, next) => {
  try {
  const db = getDb();
  const { name, current_role, years_experience } = req.body;
  const allowedFields = { name: 'name', current_role: 'current_role', years_experience: 'years_experience' };
  const updates = [];
  const params = [];

  if (name !== undefined && allowedFields.name) { updates.push('name = ?'); params.push(String(name).trim()); }
  if (current_role !== undefined && allowedFields.current_role) { updates.push('current_role = ?'); params.push(String(current_role).trim()); }
  if (years_experience !== undefined && allowedFields.years_experience) {
    const yrs = Number(years_experience);
    updates.push('years_experience = ?'); params.push(isNaN(yrs) || yrs < 0 || yrs > 50 ? 0 : yrs);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push("updated_at = datetime('now')");
  params.push(req.user.id);

  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  const user = db.prepare('SELECT id, name, email, current_role, years_experience, created_at FROM users WHERE id = ?').get(req.user.id);

  db.prepare('INSERT INTO session_logs (user_id, action, details) VALUES (?, ?, ?)').run(
    req.user.id, 'settings_update', `Updated profile settings`
  );

  res.json({ user, updated: true });
  } catch (err) { next(err); }
});

// Get activity log
router.get('/activity', authMiddleware, (req, res, next) => {
  try {
  const db = getDb();
  const logs = db.prepare(
    'SELECT id, action, details, created_at FROM session_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).all(req.user.id);

  // Format action labels
  const formatted = logs.map(log => ({
    ...log,
    label: formatAction(log.action),
    icon: actionIcon(log.action),
  }));

  res.json({ activity: formatted });
  } catch (err) { next(err); }
});

// Get dashboard stats
router.get('/stats', authMiddleware, (req, res, next) => {
  try {
  const db = getDb();

  const skillCount = db.prepare('SELECT COUNT(*) as count FROM skill_profiles WHERE user_id = ?').get(req.user.id);
  const pathCount = db.prepare('SELECT COUNT(*) as count FROM career_paths WHERE user_id = ?').get(req.user.id);
  const roadmapCount = db.prepare('SELECT COUNT(*) as count FROM learning_roadmaps WHERE user_id = ?').get(req.user.id);

  // Calculate total roadmap progress
  const roadmaps = db.prepare('SELECT progress FROM learning_roadmaps WHERE user_id = ?').all(req.user.id);
  let totalWeeks = 0;
  let completedWeeks = 0;
  for (const rm of roadmaps) {
    const prog = JSON.parse(rm.progress);
    totalWeeks += prog.length;
    completedWeeks += prog.filter(Boolean).length;
  }

  res.json({
    skills: skillCount ? skillCount.count : 0,
    career_paths: pathCount ? pathCount.count : 0,
    roadmaps: roadmapCount ? roadmapCount.count : 0,
    learning_progress: totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0,
    completed_weeks: completedWeeks,
    total_weeks: totalWeeks,
  });
  } catch (err) { next(err); }
});

function formatAction(action) {
  const labels = {
    register: 'Account Created',
    login: 'Signed In',
    skill_assessment: 'Skills Assessed',
    career_explore: 'Careers Explored',
    roadmap_generate: 'Roadmap Generated',
    progress_update: 'Progress Updated',
    settings_update: 'Settings Updated',
  };
  return labels[action] || action;
}

function actionIcon(action) {
  const icons = {
    register: 'user-add',
    login: 'login',
    skill_assessment: 'clipboard-check',
    career_explore: 'map',
    roadmap_generate: 'academic-cap',
    progress_update: 'check-circle',
    settings_update: 'cog',
  };
  return icons[action] || 'information-circle';
}

module.exports = router;
