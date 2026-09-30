const { pool } = require('../backend/config/db');

function parseJSON(str) {
  if (!str) return null;
  if (typeof str === 'object') return str;
  try { return JSON.parse(str); } catch (e) { return str; }
}

async function testDeduplicatedItems() {
  const [items] = await pool.query(`
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
      GROUP_CONCAT(DISTINCT CONCAT(b.boss_id, ':', b.name_th, ':', IFNULL(b.name_en, ''), ':', IFNULL(bd.drop_rate_category, 'Common')) SEPARATOR ';;') AS boss_drop_list
    FROM items i
    LEFT JOIN crafting_recipes cr ON i.item_id = cr.item_id
    LEFT JOIN crysta_stats cs ON i.item_id = cs.item_id
    LEFT JOIN items prev_c ON cs.upgrade_from_item_id = prev_c.item_id
    LEFT JOIN boss_drops bd ON i.item_id = bd.item_id
    LEFT JOIN bosses b ON bd.boss_id = b.boss_id
    GROUP BY i.item_id
    ORDER BY i.item_id ASC
  `);

  console.log('Total unique items from DB:', items.length);

  // Fetch all equipment stats
  const [allEquipStats] = await pool.query('SELECT * FROM equipment_stats ORDER BY equip_id ASC');
  const equipMap = {};
  for (const es of allEquipStats) {
    if (!equipMap[es.item_id]) equipMap[es.item_id] = [];
    equipMap[es.item_id].push({
      ...es,
      main_stats: parseJSON(es.main_stats),
      conditional_bonus: parseJSON(es.conditional_bonus)
    });
  }

  const result = items.map(item => {
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

  console.log('Result unique items count:', result.length);
  const item18 = result.find(i => i.item_id === 18);
  console.log('Item 18 unique entry:', JSON.stringify(item18, null, 2));

  process.exit(0);
}

testDeduplicatedItems();
