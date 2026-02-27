try { require('dotenv').config(); } catch (e) { /* dotenv not required in production */ }
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const { ready } = require('./db');

const app = express();
const path = require('path');
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Global rate limiter - prevent DoS (100 requests per minute per IP)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Auth rate limiter - prevent brute force (10 attempts per 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// AI rate limiter (20 requests per 15 min)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many AI requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.post('/api/skills/assess', aiLimiter);
app.post('/api/roadmap/generate', aiLimiter);

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/user', require('./routes/user'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/resources', require('./routes/resources'));

// Health check
app.get('/api/health', (_req, res) => {
  const mockMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '' || process.env.OPENAI_API_KEY === 'optional_key_here';
  res.json({
    status: 'ok',
    mock_mode: mockMode,
    message: mockMode
      ? 'Running in MOCK MODE - using sample data (set OPENAI_API_KEY for live AI)'
      : 'Running with OpenAI integration',
  });
});

// Serve built React frontend in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Error handler
app.use(errorHandler);

// Wait for DB to be ready before starting server
ready.then(() => {
  app.listen(PORT, () => {
    const mockMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '' || process.env.OPENAI_API_KEY === 'optional_key_here';
    console.log(`\n  CareerLoom AI Server running on port ${PORT}`);
    console.log(`  Mode: ${mockMode ? 'MOCK (no OpenAI key)' : 'LIVE (OpenAI connected)'}`);
    console.log(`  API: http://localhost:${PORT}/api/health\n`);
  });
});
