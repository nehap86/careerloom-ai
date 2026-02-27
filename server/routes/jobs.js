const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDb } = require('../db');
const { mockJobListings, isMockMode } = require('../mockData');

// GET /api/jobs - Get matched job listings
router.get('/', auth, (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.user.id;

    // Get user's skills
    const skills = db.prepare('SELECT skill_name, category, proficiency FROM skill_profiles WHERE user_id = ?').all(userId);

    // Get target role from query or from top career path
    let targetRole = req.query.role || null;
    if (!targetRole) {
      const topPath = db.prepare('SELECT target_role FROM career_paths WHERE user_id = ? ORDER BY feasibility_score DESC LIMIT 1').get(userId);
      if (topPath) targetRole = topPath.target_role;
    }

    const jobs = mockJobListings(skills, targetRole);

    // Log activity
    db.prepare('INSERT INTO session_logs (user_id, action, details) VALUES (?, ?, ?)').run(
      userId, 'job_search', `Searched jobs${targetRole ? ` for ${targetRole}` : ''}`
    );

    res.json({ jobs, target_role: targetRole, total: jobs.length });
  } catch (err) { next(err); }
});

// GET /api/jobs/saved - Get user's saved/bookmarked jobs
router.get('/saved', auth, (req, res, next) => {
  try {
    const db = getDb();
    const saved = db.prepare('SELECT id, job_id, job_title, company, status, created_at FROM saved_jobs WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json({ saved });
  } catch (err) { next(err); }
});

// POST /api/jobs/save - Save/bookmark a job
router.post('/save', auth, (req, res, next) => {
  try {
  const db = getDb();
  const { job_id, job_title, company, status } = req.body;

  if (!job_id || !job_title) {
    return res.status(400).json({ error: 'job_id and job_title are required' });
  }
  if (typeof job_id !== 'string' || job_id.length > 100) {
    return res.status(400).json({ error: 'Invalid job_id' });
  }
  if (typeof job_title !== 'string' || job_title.length > 200) {
    return res.status(400).json({ error: 'Invalid job_title' });
  }

  // Check if already saved
  const existing = db.prepare('SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?').get(req.user.id, job_id);
  if (existing) {
    // Update status
    db.prepare('UPDATE saved_jobs SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status || 'saved', existing.id);
    return res.json({ message: 'Job status updated' });
  }

  db.prepare(
    'INSERT INTO saved_jobs (user_id, job_id, job_title, company, status) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, job_id, job_title, company || '', status || 'saved');

  db.prepare('INSERT INTO session_logs (user_id, action, details) VALUES (?, ?, ?)').run(
    req.user.id, 'job_saved', `Saved job: ${job_title}`
  );

  res.json({ message: 'Job saved' });
  } catch (err) { next(err); }
});

// DELETE /api/jobs/save/:jobId - Remove saved job
router.delete('/save/:jobId', auth, (req, res, next) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?').run(req.user.id, req.params.jobId);
    res.json({ message: 'Job removed' });
  } catch (err) { next(err); }
});

module.exports = router;
