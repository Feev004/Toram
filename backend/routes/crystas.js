const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

function parseJSON(str) {
  if (!str) return null;
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

// GET /api/crystas - List all crystas with stats, boss drops, and upgrade chains
router.get('/', async (req, res) => {
  try {
    const { search, crysta_type, color } = req.query;

    let query = `
      SELECT 
        i.item_id,
        i.name_th,
        i.name_en,
        i.item_type,
        i.is_tradable,
        cs.crysta_id,
        cs.crysta_type,
        cs.color,
        cs.upgrade_from_item_id,
        cs.stats,
        cs.conditional_bonus,
        prev_c.name_th AS upgrade_from_name_th,
        prev_c.name_en AS upgrade_from_name_en,
        b.boss_id,
        b.name_th AS boss_name_th,
        b.name_en AS boss_name_en,
        bd.drop_rate_category,
        m.map_name_th
      FROM items i
      JOIN crysta_stats cs ON i.item_id = cs.item_id
      LEFT JOIN items prev_c ON cs.upgrade_from_item_id = prev_c.item_id
      LEFT JOIN boss_drops bd ON i.item_id = bd.item_id
      LEFT JOIN bosses b ON bd.boss_id = b.boss_id
      LEFT JOIN maps m ON b.map_id = m.map_id
      WHERE i.item_type = 'Crysta'
    `;

    const params = [];

    if (search) {
      query += ` AND (i.name_th LIKE ? OR i.name_en LIKE ? OR prev_c.name_th LIKE ? OR cs.stats LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (crysta_type && crysta_type !== 'All') {
      query += ` AND cs.crysta_type = ?`;
      params.push(crysta_type);
    }

    if (color && color !== 'All') {
      query += ` AND cs.color = ?`;
      params.push(color);
    }

    query += ` GROUP BY cs.crysta_id ORDER BY cs.crysta_type ASC, i.item_id ASC`;

    const [rows] = await pool.query(query, params);

    const crystas = rows.map(r => ({
      item_id: r.item_id,
      name_th: r.name_th,
      name_en: r.name_en,
      is_tradable: r.is_tradable,
      crysta_id: r.crysta_id,
      crysta_type: r.crysta_type,
      color: r.color,
      upgrade_from_item_id: r.upgrade_from_item_id,
      upgrade_from_name_th: r.upgrade_from_name_th,
      upgrade_from_name_en: r.upgrade_from_name_en,
      stats: parseJSON(r.stats),
      conditional_bonus: parseJSON(r.conditional_bonus),
      boss: r.boss_id ? {
        boss_id: r.boss_id,
        name_th: r.boss_name_th,
        name_en: r.boss_name_en,
        drop_rate_category: r.drop_rate_category,
        map_name_th: r.map_name_th
      } : null
    }));

    res.json({ success: true, data: crystas });
  } catch (error) {
    console.error('Error fetching crystas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
