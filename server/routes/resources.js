const express = require('express');
const router = express.Router();
const { RESOURCES } = require('../mockData');

// GET /api/resources - Get all resources (public)
router.get('/', (_req, res) => {
  res.json(RESOURCES);
});

module.exports = router;
