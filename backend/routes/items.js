const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Helper to safely parse JSON strings
function parseJSON(str) {
  if (!str) return null;
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

// GET /api/items - List & search items with rich stats, craft info, boss drops, and crysta info
router.get('/', async (req, res) => {
  try {
    const { search, type, sub_type, crysta_type, boss_id, limit = 100, page = 1 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let query = `
      SELECT 
        i.item_id,
        i.name_th,
        i.name_en,
        i.item_type,
        i.is_tradable,
        cr.recipe_id,
        cr.fee_spina,
        cr.crafting_fee_material,
        cr.crafting_material_type,
        cr.unlock_condition,
        cs.crysta_id,
        cs.crysta_type,
        cs.color AS crysta_color,
        cs.upgrade_from_item_id,
        cs.stats AS crysta_stats_json,
        cs.conditional_bonus AS crysta_conditional_bonus_json,
        prev_c.name_th AS upgrade_from_name_th,
        prev_c.name_en AS upgrade_from_name_en,
        GROUP_CONCAT(DISTINCT CONCAT(b.boss_id, ':', b.name_th, ':', IFNULL(b.name_en, ''), ':', IFNULL(bd.drop_rate_category, 'Common')) SEPARATOR ';;') AS boss_drop_list
      FROM items i
      LEFT JOIN equipment_stats es ON i.item_id = es.item_id
      LEFT JOIN crysta_stats cs ON i.item_id = cs.item_id
      LEFT JOIN items prev_c ON cs.upgrade_from_item_id = prev_c.item_id
      LEFT JOIN crafting_recipes cr ON i.item_id = cr.item_id
      LEFT JOIN boss_drops bd ON i.item_id = bd.item_id
      LEFT JOIN bosses b ON bd.boss_id = b.boss_id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += ` AND (i.name_th LIKE ? OR i.name_en LIKE ? OR es.sub_type LIKE ? OR cs.crysta_type LIKE ? OR prev_c.name_th LIKE ? OR cr.unlock_condition LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term, term, term);
    }

    if (type && type !== 'All') {
      query += ` AND i.item_type = ?`;
      params.push(type);
    }

    if (sub_type && sub_type !== 'All') {
      query += ` AND es.sub_type = ?`;
      params.push(sub_type);
    }

    if (crysta_type && crysta_type !== 'All') {
      query += ` AND cs.crysta_type = ?`;
      params.push(crysta_type);
    }

    if (boss_id) {
      query += ` AND bd.boss_id = ?`;
      params.push(boss_id);
    }

    query += ` GROUP BY i.item_id ORDER BY i.item_id ASC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(query, params);

    // Fetch equipment stats for returned items
    const itemIds = rows.map(r => r.item_id);
    const equipMap = {};
    if (itemIds.length > 0) {
      const [allEquipStats] = await pool.query(`SELECT * FROM equipment_stats WHERE item_id IN (?) ORDER BY equip_id ASC`, [itemIds]);
      for (const es of allEquipStats) {
        if (!equipMap[es.item_id]) equipMap[es.item_id] = [];
        equipMap[es.item_id].push({
          ...es,
          main_stats: parseJSON(es.main_stats),
          conditional_bonus: parseJSON(es.conditional_bonus)
        });
      }
    }

    // Format unique results
    const items = rows.map(item => {
      const versions = equipMap[item.item_id] || [];
      const primary = versions[0] || null;

      let bosses = [];
      if (item.boss_drop_list) {
        bosses = item.boss_drop_list.split(';;').map(bStr => {
          const [id, name_th, name_en, dropRate] = bStr.split(':');
          return { boss_id: parseInt(id, 10), name_th, name_en, drop_rate_category: dropRate };
        });
      }

      let crysta = null;
      if (item.crysta_id) {
        crysta = {
          crysta_id: item.crysta_id,
          crysta_type: item.crysta_type,
          color: item.crysta_color,
          upgrade_from_item_id: item.upgrade_from_item_id,
          upgrade_from_name_th: item.upgrade_from_name_th,
          upgrade_from_name_en: item.upgrade_from_name_en,
          stats: parseJSON(item.crysta_stats_json),
          conditional_bonus: parseJSON(item.crysta_conditional_bonus_json)
        };
      }

      let base_atk_display = null;
      if (primary?.base_atk_min && primary?.base_atk_max) {
        base_atk_display = primary.base_atk_min === primary.base_atk_max ? String(primary.base_atk_min) : `${primary.base_atk_min} - ${primary.base_atk_max}`;
      } else if (primary?.base_atk_min) {
        base_atk_display = String(primary.base_atk_min);
      }

      return {
        ...item,
        equipment_versions: versions,
        sub_type: primary?.sub_type || null,
        source_types: versions.map(v => v.source_type),
        base_atk_min: primary?.base_atk_min || null,
        base_atk_max: primary?.base_atk_max || null,
        base_atk_display,
        base_def: primary?.base_def || null,
        stability: primary?.stability || null,
        main_stats: primary?.main_stats || parseJSON(item.crysta_stats_json) || null,
        conditional_bonus: primary?.conditional_bonus || parseJSON(item.crysta_conditional_bonus_json) || null,
        crysta,
        bosses
      };
    });

    // Count total matching items
    let countQuery = `
      SELECT COUNT(DISTINCT i.item_id) AS total
      FROM items i
      LEFT JOIN equipment_stats es ON i.item_id = es.item_id
      LEFT JOIN crysta_stats cs ON i.item_id = cs.item_id
      LEFT JOIN items prev_c ON cs.upgrade_from_item_id = prev_c.item_id
      LEFT JOIN crafting_recipes cr ON i.item_id = cr.item_id
      LEFT JOIN boss_drops bd ON i.item_id = bd.item_id
      WHERE 1=1
    `;
    const countParams = [];
    if (search) {
      countQuery += ` AND (i.name_th LIKE ? OR i.name_en LIKE ? OR es.sub_type LIKE ? OR cs.crysta_type LIKE ? OR prev_c.name_th LIKE ? OR cr.unlock_condition LIKE ?)`;
      const term = `%${search}%`;
      countParams.push(term, term, term, term, term, term);
    }
    if (type && type !== 'All') {
      countQuery += ` AND i.item_type = ?`;
      countParams.push(type);
    }
    if (sub_type && sub_type !== 'All') {
      countQuery += ` AND es.sub_type = ?`;
      countParams.push(sub_type);
    }
    if (crysta_type && crysta_type !== 'All') {
      countQuery += ` AND cs.crysta_type = ?`;
      countParams.push(crysta_type);
    }
    if (boss_id) {
      countQuery += ` AND bd.boss_id = ?`;
      countParams.push(boss_id);
    }

    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0] ? countRows[0].total : items.length;

    res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/items/types/meta - Filter options metadata
router.get('/types/meta', async (req, res) => {
  try {
    const [types] = await pool.query('SELECT DISTINCT item_type FROM items WHERE item_type IS NOT NULL ORDER BY item_type');
    const [subTypes] = await pool.query('SELECT DISTINCT sub_type FROM equipment_stats WHERE sub_type IS NOT NULL ORDER BY sub_type');
    const [crystaTypes] = await pool.query('SELECT DISTINCT crysta_type FROM crysta_stats WHERE crysta_type IS NOT NULL ORDER BY crysta_type');
    const [materialTypes] = await pool.query('SELECT DISTINCT crafting_material_type FROM crafting_recipes WHERE crafting_material_type IS NOT NULL');

    res.json({
      success: true,
      data: {
        item_types: types.map(t => t.item_type),
        sub_types: subTypes.map(st => st.sub_type),
        crysta_types: crystaTypes.map(ct => ct.crysta_type),
        crafting_material_types: materialTypes.map(mt => mt.crafting_material_type)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/items/:id - Full details for single item
router.get('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;

    const [items] = await pool.query(`
      SELECT 
        i.*,
        es.equip_id,
        es.sub_type,
        es.base_atk_min,
        es.base_atk_max,
        es.base_def,
        es.stability,
        es.main_stats,
        es.conditional_bonus,
        cs.crysta_id,
        cs.crysta_type,
        cs.color AS crysta_color,
        cs.upgrade_from_item_id,
        cs.stats AS crysta_stats_json,
        cs.conditional_bonus AS crysta_conditional_bonus_json,
        prev_c.name_th AS upgrade_from_name_th,
        prev_c.name_en AS upgrade_from_name_en
      FROM items i
      LEFT JOIN equipment_stats es ON i.item_id = es.item_id
      LEFT JOIN crysta_stats cs ON i.item_id = cs.item_id
      LEFT JOIN items prev_c ON cs.upgrade_from_item_id = prev_c.item_id
      WHERE i.item_id = ?
    `, [itemId]);

    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const item = items[0];
    item.main_stats = parseJSON(item.main_stats) || parseJSON(item.crysta_stats_json);
    item.conditional_bonus = parseJSON(item.conditional_bonus) || parseJSON(item.crysta_conditional_bonus_json);

    // Fetch all equipment versions (e.g. Boss Drop vs Crafted)
    const [equipStats] = await pool.query(`SELECT * FROM equipment_stats WHERE item_id = ? ORDER BY equip_id ASC`, [itemId]);
    item.equipment_versions = equipStats.map(es => ({
      ...es,
      main_stats: parseJSON(es.main_stats),
      conditional_bonus: parseJSON(es.conditional_bonus)
    }));

    if (item.crysta_id) {
      item.crysta = {
        crysta_id: item.crysta_id,
        crysta_type: item.crysta_type,
        color: item.crysta_color,
        upgrade_from_item_id: item.upgrade_from_item_id,
        upgrade_from_name_th: item.upgrade_from_name_th,
        upgrade_from_name_en: item.upgrade_from_name_en,
        stats: parseJSON(item.crysta_stats_json),
        conditional_bonus: parseJSON(item.crysta_conditional_bonus_json)
      };

      // Check if any higher tier crystas upgrade from this crysta
      const [upgradedTo] = await pool.query(`
        SELECT next_c.item_id, next_c.name_th, next_c.name_en, cs_next.crysta_type, cs_next.color
        FROM crysta_stats cs_next
        JOIN items next_c ON cs_next.item_id = next_c.item_id
        WHERE cs_next.upgrade_from_item_id = ?
      `, [itemId]);
      item.crysta.upgraded_to = upgradedTo;
    } else {
      item.crysta = null;
    }

    // Fetch crafting recipe and materials if exists
    const [recipes] = await pool.query(`
      SELECT cr.*
      FROM crafting_recipes cr
      WHERE cr.item_id = ?
    `, [itemId]);

    if (recipes.length > 0) {
      const recipe = recipes[0];
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
      item.recipe = recipe;
    } else {
      item.recipe = null;
    }

    // Fetch boss drops
    const [drops] = await pool.query(`
      SELECT 
        bd.*,
        b.name_th AS boss_name_th,
        b.name_en AS boss_name_en,
        b.boss_type,
        m.map_name_th,
        m.map_name_en,
        m.chapter,
        bdiff.difficulty,
        bdiff.level AS boss_level,
        bdiff.hp AS boss_hp
      FROM boss_drops bd
      JOIN bosses b ON bd.boss_id = b.boss_id
      LEFT JOIN maps m ON b.map_id = m.map_id
      LEFT JOIN boss_difficulties bdiff ON bd.diff_id = bdiff.diff_id
      WHERE bd.item_id = ?
    `, [itemId]);

    item.drops = drops;

    // Check if this item is used as a material for crafting other items
    const [usedInRecipes] = await pool.query(`
      SELECT 
        rm.quantity_required,
        cr.recipe_id,
        cr.fee_spina,
        target_item.item_id AS target_item_id,
        target_item.name_th AS target_name_th,
        target_item.name_en AS target_name_en,
        target_item.item_type AS target_item_type
      FROM recipe_materials rm
      JOIN crafting_recipes cr ON rm.recipe_id = cr.recipe_id
      JOIN items target_item ON cr.item_id = target_item.item_id
      WHERE rm.material_item_id = ?
    `, [itemId]);

    item.used_in_recipes = usedInRecipes;

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching item details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/items - Create item with optional stats/crysta/recipe/drops
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      name_th,
      name_en,
      item_type,
      is_tradable = 1,
      sub_type,
      base_atk_min,
      base_atk_max,
      base_def,
      stability,
      main_stats,
      conditional_bonus,
      crysta,
      recipe,
      drops
    } = req.body;

    if (!name_th || !item_type) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'name_th and item_type are required' });
    }

    const [itemResult] = await connection.query(
      `INSERT INTO items (name_th, name_en, item_type, is_tradable) VALUES (?, ?, ?, ?)`,
      [name_th, name_en || null, item_type, is_tradable ? 1 : 0]
    );
    const itemId = itemResult.insertId;

    // Insert equipment stats if provided
    if (sub_type || base_atk_min || base_def || (item_type !== 'Crysta' && main_stats)) {
      const statsJson = typeof main_stats === 'object' ? JSON.stringify(main_stats) : (main_stats || null);
      const condJson = typeof conditional_bonus === 'object' ? JSON.stringify(conditional_bonus) : (conditional_bonus || null);

      await connection.query(
        `INSERT INTO equipment_stats (item_id, sub_type, base_atk_min, base_atk_max, base_def, stability, main_stats, conditional_bonus)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          itemId,
          sub_type || null,
          base_atk_min || null,
          base_atk_max || null,
          base_def || null,
          stability || null,
          statsJson,
          condJson
        ]
      );
    }

    // Insert crysta stats if Crysta item
    if (item_type === 'Crysta' || crysta) {
      const cType = crysta?.crysta_type || 'Normal';
      const cColor = crysta?.color || 'Yellow';
      const cUpgradeFrom = crysta?.upgrade_from_item_id || null;
      const cStats = typeof (crysta?.stats || main_stats) === 'object' ? JSON.stringify(crysta?.stats || main_stats) : (crysta?.stats || main_stats || null);
      const cCond = typeof (crysta?.conditional_bonus || conditional_bonus) === 'object' ? JSON.stringify(crysta?.conditional_bonus || conditional_bonus) : (crysta?.conditional_bonus || conditional_bonus || null);

      await connection.query(
        `INSERT INTO crysta_stats (item_id, crysta_type, color, upgrade_from_item_id, stats, conditional_bonus)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [itemId, cType, cColor, cUpgradeFrom, cStats, cCond]
      );
    }

    // Insert recipe if provided
    if (recipe) {
      const [recipeResult] = await connection.query(
        `INSERT INTO crafting_recipes (item_id, fee_spina, crafting_fee_material, crafting_material_type, unlock_condition)
         VALUES (?, ?, ?, ?, ?)`,
        [
          itemId,
          recipe.fee_spina || 0,
          recipe.crafting_fee_material || 0,
          recipe.crafting_material_type || 'Metal',
          recipe.unlock_condition || null
        ]
      );
      const recipeId = recipeResult.insertId;

      if (Array.isArray(recipe.materials) && recipe.materials.length > 0) {
        for (const mat of recipe.materials) {
          if (mat.material_item_id && mat.quantity_required) {
            await connection.query(
              `INSERT INTO recipe_materials (recipe_id, material_item_id, quantity_required) VALUES (?, ?, ?)`,
              [recipeId, mat.material_item_id, mat.quantity_required]
            );
          }
        }
      }
    }

    // Insert drops if provided
    if (Array.isArray(drops) && drops.length > 0) {
      for (const d of drops) {
        if (d.boss_id) {
          await connection.query(
            `INSERT INTO boss_drops (boss_id, item_id, diff_id, part_break_required, part_break_bonus, drop_rate_category)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              d.boss_id,
              itemId,
              d.diff_id || null,
              d.part_break_required ? 1 : 0,
              d.part_break_bonus ? 1 : 0,
              d.drop_rate_category || 'Common'
            ]
          );
        }
      }
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Item created successfully', item_id: itemId });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating item:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

