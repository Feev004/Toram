const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/maps
router.get('/', async (req, res) => {
  try {
    const [maps] = await pool.query('SELECT * FROM maps ORDER BY chapter ASC, map_id ASC');
    res.json({ success: true, data: maps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/maps
router.post('/', async (req, res) => {
  try {
    const { map_name_th, map_name_en, chapter } = req.body;
    const [result] = await pool.query(
      'INSERT INTO maps (map_name_th, map_name_en, chapter) VALUES (?, ?, ?)',
      [map_name_th, map_name_en || null, chapter || 1]
    );
    res.status(201).json({ success: true, map_id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
