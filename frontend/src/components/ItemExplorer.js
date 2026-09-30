'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Sword, 
  Shield, 
  Sparkles, 
  Hammer, 
  Zap, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain, 
  Sun, 
  Moon, 
  ChevronRight,
  ExternalLink,
  Package,
  Layers,
  Crown
} from 'lucide-react';

export default function ItemExplorer({ onSelectItem }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ item_types: [], sub_types: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSubType, setSelectedSubType] = useState('All');

  useEffect(() => {
    fetchMeta();
    fetchItems();
  }, [search, selectedType, selectedSubType]);

  async function fetchMeta() {
    try {
      const res = await fetch('/api/items/types/meta');
      const json = await res.json();
      if (json.success) {
        setMeta(json.data);
      }
    } catch (e) {
      console.error('Failed to load metadata', e);
    }
  }

  async function fetchItems() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedType !== 'All') params.append('type', selectedType);
      if (selectedSubType !== 'All') params.append('sub_type', selectedSubType);

      const res = await fetch(`/api/items?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
      }
    } catch (e) {
      console.error('Failed to load items', e);
    } finally {
      setLoading(false);
    }
  }

  // Format stat display keys to human-readable Thai/English
  function formatStatKey(key) {
    const map = {
      element: 'ธาตุ',
      damage_to_earth: 'ดาเมจต่อดิน',
      damage_to_fire: 'ดาเมจต่อไฟ',
      damage_to_water: 'ดาเมจต่อน้ำ',
      damage_to_wind: 'ดาเมจต่อลม',
      damage_to_light: 'ดาเมจต่อแสง',
      damage_to_dark: 'ดาเมจต่อมืด',
      short_range_damage: 'ระยะใกล้ (SRD)',
      long_range_damage: 'ระยะไกล (LRD)',
      critical_rate: 'คริติคอล',
      critical_damage: 'แรงคริ',
      aspd: 'ความเร็วโจมตี (ASPD)',
      cspd: 'ความเร็วร่าย (CSPD)',
      guard_recharge: 'ฟื้นการ์ด',
      guard_power: 'พลังการ์ด',
      anticipate: 'หลบเลี่ยงทะลุ',
      ailment_resistance: 'ต้านสถานะ',
      physical_pierce: 'เจาะเกราะกายภาพ',
      magic_pierce: 'เจาะเกราะเวท',
      aggro: 'ดึงดูดศัตรู (Aggro)'
    };
    return map[key] || key.replace(/_/g, ' ');
  }

  function getBadgeClass(type) {
    switch (type) {
      case 'Weapon': return 'badge-weapon';
      case 'Armor': return 'badge-armor';
      case 'Additional': return 'badge-additional';
      case 'Special': return 'badge-special';
      case 'Crysta': return 'badge-crysta';
      default: return 'badge-material';
    }
  }

  function renderElementIcon(elem) {
    if (!elem) return null;
    const lower = elem.toLowerCase();
    if (lower === 'fire') return <Flame className="w-3.5 h-3.5 text-red-400" />;
    if (lower === 'water') return <Droplets className="w-3.5 h-3.5 text-blue-400" />;
    if (lower === 'wind') return <Wind className="w-3.5 h-3.5 text-emerald-400" />;
    if (lower === 'earth') return <Mountain className="w-3.5 h-3.5 text-amber-500" />;
    if (lower === 'light') return <Sun className="w-3.5 h-3.5 text-yellow-300" />;
    if (lower === 'dark') return <Moon className="w-3.5 h-3.5 text-purple-400" />;
    return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
  }

  return (
    <div>
      {/* Hero Overview Header */}
      <div className="hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sword className="w-7 h-7 text-cyan-400" />
              Toram Online Item Database
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
              ค้นหาข้อมูลอาวุธ ชุด อุปกรณ์ สเตตัสหลัก/เงื่อนไขพิเศษ สูตรคราฟต์ และจุดดรอปจากบอส
            </p>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9' }}>
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="stat-value">{items.length}</div>
              <div className="stat-label">ไอเทมที่แสดง</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Sword className="w-5 h-5" />
            </div>
            <div>
              <div className="stat-value">{items.filter(i => i.item_type === 'Weapon').length}</div>
              <div className="stat-label">อาวุธในระบบ</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe' }}>
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="stat-value">{items.filter(i => i.bosses?.length > 0).length}</div>
              <div className="stat-label">ไอเทมดรอปจากบอส</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <div className="stat-value">{items.filter(i => i.recipe_id).length}</div>
              <div className="stat-label">มีสูตรคราฟต์</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="w-4 h-4 search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาชื่อไอเทม (ไทย / อังกฤษ) เช่น เจมินัสซอร์ด, Geminus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="filter-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All">ทุกประเภทไอเทม (All Types)</option>
            {meta.item_types?.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedSubType}
            onChange={(e) => setSelectedSubType(e.target.value)}
          >
            <option value="All">ทุกสายอุปกรณ์ (All Sub Types)</option>
            {meta.sub_types?.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Item List Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div className="pulse-dot" style={{ margin: '0 auto 1rem', width: '12px', height: '12px' }} />
          กำลังโหลดข้อมูลไอเทมจาก Toram Database...
        </div>
      ) : items.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <Package className="w-12 h-12 text-slate-600" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>ไม่พบไอเทมที่ค้นหา</h3>
          <p style={{ color: 'var(--text-secondary)' }}>ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองประเภทไอเทม</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <div 
              key={item.item_id} 
              className="item-card"
              onClick={() => onSelectItem(item.item_id)}
            >
              <div className="item-card-header">
                <div>
                  <div className="item-title">{item.name_th}</div>
                  <div className="item-subtitle">{item.name_en || '—'}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <span className={`type-badge ${getBadgeClass(item.item_type)}`}>
                      {item.item_type}
                    </span>
                    {item.source_types && item.source_types.length > 0 ? (
                      item.source_types.map((st, sIdx) => (
                        <span key={sIdx} style={{ 
                          fontSize: '0.7rem', 
                          padding: '0.15rem 0.45rem', 
                          borderRadius: '4px',
                          fontWeight: 700,
                          background: st === 'Boss Drop' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: st === 'Boss Drop' ? '#fca5a5' : '#fde047',
                          border: st === 'Boss Drop' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                        }}>
                          {st}
                        </span>
                      ))
                    ) : item.source_type ? (
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.15rem 0.45rem', 
                        borderRadius: '4px',
                        fontWeight: 700,
                        background: item.source_type === 'Boss Drop' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: item.source_type === 'Boss Drop' ? '#fca5a5' : '#fde047',
                        border: item.source_type === 'Boss Drop' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                      }}>
                        {item.source_type}
                      </span>
                    ) : null}
                  </div>
                  {item.sub_type && (
                    <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
                      {item.sub_type}
                    </span>
                  )}
                  {item.equipment_versions?.length > 1 && (
                    <span style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 700, background: 'rgba(167, 139, 250, 0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                      ⚡ {item.equipment_versions.length} เวอร์ชันสเตตัส
                    </span>
                  )}
                  {item.crysta && (
                    <span style={{ fontSize: '0.72rem', color: '#fde047', fontWeight: 700 }}>
                      ◆ {item.crysta.crysta_type} ({item.crysta.color || 'Yellow'})
                    </span>
                  )}
                </div>
              </div>

              {/* Upgrade Lineage for Crysta */}
              {item.crysta?.upgrade_from_name_th && (
                <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px dashed rgba(168, 85, 247, 0.4)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#d8b4fe' }}>
                  ⚡ <strong>อัพเกรดต่อจาก:</strong> {item.crysta.upgrade_from_name_th}
                </div>
              )}

              {/* Base Stats Bar if equipment */}
              {(item.base_atk_display || item.base_def || item.stability) && (
                <div className="base-stats-row">
                  {item.base_atk_display && (
                    <div className="base-stat-pill">
                      <Sword className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="stat-tag">ATK:</span>
                      <span className="stat-num" style={{ color: '#67e8f9' }}>{item.base_atk_display}</span>
                    </div>
                  )}

                  {item.base_def && (
                    <div className="base-stat-pill">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      <span className="stat-tag">DEF:</span>
                      <span className="stat-num" style={{ color: '#93c5fd' }}>{item.base_def}</span>
                    </div>
                  )}

                  {item.stability && (
                    <div className="base-stat-pill">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span className="stat-tag">เสถียร:</span>
                      <span className="stat-num" style={{ color: '#fde047' }}>{item.stability}%</span>
                    </div>
                  )}
                </div>
              )}

              {/* Main Stats Chips */}
              {item.main_stats && typeof item.main_stats === 'object' && Object.keys(item.main_stats).length > 0 && (
                <div className="stats-container">
                  <div className="stat-section-title">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>สเตตัสหลัก</span>
                  </div>
                  <div className="stat-chips">
                    {Object.entries(item.main_stats).map(([k, v]) => {
                      if (k === 'element') {
                        return (
                          <span key={k} className={`stat-chip element-${v.toLowerCase()}`}>
                            {renderElementIcon(v)}
                            <strong>{v} Element</strong>
                          </span>
                        );
                      }
                      return (
                        <span key={k} className="stat-chip">
                          <span style={{ color: 'var(--text-secondary)' }}>{formatStatKey(k)}:</span>
                          <strong style={{ color: '#f8fafc' }}>{v}</strong>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Conditional Bonus */}
              {item.conditional_bonus && typeof item.conditional_bonus === 'object' && (
                <div className="stats-container">
                  <div className="conditional-chip">
                    <div style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.2rem', color: '#fde047' }}>
                      ⚡ เงื่อนไข: {item.conditional_bonus.condition || 'เงื่อนไขพิเศษ'}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', fontSize: '0.75rem' }}>
                      {Object.entries(item.conditional_bonus)
                        .filter(([k]) => k !== 'condition')
                        .map(([k, v]) => (
                          <span key={k} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                            {formatStatKey(k)}: <strong>{v}</strong>
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Crafting unlock or requirement */}
              {item.unlock_condition && (
                <div style={{ fontSize: '0.78rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.08)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(245, 158, 11, 0.3)' }}>
                  🔨 <strong>เงื่อนไขคราฟต์:</strong> {item.unlock_condition}
                </div>
              )}

              {/* Card Footer: Boss & Craft indicators */}
              <div className="card-footer">
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {item.bosses?.map((b) => (
                    <span key={b.boss_id} className="boss-badge">
                      🐉 บอส: {b.name_th}
                    </span>
                  ))}
                  {item.recipe_id && (
                    <span className="craft-badge">
                      <Hammer className="w-3 h-3" />
                      คราฟต์ ({item.fee_spina?.toLocaleString()} Spina)
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  <span>ดูรายละเอียด</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
