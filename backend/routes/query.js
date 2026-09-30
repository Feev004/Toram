const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// POST /api/query - Execute custom SQL query (mimicking phpMyAdmin SQL query box)
router.post('/execute', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || query.trim() === '') {
    return res.status(400).json({ success: false, error: 'SQL query string is required' });
  }

  const trimmedQuery = query.trim();
  const startTime = process.hrtime();

  try {
    const [results, fields] = await pool.query(trimmedQuery);
    const diff = process.hrtime(startTime);
    const executionTimeSec = (diff[0] + diff[1] / 1e9).toFixed(4);

    let columns = [];
    let rows = [];

    if (Array.isArray(results)) {
      rows = results;
      if (fields && fields.length > 0) {
        columns = fields.map(f => f.name);
      } else if (rows.length > 0) {
        columns = Object.keys(rows[0]);
      }
    }

    res.json({
      success: true,
      query: trimmedQuery,
      executionTimeSec: `${executionTimeSec} seconds`,
      rowCount: Array.isArray(results) ? results.length : (results.affectedRows || 0),
      columns,
      data: rows,
      rawResult: Array.isArray(results) ? undefined : results
    });
  } catch (error) {
    const diff = process.hrtime(startTime);
    const executionTimeSec = (diff[0] + diff[1] / 1e9).toFixed(4);

    res.status(400).json({
      success: false,
      query: trimmedQuery,
      executionTimeSec: `${executionTimeSec} seconds`,
      error: error.message,
      errno: error.errno,
      sqlState: error.sqlState
    });
  }
});

// GET /api/query/sample - Get standard Toram sample queries including the one from phpMyAdmin
router.get('/sample', (req, res) => {
  res.json({
    success: true,
    presets: [
      {
        id: 'phpmyadmin-main',
        title: 'Query from phpMyAdmin (เจมินัสซอร์ด)',
        sql: `SELECT i.name_th AS ชื่ออุปกรณ์, es.sub_type AS ประเภท, CONCAT(es.base_atk_min, ' - ', es.base_atk_max) AS Base_ATK, es.base_def AS Base_DEF, CONCAT(es.stability, '%') AS ความเสถียร, es.main_stats AS สเตตัสหลัก, es.conditional_bonus AS สเตตัสโบนัสพิเศษ, cr.unlock_condition AS เงื่อนไขคราฟต์, b.name_th AS ดรอปจากบอส 
FROM items i 
LEFT JOIN equipment_stats es ON i.item_id = es.item_id 
LEFT JOIN crafting_recipes cr ON i.item_id = cr.item_id 
LEFT JOIN boss_drops bd ON i.item_id = bd.item_id 
LEFT JOIN bosses b ON bd.boss_id = b.boss_id 
WHERE i.name_th = 'เจมินัสซอร์ด';`
      },
      {
        id: 'all-weapons',
        title: 'All Weapons & Stats',
        sql: `SELECT i.item_id, i.name_th, i.name_en, es.sub_type, es.base_atk_min, es.base_atk_max, es.stability, es.main_stats
FROM items i
JOIN equipment_stats es ON i.item_id = es.item_id
WHERE i.item_type = 'Weapon'
ORDER BY es.base_atk_max DESC;`
      },
      {
        id: 'boss-drops-overview',
        title: 'Boss Drops & Difficulties',
        sql: `SELECT b.name_th AS Boss, m.map_name_th AS Map, i.name_th AS Item, i.item_type AS Type, bd.drop_rate_category AS Rarity, bd.part_break_required AS PartBreakRequired
FROM boss_drops bd
JOIN bosses b ON bd.boss_id = b.boss_id
JOIN items i ON bd.item_id = i.item_id
LEFT JOIN maps m ON b.map_id = m.map_id
ORDER BY b.name_th, bd.drop_rate_category;`
      },
      {
        id: 'crafting-mats-cost',
        title: 'Crafting Recipes & Required Materials',
        sql: `SELECT cr.recipe_id, i.name_th AS Craft_Item, cr.fee_spina, cr.crafting_fee_material, cr.crafting_material_type, cr.unlock_condition, mi.name_th AS Material_Name, rm.quantity_required
FROM crafting_recipes cr
JOIN items i ON cr.item_id = i.item_id
LEFT JOIN recipe_materials rm ON cr.recipe_id = rm.recipe_id
LEFT JOIN items mi ON rm.material_item_id = mi.item_id;`
      }
    ]
  });
});

module.exports = router;
