const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/bosses - List all bosses with maps and difficulties
router.get('/', async (req, res) => {
  try {
    const { search, map_id } = req.query;

    let query = `
      SELECT 
        b.boss_id,
        b.name_th,
        b.name_en,
        b.boss_type,
        b.element_id,
        b.element_notes,
        b.breakable_parts,
        e.element_name,
        m.map_id,
        m.map_name_th,
        m.map_name_en,
        m.chapter,
        COUNT(DISTINCT bd.drop_id) AS total_drops,
        COUNT(DISTINCT bdiff.diff_id) AS total_diffs
      FROM bosses b
      LEFT JOIN elements e ON b.element_id = e.element_id
      LEFT JOIN maps m ON b.map_id = m.map_id
      LEFT JOIN boss_drops bd ON b.boss_id = bd.boss_id
      LEFT JOIN boss_difficulties bdiff ON b.boss_id = bdiff.boss_id
      WHERE 1=1
    `;

    const params = [];
    if (search) {
      query += ` AND (b.name_th LIKE ? OR b.name_en LIKE ? OR m.map_name_th LIKE ? OR m.map_name_en LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }
    if (map_id) {
      query += ` AND b.map_id = ?`;
      params.push(map_id);
    }

    query += ` GROUP BY b.boss_id ORDER BY b.boss_id ASC`;

    const [bosses] = await pool.query(query, params);
    res.json({ success: true, data: bosses });
  } catch (error) {
    console.error('Error fetching bosses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/bosses/:id - Boss details with difficulties and drop list
router.get('/:id', async (req, res) => {
  try {
    const bossId = req.params.id;

    const [bossRows] = await pool.query(`
      SELECT 
        b.*,
        e.element_name,
        m.map_name_th,
        m.map_name_en,
        m.chapter
      FROM bosses b
      LEFT JOIN elements e ON b.element_id = e.element_id
      LEFT JOIN maps m ON b.map_id = m.map_id
      WHERE b.boss_id = ?
    `, [bossId]);

    if (bossRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Boss not found' });
    }

    const boss = bossRows[0];

    // Fetch difficulties
    const [difficulties] = await pool.query(`
      SELECT * FROM boss_difficulties WHERE boss_id = ? ORDER BY diff_id ASC
    `, [bossId]);
    boss.difficulties = difficulties;

    // Fetch drops
    const [drops] = await pool.query(`
      SELECT 
        bd.*,
        i.name_th AS item_name_th,
        i.name_en AS item_name_en,
        i.item_type,
        es.sub_type,
        es.base_atk_min,
        es.base_atk_max,
        es.base_def,
        bdiff.difficulty
      FROM boss_drops bd
      JOIN items i ON bd.item_id = i.item_id
      LEFT JOIN equipment_stats es ON i.item_id = es.item_id AND (es.source_type = 'Boss Drop' OR es.source_type IS NULL)
      LEFT JOIN boss_difficulties bdiff ON bd.diff_id = bdiff.diff_id
      WHERE bd.boss_id = ?
      GROUP BY bd.drop_id
      ORDER BY bd.drop_id ASC
    `, [bossId]);
    boss.drops = drops;

    res.json({ success: true, data: boss });
  } catch (error) {
    console.error('Error fetching boss detail:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/bosses - Create boss
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { name_th, name_en, boss_type = 'Boss', element_id, map_id, difficulties } = req.body;

    if (!name_th) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'name_th is required' });
    }

    const [bossResult] = await connection.query(
      `INSERT INTO bosses (name_th, name_en, boss_type, element_id, map_id) VALUES (?, ?, ?, ?, ?)`,
      [name_th, name_en || null, boss_type, element_id || null, map_id || null]
    );
    const bossId = bossResult.insertId;

    if (Array.isArray(difficulties) && difficulties.length > 0) {
      for (const diff of difficulties) {
        await connection.query(
          `INSERT INTO boss_difficulties (boss_id, difficulty, level, hp, exp, def, mdef) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [bossId, diff.difficulty || 'Normal', diff.level || 1, diff.hp || 0, diff.exp || 0, diff.def || 0, diff.mdef || 0]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Boss created', boss_id: bossId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
