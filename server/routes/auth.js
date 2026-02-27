const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const registerSchema = {
  name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
  email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { required: true, type: 'string', minLength: 8, maxLength: 128 },
};

const loginSchema = {
  email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { required: true, type: 'string', minLength: 1 },
};

router.post('/register', validate(registerSchema), (req, res, next) => {
  try {
  const db = getDb();
  const { name, email, password, current_role, years_experience } = req.body;

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const hashed = bcrypt.hashSync(password, 12);
  const result = db.prepare(
    'INSERT INTO users (name, email, password, current_role, years_experience) VALUES (?, ?, ?, ?, ?)'
  ).run(name, email, hashed, current_role || '', years_experience || 0);

  const token = jwt.sign(
    { id: result.lastInsertRowid, email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  db.prepare('INSERT INTO session_logs (user_id, action, details) VALUES (?, ?, ?)').run(
    result.lastInsertRowid, 'register', 'Account created'
  );

  res.status(201).json({
    token,
    user: {
      id: result.lastInsertRowid,
      name,
      email,
      current_role: current_role || '',
      years_experience: years_experience || 0,
    },
  });
  } catch (err) { next(err); }
});

router.post('/login', validate(loginSchema), (req, res, next) => {
  try {
  const db = getDb();
  const { email, password } = req.body;

  const user = db.prepare('SELECT id, name, email, password, current_role, years_experience FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  db.prepare('INSERT INTO session_logs (user_id, action, details) VALUES (?, ?, ?)').run(
    user.id, 'login', 'User logged in'
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      current_role: user.current_role,
      years_experience: user.years_experience,
    },
  });
  } catch (err) { next(err); }
});

router.get('/me', authMiddleware, (req, res, next) => {
  try {
  const db = getDb();
  const user = db.prepare('SELECT id, name, email, current_role, years_experience, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
  } catch (err) { next(err); }
});

module.exports = router;
