const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/recipes - List crafting recipes with item names and materials
router.get('/', async (req, res) => {
  try {
    const [recipes] = await pool.query(`
      SELECT 
        cr.*,
        i.name_th AS item_name_th,
        i.name_en AS item_name_en,
        i.item_type,
        es.sub_type,
        es.base_atk_min,
        es.base_atk_max,
        es.base_def,
        es.stability
      FROM crafting_recipes cr
      JOIN items i ON cr.item_id = i.item_id
      LEFT JOIN equipment_stats es ON i.item_id = es.item_id AND (es.source_type = 'Crafted' OR es.source_type IS NULL)
      GROUP BY cr.recipe_id
      ORDER BY cr.recipe_id ASC
    `);

    // Fetch materials for each recipe
    for (const recipe of recipes) {
      const [materials] = await pool.query(`
        SELECT 
          rm.mat_id,
          rm.quantity_required,
          rm.material_item_id,
          mi.name_th AS material_name_th,
          mi.name_en AS material_name_en,
          mi.item_type AS material_type
        FROM recipe_materials rm
        JOIN items mi ON rm.material_item_id = mi.item_id
        WHERE rm.recipe_id = ?
      `, [recipe.recipe_id]);
      recipe.materials = materials;
    }

    res.json({ success: true, data: recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/recipes - Create recipe
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { item_id, fee_spina, crafting_fee_material, crafting_material_type, unlock_condition, materials } = req.body;

    if (!item_id) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'item_id is required' });
    }

    const [recResult] = await connection.query(
      `INSERT INTO crafting_recipes (item_id, fee_spina, crafting_fee_material, crafting_material_type, unlock_condition)
       VALUES (?, ?, ?, ?, ?)`,
      [item_id, fee_spina || 0, crafting_fee_material || 0, crafting_material_type || 'Metal', unlock_condition || null]
    );
    const recipeId = recResult.insertId;

    if (Array.isArray(materials) && materials.length > 0) {
      for (const m of materials) {
        if (m.material_item_id && m.quantity_required) {
          await connection.query(
            `INSERT INTO recipe_materials (recipe_id, material_item_id, quantity_required) VALUES (?, ?, ?)`,
            [recipeId, m.material_item_id, m.quantity_required]
          );
        }
      }
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Recipe created', recipe_id: recipeId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