// PUT /api/items/:id - Update item
router.put('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const itemId = req.params.id;

    const {
      name_th,
      name_en,
      item_type,
      is_tradable,
      sub_type,
      base_atk_min,
      base_atk_max,
      base_def,
      stability,
      main_stats,
      conditional_bonus,
      crysta
    } = req.body;

    await connection.query(
      `UPDATE items SET name_th = ?, name_en = ?, item_type = ?, is_tradable = ? WHERE item_id = ?`,
      [name_th, name_en || null, item_type, is_tradable ? 1 : 0, itemId]
    );

    const statsJson = typeof main_stats === 'object' ? JSON.stringify(main_stats) : (main_stats || null);
    const condJson = typeof conditional_bonus === 'object' ? JSON.stringify(conditional_bonus) : (conditional_bonus || null);

    // Update equipment stats
    const [existingStats] = await connection.query(`SELECT equip_id FROM equipment_stats WHERE item_id = ?`, [itemId]);
    if (existingStats.length > 0) {
      await connection.query(
        `UPDATE equipment_stats SET sub_type = ?, base_atk_min = ?, base_atk_max = ?, base_def = ?, stability = ?, main_stats = ?, conditional_bonus = ? WHERE item_id = ?`,
        [sub_type || null, base_atk_min || null, base_atk_max || null, base_def || null, stability || null, statsJson, condJson, itemId]
      );
    } else if (sub_type || base_atk_min || base_def) {
      await connection.query(
        `INSERT INTO equipment_stats (item_id, sub_type, base_atk_min, base_atk_max, base_def, stability, main_stats, conditional_bonus)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [itemId, sub_type || null, base_atk_min || null, base_atk_max || null, base_def || null, stability || null, statsJson, condJson]
      );
    }

    // Update crysta stats if Crysta item
    if (item_type === 'Crysta' || crysta) {
      const [existingCrysta] = await connection.query(`SELECT crysta_id FROM crysta_stats WHERE item_id = ?`, [itemId]);
      const cType = crysta?.crysta_type || 'Normal';
      const cColor = crysta?.color || 'Yellow';
      const cUpgradeFrom = crysta?.upgrade_from_item_id || null;
      const cStats = typeof (crysta?.stats || main_stats) === 'object' ? JSON.stringify(crysta?.stats || main_stats) : (crysta?.stats || main_stats || null);
      const cCond = typeof (crysta?.conditional_bonus || conditional_bonus) === 'object' ? JSON.stringify(crysta?.conditional_bonus || conditional_bonus) : (crysta?.conditional_bonus || conditional_bonus || null);

      if (existingCrysta.length > 0) {
        await connection.query(
          `UPDATE crysta_stats SET crysta_type = ?, color = ?, upgrade_from_item_id = ?, stats = ?, conditional_bonus = ? WHERE item_id = ?`,
          [cType, cColor, cUpgradeFrom, cStats, cCond, itemId]
        );
      } else {
        await connection.query(
          `INSERT INTO crysta_stats (item_id, crysta_type, color, upgrade_from_item_id, stats, conditional_bonus)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [itemId, cType, cColor, cUpgradeFrom, cStats, cCond]
        );
      }
    }

    await connection.commit();
    res.json({ success: true, message: 'Item updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating item:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

// DELETE /api/items/:id - Delete item
router.delete('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const itemId = req.params.id;

    // Delete associated records
    await connection.query(`DELETE FROM equipment_stats WHERE item_id = ?`, [itemId]);
    await connection.query(`DELETE FROM crysta_stats WHERE item_id = ?`, [itemId]);
    await connection.query(`DELETE FROM boss_drops WHERE item_id = ?`, [itemId]);
    await connection.query(`DELETE FROM recipe_materials WHERE material_item_id = ?`, [itemId]);
    
    // Find recipe id to delete its materials
    const [recipes] = await connection.query(`SELECT recipe_id FROM crafting_recipes WHERE item_id = ?`, [itemId]);
    for (const r of recipes) {
      await connection.query(`DELETE FROM recipe_materials WHERE recipe_id = ?`, [r.recipe_id]);
    }
    await connection.query(`DELETE FROM crafting_recipes WHERE item_id = ?`, [itemId]);

    const [delResult] = await connection.query(`DELETE FROM items WHERE item_id = ?`, [itemId]);

    await connection.commit();
    if (delResult.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
