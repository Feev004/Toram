'use client';

import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Sword, 
  Shield, 
  Sparkles, 
  Hammer, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function AddItemModal({ isOpen, onClose, onItemCreated }) {
  const [formData, setFormData] = useState({
    name_th: '',
    name_en: '',
    item_type: 'Weapon',
    is_tradable: 1,
    sub_type: 'One-Handed Sword',
    base_atk_min: '',
    base_atk_max: '',
    base_def: '',
    stability: '80',
    element: 'Fire',
    main_stats_json: '{\n  "element": "Fire",\n  "damage_to_earth": "+10%",\n  "short_range_damage": "+12%",\n  "critical_rate": 120,\n  "aspd": 1000\n}',
    conditional_bonus_json: '{\n  "condition": "With Shield",\n  "aggro": "+50%",\n  "physical_pierce": "+30%"\n}',
    has_recipe: false,
    fee_spina: '50000',
    crafting_fee_material: '1500',
    crafting_material_type: 'Metal',
    unlock_condition: 'เคลียร์เนื้อเรื่องหลักบทที่ 15'
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name_th.trim()) {
      setStatusMsg({ type: 'error', text: 'กรุณากรอกชื่อไอเทมภาษาไทย' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    try {
      let parsedMain = null;
      let parsedCond = null;

      if (formData.main_stats_json?.trim()) {
        try {
          parsedMain = JSON.parse(formData.main_stats_json);
        } catch (err) {
          setStatusMsg({ type: 'error', text: 'รูปแบบ JSON สเตตัสหลักไม่ถูกต้อง' });
          setLoading(false);
          return;
        }
      }

      if (formData.conditional_bonus_json?.trim()) {
        try {
          parsedCond = JSON.parse(formData.conditional_bonus_json);
        } catch (err) {
          setStatusMsg({ type: 'error', text: 'รูปแบบ JSON สเตตัสโบนัสพิเศษไม่ถูกต้อง' });
          setLoading(false);
          return;
        }
      }

      const payload = {
        name_th: formData.name_th,
        name_en: formData.name_en || null,
        item_type: formData.item_type,
        is_tradable: parseInt(formData.is_tradable, 10),
        sub_type: formData.sub_type || null,
        base_atk_min: formData.base_atk_min ? parseInt(formData.base_atk_min, 10) : null,
        base_atk_max: formData.base_atk_max ? parseInt(formData.base_atk_max, 10) : null,
        base_def: formData.base_def ? parseInt(formData.base_def, 10) : null,
        stability: formData.stability ? parseInt(formData.stability, 10) : null,
        main_stats: parsedMain,
        conditional_bonus: parsedCond
      };

      if (formData.has_recipe) {
        payload.recipe = {
          fee_spina: parseInt(formData.fee_spina, 10) || 0,
          crafting_fee_material: parseInt(formData.crafting_fee_material, 10) || 0,
          crafting_material_type: formData.crafting_material_type,
          unlock_condition: formData.unlock_condition
        };
      }

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setStatusMsg({ type: 'success', text: 'สร้างไอเทมใหม่ลงฐานข้อมูล toram สำเร็จแล้ว!' });
        setTimeout(() => {
          onItemCreated && onItemCreated();
          onClose();
        }, 1200);
      } else {
        setStatusMsg({ type: 'error', text: json.message || json.error || 'เกิดข้อผิดพลาดในการบันทึก' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 22, 36, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>เพิ่มไอเทมใหม่เข้าสู่ระบบ</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {statusMsg && (
            <div className={`pma-banner ${statusMsg.type === 'success' ? 'success' : 'error'}`} style={{ margin: 0 }}>
              {statusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                ชื่อภาษาไทย *
              </label>
              <input
                type="text"
                className="search-input"
                style={{ padding: '0.55rem 0.85rem' }}
                placeholder="เช่น เจมินัสซอร์ด"
                value={formData.name_th}
                onChange={(e) => setFormData({ ...formData, name_th: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                ชื่อภาษาอังกฤษ
              </label>
              <input
                type="text"
                className="search-input"
                style={{ padding: '0.55rem 0.85rem' }}
                placeholder="เช่น Geminus Sword"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                ประเภทไอเทม
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.item_type}
                onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
              >
                <option value="Weapon">Weapon (อาวุธ)</option>
                <option value="Armor">Armor (ชุดเกราะ)</option>
                <option value="Additional">Additional (อุปกรณ์เสริม)</option>
                <option value="Special">Special (อุปกรณ์พิเศษ)</option>
                <option value="Crysta">Crysta (คริสต้า)</option>
                <option value="Material">Material (วัตถุดิบ)</option>
                <option value="Usable">Usable (ไอเทมกดใช้)</option>
              </select>
            </div>
            <div>
              {formData.item_type === 'Crysta' ? (
                <>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    ประเภทคริสต้า (Crysta Type)
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={formData.crysta_type || 'Upgrade'}
                    onChange={(e) => setFormData({ ...formData, crysta_type: e.target.value })}
                  >
                    <option value="Normal">Normal (คริสต้าทั่วไป)</option>
                    <option value="Weapon">Weapon (อาวุธ)</option>
                    <option value="Armor">Armor (ชุดเกราะ)</option>
                    <option value="Additional">Additional (อุปกรณ์เสริม)</option>
                    <option value="Special">Special (อุปกรณ์พิเศษ)</option>
                    <option value="Upgrade">Upgrade (คริสต้าอัพเกรด)</option>
                  </select>
                </>
              ) : (
                <>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    สายอุปกรณ์ (Sub Type)
                  </label>
                  <select
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={formData.sub_type}
                    onChange={(e) => setFormData({ ...formData, sub_type: e.target.value })}
                  >
                    <option value="One-Handed Sword">One-Handed Sword</option>
                    <option value="Two-Handed Sword">Two-Handed Sword</option>
                    <option value="Bow">Bow</option>
                    <option value="Bowgun">Bowgun</option>
                    <option value="Staff">Staff</option>
                    <option value="Magic Device">Magic Device</option>
                    <option value="Knuckle">Knuckle</option>
                    <option value="Halberd">Halberd</option>
                    <option value="Katana">Katana</option>
                    <option value="Shield">Shield</option>
                    <option value="Armor">Armor</option>
                    <option value="Additional">Additional</option>
                    <option value="Special">Special</option>
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Crysta Color & Upgrade From if Crysta */}
          {formData.item_type === 'Crysta' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(234, 179, 8, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(234, 179, 8, 0.25)' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#fde047', display: 'block', marginBottom: '0.35rem' }}>
                  สีของคริสต้า (Color)
                </label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={formData.crysta_color || 'Yellow'}
                  onChange={(e) => setFormData({ ...formData, crysta_color: e.target.value })}
                >
                  <option value="Yellow">สีเหลือง (Yellow)</option>
                  <option value="Red">สีแดง (Red)</option>
                  <option value="Blue">สีฟ้า (Blue)</option>
                  <option value="Green">สีเขียว (Green)</option>
                  <option value="Purple">สีม่วง (Purple)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#d8b4fe', display: 'block', marginBottom: '0.35rem' }}>
                  อัพเกรดต่อจาก Item ID (ถ้ามี)
                </label>
                <input
                  type="number"
                  className="search-input"
                  style={{ padding: '0.55rem' }}
                  placeholder="เช่น 9 (Don Profundo)"
                  value={formData.upgrade_from_item_id || ''}
                  onChange={(e) => setFormData({ ...formData, upgrade_from_item_id: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Base Stats if equipment */}
          {formData.item_type !== 'Crysta' && (
            <div style={{ background: 'rgba(10, 13, 20, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#67e8f9', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sword className="w-4 h-4" />
                <span>Base Equipment Stats</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>ATK Min</label>
                  <input type="number" className="search-input" style={{ padding: '0.45rem' }} value={formData.base_atk_min} onChange={e => setFormData({ ...formData, base_atk_min: e.target.value })} placeholder="692" />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>ATK Max</label>
                  <input type="number" className="search-input" style={{ padding: '0.45rem' }} value={formData.base_atk_max} onChange={e => setFormData({ ...formData, base_atk_max: e.target.value })} placeholder="698" />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Base DEF</label>
                  <input type="number" className="search-input" style={{ padding: '0.45rem' }} value={formData.base_def} onChange={e => setFormData({ ...formData, base_def: e.target.value })} placeholder="0" />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Stability %</label>
                  <input type="number" className="search-input" style={{ padding: '0.45rem' }} value={formData.stability} onChange={e => setFormData({ ...formData, stability: e.target.value })} placeholder="80" />
                </div>
              </div>
            </div>
          )}

          {/* JSON Stats Inputs */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Main Stats (JSON Format)
            </label>
            <textarea
              className="sql-editor-textarea"
              style={{ minHeight: '90px', padding: '0.75rem', fontSize: '0.85rem' }}
              value={formData.main_stats_json}
              onChange={(e) => setFormData({ ...formData, main_stats_json: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Conditional Bonus (JSON Format)
            </label>
            <textarea
              className="sql-editor-textarea"
              style={{ minHeight: '75px', padding: '0.75rem', fontSize: '0.85rem' }}
              value={formData.conditional_bonus_json}
              onChange={(e) => setFormData({ ...formData, conditional_bonus_json: e.target.value })}
            />
          </div>

          {/* Crafting Options Toggle */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#fbbf24', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.has_recipe}
                onChange={(e) => setFormData({ ...formData, has_recipe: e.target.checked })}
              />
              <span>เพิ่มสูตรคราฟต์ไอเทมนี้ที่โรงตีบวก</span>
            </label>

            {formData.has_recipe && (
              <div style={{ marginTop: '0.85rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ค่าทำ Spina</label>
                  <input type="number" className="search-input" style={{ padding: '0.45rem' }} value={formData.fee_spina} onChange={e => setFormData({ ...formData, fee_spina: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>แต้มวัตถุดิบ</label>
                  <input type="number" className="search-input" style={{ padding: '0.45rem' }} value={formData.crafting_fee_material} onChange={e => setFormData({ ...formData, crafting_fee_material: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ประเภทแต้ม</label>
                  <select className="filter-select" style={{ width: '100%', padding: '0.45rem' }} value={formData.crafting_material_type} onChange={e => setFormData({ ...formData, crafting_material_type: e.target.value })}>
                    <option value="Metal">Metal</option>
                    <option value="Beast">Beast</option>
                    <option value="Wood">Wood</option>
                    <option value="Cloth">Cloth</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Mana">Mana</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : 'บันทึกลง Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
