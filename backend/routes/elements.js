const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/elements
router.get('/', async (req, res) => {
  try {
    const [elements] = await pool.query('SELECT * FROM elements ORDER BY element_id ASC');
    res.json({ success: true, data: elements });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
