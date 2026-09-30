-- ==========================================================
-- Toram Online Database Schema & Initial Seed Data (Synchronized)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `toram` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `toram`;

-- 1. Elements Table
CREATE TABLE IF NOT EXISTS `elements` (
  `element_id` int(11) NOT NULL AUTO_INCREMENT,
  `element_name` varchar(50) NOT NULL,
  `weak_against_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`element_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `elements` (`element_id`, `element_name`, `weak_against_id`) VALUES
(1, 'Neutral', NULL),
(2, 'Fire', 5),
(3, 'Earth', 2),
(4, 'Wind', 3),
(5, 'Water', 4),
(6, 'Light', 7),
(7, 'Dark', 6)
ON DUPLICATE KEY UPDATE `element_name`=VALUES(`element_name`), `weak_against_id`=VALUES(`weak_against_id`);

-- 2. Maps Table
CREATE TABLE IF NOT EXISTS `maps` (
  `map_id` int(11) NOT NULL AUTO_INCREMENT,
  `map_name_th` varchar(100) NOT NULL,
  `map_name_en` varchar(100) DEFAULT NULL,
  `chapter` int(11) DEFAULT NULL,
  PRIMARY KEY (`map_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `maps` (`map_id`, `map_name_th`, `map_name_en`, `chapter`) VALUES
(1, 'ป่าวิดก้า: ส่วนลึก', 'Wizka Forest: Depths', 15),
(2, 'ชายฝั่งดูเซีย: ส่วนลึก', 'Ducia Coast: Depths', 9)
ON DUPLICATE KEY UPDATE `map_name_th`=VALUES(`map_name_th`), `map_name_en`=VALUES(`map_name_en`), `chapter`=VALUES(`chapter`);

-- 3. Items Table
CREATE TABLE IF NOT EXISTS `items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `name_th` varchar(100) NOT NULL,
  `name_en` varchar(100) DEFAULT NULL,
  `item_type` enum('Weapon','Armor','Additional','Special','Crysta','Material','Usable') NOT NULL,
  `is_tradable` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `items` (`item_id`, `name_th`, `name_en`, `item_type`, `is_tradable`) VALUES
(1, 'ผิวชั้นนอกทวิคราส', 'Twi-Eclipse Outer Skin', 'Material', 1),
(2, 'แขนทรงพลังทวิคราส', 'Twi-Eclipse Power Arm', 'Material', 1),
(3, 'แกนสั่นพ้อง', 'Resonance Core', 'Material', 1),
(4, 'เจมินัสซอร์ด', 'Geminus Sword', 'Weapon', 0),
(5, 'เจมินัสชิลด์', 'Geminus Shield', 'Additional', 0),
(6, 'คริสต้าดอย', 'Doy Crysta', 'Crysta', 1),
(7, 'คริสต้ามาริ', 'Mari Crysta', 'Crysta', 1),
(8, 'วงล้อสวรรค์ทวิคราส', 'Twi-Eclipse Heavenly Wheel', 'Material', 1),
(9, 'ดอน โปรฟันโด', 'Don Profundo', 'Crysta', 1),
(10, 'ฟิลโรคาส', 'Filrocas', 'Crysta', 1),
(11, 'อัศวินดำแห่งภาพหลอน', 'Black Knight of Delusion', 'Crysta', 1),
(12, 'กไวโมล', 'Gwaimol', 'Crysta', 1),
(13, 'เฮกซ์เตอร์', 'Hexter', 'Crysta', 1),
(14, 'อีโรเด็ด พิลซ์', 'Eroded Pilz', 'Crysta', 1),
(15, 'กระดูกพิสเตอุส', 'Pisteus Bone', 'Material', 1),
(16, 'ครีบพิสเตอุส', 'Pisteus Fin', 'Material', 1),
(17, 'วิญญาณปีศาจปลา', 'Ghoulfish Soul', 'Material', 1),
(18, 'ฆ้อนสงครามปีศาจปลา', 'Ghoulfish War Hammer', 'Weapon', 0),
(19, 'โล่กูลฟิชบัคเลอร์', 'Ghoulfish Buckler', 'Additional', 0),
(20, 'คริสต้าพิสเตอุส', 'Pisteus Crysta', 'Crysta', 1),
(21, 'โหนกพิสเตอุส', 'Pisteus Horns', 'Material', 1),
(22, 'มอซโต มาคินา', 'Mozto Machina', 'Crysta', 1)
ON DUPLICATE KEY UPDATE `name_th`=VALUES(`name_th`), `name_en`=VALUES(`name_en`), `item_type`=VALUES(`item_type`), `is_tradable`=VALUES(`is_tradable`);

-- 4. Equipment Stats Table
CREATE TABLE IF NOT EXISTS `equipment_stats` (
  `equip_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `source_type` enum('Boss Drop','Crafted','Quest','Drop') DEFAULT 'Boss Drop',
  `sub_type` enum('One-Handed Sword','Two-Handed Sword','Bow','Bowgun','Staff','Magic Device','Knuckle','Halberd','Katana','Shield','Armor','Additional','Special') DEFAULT NULL,
  `base_atk_min` int(11) DEFAULT NULL,
  `base_atk_max` int(11) DEFAULT NULL,
  `base_def` int(11) DEFAULT NULL,
  `stability` int(11) DEFAULT NULL,
  `main_stats` text DEFAULT NULL,
  `conditional_bonus` text DEFAULT NULL,
  PRIMARY KEY (`equip_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `fk_equip_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `equipment_stats` (`equip_id`, `item_id`, `source_type`, `sub_type`, `base_atk_min`, `base_atk_max`, `base_def`, `stability`, `main_stats`, `conditional_bonus`) VALUES
(1, 4, 'Boss Drop', 'One-Handed Sword', 692, 698, NULL, 80, '{\"element\": \"Fire\", \"damage_to_earth\": \"+10%\", \"short_range_damage\": \"+12%\", \"critical_rate\": 120, \"aspd\": 1000}', '{\"condition\": \"With Shield\", \"aggro\": \"+50%\", \"physical_pierce\": \"+30%\"}'),
(2, 5, 'Boss Drop', 'Shield', NULL, NULL, 165, NULL, '{\"guard_recharge\": \"+30%\", \"guard_power\": \"+30%\", \"short_range_damage\": \"+2%\", \"anticipate\": \"+5%\", \"ailment_resistance\": \"+5%\"}', '{\"condition\": \"With One-Handed Sword\", \"ailment_resistance_extra\": \"+5%\", \"magic_resistance\": \"+30%\"}'),
(3, 18, 'Boss Drop', 'Staff', 340, 340, NULL, 30, '{\"physical_pierce\": \"+15%\", \"cspd\": 500, \"attack_mp_recovery\": 20}', '{\"condition\": \"With Shield\", \"physical_resistance\": \"+20%\"}'),
(4, 19, 'Boss Drop', 'Shield', NULL, NULL, 120, NULL, '{\"dex\": \"+3%\", \"physical_pierce\": \"+6%\", \"aspd\": 600, \"water_resistance\": \"+15%\"}', '{\"condition\": \"With Staff\", \"magic_resistance\": \"+20%\"}'),
(5, 18, 'Crafted', 'Staff', 340, 340, NULL, 20, '{\"atk\": \"+8%\", \"physical_pierce\": \"+10%\", \"cspd\": 1000, \"attack_mp_recovery\": 25}', NULL),
(6, 19, 'Crafted', 'Shield', NULL, NULL, 120, NULL, '{\"dex\": \"+3%\", \"physical_pierce\": \"+6%\", \"aspd\": 300, \"water_resistance\": \"+10%\"}', NULL)
ON DUPLICATE KEY UPDATE `source_type`=VALUES(`source_type`), `sub_type`=VALUES(`sub_type`), `base_atk_min`=VALUES(`base_atk_min`), `base_atk_max`=VALUES(`base_atk_max`), `base_def`=VALUES(`base_def`), `stability`=VALUES(`stability`), `main_stats`=VALUES(`main_stats`), `conditional_bonus`=VALUES(`conditional_bonus`);

-- 5. Crysta Stats Table
CREATE TABLE IF NOT EXISTS `crysta_stats` (
  `crysta_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `crysta_type` enum('Normal','Weapon','Armor','Additional','Special','Upgrade') NOT NULL DEFAULT 'Upgrade',
  `color` varchar(30) DEFAULT 'Yellow',
  `upgrade_from_item_id` int(11) DEFAULT NULL,
  `stats` text DEFAULT NULL,
  `conditional_bonus` text DEFAULT NULL,
  PRIMARY KEY (`crysta_id`),
  KEY `item_id` (`item_id`),
  KEY `upgrade_from_item_id` (`upgrade_from_item_id`),
  CONSTRAINT `fk_crysta_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_crysta_upgrade_from` FOREIGN KEY (`upgrade_from_item_id`) REFERENCES `items` (`item_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `crysta_stats` (`crysta_id`, `item_id`, `crysta_type`, `color`, `upgrade_from_item_id`, `stats`, `conditional_bonus`) VALUES
(5, 11, 'Weapon', 'Red', NULL, '{\"atk\": \"+4%\", \"str\": \"+3%\", \"critical_rate\": \"+2%\", \"def\": \"-9%\"}', NULL),
(6, 12, 'Upgrade', 'Red', 11, '{\"atk\": \"+6%\", \"str\": \"+4%\", \"critical_rate\": \"+4%\", \"def\": \"-15%\"}', NULL),
(7, 13, 'Upgrade', 'Red', 12, '{\"atk\": \"+8%\", \"str\": \"+6%\", \"critical_rate\": \"+6%\", \"def\": \"-21%\"}', NULL),
(8, 9, 'Upgrade', 'Red', 13, '{\"atk\": \"+10%\", \"str\": \"+7%\", \"critical_rate\": \"+8%\", \"def\": \"-27%\"}', NULL),
(9, 6, 'Upgrade', 'Red', 9, '{\"atk\": \"+12%\", \"str\": \"+8%\", \"critical_rate\": \"+10%\", \"def\": \"-33%\"}', NULL),
(10, 14, 'Armor', 'Green', NULL, '{\"max_hp\": \"+30%\", \"physical_resistance\": \"-10%\", \"magic_resistance\": \"-10%\"}', NULL),
(11, 10, 'Upgrade', 'Green', 14, '{\"max_hp\": \"+60%\", \"physical_resistance\": \"-7%\", \"magic_resistance\": \"-7%\"}', NULL),
(12, 7, 'Upgrade', 'Green', 10, '{\"max_hp\": \"+70%\", \"physical_resistance\": \"-3%\", \"magic_resistance\": \"-3%\"}', '{\"condition\": \"With One-Handed Sword\", \"aggro\": \"+20%\"}'),
(13, 20, 'Upgrade', 'Red', 22, '{\"dex\": \"+5%\", \"matk\": \"+7%\", \"cspd\": \"+3%\"}', NULL)
ON DUPLICATE KEY UPDATE `crysta_type`=VALUES(`crysta_type`), `color`=VALUES(`color`), `upgrade_from_item_id`=VALUES(`upgrade_from_item_id`), `stats`=VALUES(`stats`), `conditional_bonus`=VALUES(`conditional_bonus`);

-- 6. Bosses Table
CREATE TABLE IF NOT EXISTS `bosses` (
  `boss_id` int(11) NOT NULL AUTO_INCREMENT,
  `name_th` varchar(100) NOT NULL,
  `name_en` varchar(100) DEFAULT NULL,
  `boss_type` enum('Boss','Mini Boss','Raid') DEFAULT 'Boss',
  `element_id` int(11) DEFAULT NULL,
  `element_notes` varchar(255) DEFAULT NULL,
  `breakable_parts` tinyint(2) DEFAULT 0,
  `map_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`boss_id`),
  KEY `map_id` (`map_id`),
  CONSTRAINT `fk_boss_map` FOREIGN KEY (`map_id`) REFERENCES `maps` (`map_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `bosses` (`boss_id`, `name_th`, `name_en`, `boss_type`, `element_id`, `element_notes`, `breakable_parts`, `map_id`) VALUES
(1, 'ดอย & มาริ', 'Doy & Mari', 'Boss', NULL, 'ดอย (Doy): ลม (แพ้ดิน) | มาริ (Mari): ไฟ (แพ้น้ำ)', 2, 1),
(2, 'พิสเตอุส', 'Pisteus', 'Boss', 5, NULL, 3, 2)
ON DUPLICATE KEY UPDATE `name_th`=VALUES(`name_th`), `name_en`=VALUES(`name_en`), `element_id`=VALUES(`element_id`), `element_notes`=VALUES(`element_notes`), `breakable_parts`=VALUES(`breakable_parts`), `map_id`=VALUES(`map_id`);

-- 7. Boss Difficulties Table
CREATE TABLE IF NOT EXISTS `boss_difficulties` (
  `diff_id` int(11) NOT NULL AUTO_INCREMENT,
  `boss_id` int(11) NOT NULL,
  `difficulty` enum('Easy','Normal','Hard','Nightmare','Ultimate') NOT NULL,
  `level` int(11) DEFAULT NULL,
  `hp` bigint(20) DEFAULT NULL,
  `exp` int(11) DEFAULT NULL,
  `def` int(11) DEFAULT 0,
  `mdef` int(11) DEFAULT 0,
  PRIMARY KEY (`diff_id`),
  KEY `boss_id` (`boss_id`),
  CONSTRAINT `fk_diff_boss` FOREIGN KEY (`boss_id`) REFERENCES `bosses` (`boss_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `boss_difficulties` (`diff_id`, `boss_id`, `difficulty`, `level`, `hp`, `exp`, `def`, `mdef`) VALUES
(2, 1, 'Easy', 303, 1510000, 5350, 0, 0),
(3, 1, 'Normal', 313, 15100000, 53500, 0, 0),
(4, 1, 'Hard', 323, 30200000, 107000, 0, 0),
(5, 1, 'Nightmare', 333, 75500000, 267500, 0, 0),
(6, 1, 'Ultimate', 353, 151000000, 535000, 0, 0),
(7, 2, 'Easy', 183, 232000, 1130, 0, 0),
(8, 2, 'Normal', 193, 2320000, 11300, 0, 0),
(9, 2, 'Hard', 203, 4640000, 22600, 0, 0),
(10, 2, 'Nightmare', 213, 11600000, 56500, 0, 0),
(11, 2, 'Ultimate', 233, 23200000, 113000, 0, 0)
ON DUPLICATE KEY UPDATE `level`=VALUES(`level`), `hp`=VALUES(`hp`), `exp`=VALUES(`exp`);

-- 8. Boss Drops Table
CREATE TABLE IF NOT EXISTS `boss_drops` (
  `drop_id` int(11) NOT NULL AUTO_INCREMENT,
  `boss_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `diff_id` int(11) DEFAULT NULL,
  `part_break_required` tinyint(1) DEFAULT 0,
  `part_break_bonus` tinyint(1) DEFAULT 0,
  `drop_rate_category` enum('Common','Uncommon','Rare','Super Rare') DEFAULT 'Common',
  PRIMARY KEY (`drop_id`),
  KEY `boss_id` (`boss_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `fk_drop_boss` FOREIGN KEY (`boss_id`) REFERENCES `bosses` (`boss_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_drop_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `boss_drops` (`drop_id`, `boss_id`, `item_id`, `diff_id`, `part_break_required`, `part_break_bonus`, `drop_rate_category`) VALUES
(1, 1, 1, NULL, 0, 0, 'Common'),
(2, 1, 2, NULL, 0, 0, 'Common'),
(3, 1, 3, NULL, 0, 0, 'Common'),
(4, 1, 6, NULL, 0, 0, 'Rare'),
(5, 1, 7, NULL, 0, 0, 'Rare'),
(6, 1, 4, NULL, 0, 1, 'Uncommon'),
(7, 1, 5, NULL, 0, 1, 'Uncommon'),
(8, 1, 8, NULL, 1, 0, 'Rare'),
(9, 2, 15, NULL, 0, 0, 'Common'),
(10, 2, 16, NULL, 0, 0, 'Common'),
(11, 2, 17, NULL, 0, 0, 'Common'),
(12, 2, 18, NULL, 0, 1, 'Uncommon'),
(13, 2, 19, NULL, 0, 1, 'Uncommon'),
(14, 2, 20, NULL, 0, 0, 'Rare'),
(15, 2, 21, NULL, 1, 0, 'Rare')
ON DUPLICATE KEY UPDATE `drop_rate_category`=VALUES(`drop_rate_category`);

-- 9. Crafting Recipes Table
CREATE TABLE IF NOT EXISTS `crafting_recipes` (
  `recipe_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `fee_spina` int(11) DEFAULT 0,
  `crafting_fee_material` int(11) DEFAULT 0,
  `crafting_material_type` enum('Metal','Beast','Wood','Cloth','Medicine','Mana') DEFAULT 'Metal',
  `unlock_condition` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`recipe_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `fk_recipe_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `crafting_recipes` (`recipe_id`, `item_id`, `fee_spina`, `crafting_fee_material`, `crafting_material_type`, `unlock_condition`) VALUES
(1, 4, 50000, 1500, 'Metal', 'เคลียร์เนื้อเรื่องหลักบทที่ 15'),
(2, 19, 1950, 0, 'Beast', 'ร้านช่างเหล็ก (NPC Blacksmith)'),
(3, 18, 1950, 0, 'Metal', 'ร้านช่างเหล็ก (NPC Blacksmith)')
ON DUPLICATE KEY UPDATE `fee_spina`=VALUES(`fee_spina`), `crafting_fee_material`=VALUES(`crafting_fee_material`), `crafting_material_type`=VALUES(`crafting_material_type`), `unlock_condition`=VALUES(`unlock_condition`);

-- 10. Recipe Materials Table
CREATE TABLE IF NOT EXISTS `recipe_materials` (
  `mat_id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_id` int(11) NOT NULL,
  `material_item_id` int(11) NOT NULL,
  `quantity_required` int(11) NOT NULL,
  PRIMARY KEY (`mat_id`),
  KEY `recipe_id` (`recipe_id`),
  KEY `material_item_id` (`material_item_id`),
  CONSTRAINT `fk_mat_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `crafting_recipes` (`recipe_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mat_item` FOREIGN KEY (`material_item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `recipe_materials` (`mat_id`, `recipe_id`, `material_item_id`, `quantity_required`) VALUES
(1, 1, 2, 3),
(2, 1, 3, 5),
(3, 1, 8, 1),
(4, 2, 17, 2),
(5, 2, 16, 4),
(6, 3, 17, 4),
(7, 3, 15, 2)
ON DUPLICATE KEY UPDATE `quantity_required`=VALUES(`quantity_required`);
