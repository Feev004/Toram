const { pool } = require('../backend/config/db');

async function updateCrystas() {
  try {
    // 1. Check/Insert crysta_stats table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crysta_stats (
        crysta_id int(11) NOT NULL AUTO_INCREMENT,
        item_id int(11) NOT NULL,
        crysta_type enum('Normal','Weapon','Armor','Additional','Special','Upgrade') NOT NULL DEFAULT 'Upgrade',
        color varchar(30) DEFAULT 'Yellow',
        upgrade_from_item_id int(11) DEFAULT NULL,
        stats text DEFAULT NULL,
        conditional_bonus text DEFAULT NULL,
        PRIMARY KEY (crysta_id),
        KEY item_id (item_id),
        KEY upgrade_from_item_id (upgrade_from_item_id),
        CONSTRAINT fk_crysta_item FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE,
        CONSTRAINT fk_crysta_upgrade_from FOREIGN KEY (upgrade_from_item_id) REFERENCES items (item_id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Ensure Don Profundo and Filrocas have stats in crysta_stats
    const [rows9] = await pool.query('SELECT * FROM crysta_stats WHERE item_id = 9');
    if (rows9.length === 0) {
      await pool.query(
        'INSERT INTO crysta_stats (item_id, crysta_type, color, upgrade_from_item_id, stats) VALUES (?, ?, ?, ?, ?)',
        [9, 'Normal', 'Yellow', null, JSON.stringify({ str: '+7%', atk: '+10%', critical_rate: '+8%', def: '-29%' })]
      );
      console.log('Added crysta stats for Don Profundo (Item 9)');
    }

    const [rows10] = await pool.query('SELECT * FROM crysta_stats WHERE item_id = 10');
    if (rows10.length === 0) {
      await pool.query(
        'INSERT INTO crysta_stats (item_id, crysta_type, color, upgrade_from_item_id, stats) VALUES (?, ?, ?, ?, ?)',
        [10, 'Normal', 'Yellow', null, JSON.stringify({ max_hp: '+60%', physical_resistance: '-5%', magic_resistance: '-5%' })]
      );
      console.log('Added crysta stats for Filrocas (Item 10)');
    }

    console.log('Crysta database update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating crystas:', error);
    process.exit(1);
  }
}

updateCrystas();
