'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Crown, 
  ShieldAlert, 
  Zap, 
  Layers, 
  ChevronRight,
  Gem,
  Award,
  Link as LinkIcon
} from 'lucide-react';

export default function CrystaExplorer({ onSelectItem }) {
  const [crystas, setCrystas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');

  useEffect(() => {
    fetchCrystas();
  }, [search, selectedType, selectedColor]);

  async function fetchCrystas() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedType !== 'All') params.append('crysta_type', selectedType);
      if (selectedColor !== 'All') params.append('color', selectedColor);

      const res = await fetch(`/api/crystas?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setCrystas(json.data || []);
      }
    } catch (e) {
      console.error('Failed to load crystas', e);
    } finally {
      setLoading(false);
    }
  }

  function formatStatKey(key) {
    const map = {
      str: 'STR',
      dex: 'DEX',
      int: 'INT',
      agi: 'AGI',
      vit: 'VIT',
      atk: 'ATK',
      matk: 'MATK',
      max_hp: 'MaxHP',
      max_mp: 'MaxMP',
      critical_rate: 'คริติคอล (CR)',
      critical_damage: 'แรงคริ (CD)',
      aspd: 'ความเร็วโจมตี (ASPD)',
      cspd: 'ความเร็วร่าย (CSPD)',
      def: 'DEF',
      mdef: 'MDEF',
      physical_resistance: 'ต้านทานกายภาพ',
      magic_resistance: 'ต้านทานเวทมนตร์',
      aggro: 'ดึงดูดศัตรู (Aggro)',
      short_range_damage: 'ดาเมจระยะใกล้ (SRD)',
      long_range_damage: 'ดาเมจระยะไกล (LRD)'
    };
    return map[key] || key.replace(/_/g, ' ').toUpperCase();
  }

  function getColorStyle(color) {
    switch (color?.toLowerCase()) {
      case 'yellow':
        return { border: 'rgba(234, 179, 8, 0.4)', bg: 'rgba(234, 179, 8, 0.1)', text: '#facc15', glow: 'rgba(234, 179, 8, 0.25)' };
      case 'red':
        return { border: 'rgba(239, 68, 68, 0.4)', bg: 'rgba(239, 68, 68, 0.1)', text: '#f87171', glow: 'rgba(239, 68, 68, 0.25)' };
      case 'blue':
        return { border: 'rgba(59, 130, 246, 0.4)', bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa', glow: 'rgba(59, 130, 246, 0.25)' };
      case 'green':
        return { border: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(16, 185, 129, 0.1)', text: '#34d399', glow: 'rgba(16, 185, 129, 0.25)' };
      case 'purple':
        return { border: 'rgba(168, 85, 247, 0.4)', bg: 'rgba(168, 85, 247, 0.1)', text: '#c084fc', glow: 'rgba(168, 85, 247, 0.25)' };
      default:
        return { border: 'rgba(6, 182, 212, 0.4)', bg: 'rgba(6, 182, 212, 0.1)', text: '#67e8f9', glow: 'rgba(6, 182, 212, 0.25)' };
    }
  }

  return (
    <div>
      <div className="hero-card">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles className="w-7 h-7 text-yellow-400" />
          Toram Crysta & Upgrade Compendium (คริสต้า / Xtal)
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
          ฐานข้อมูลคริสต้าทั้งหมดในเกม ประเภท (Normal, Weapon, Armor, Upgrade) สายการอัพเกรด และสเตตัสเสริม
        </p>

        <div className="hero-stats">
          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="stat-value">{crystas.length}</div>
              <div className="stat-label">คริสต้าทั้งหมด</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe' }}>
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <div className="stat-value">{crystas.filter(c => c.crysta_type === 'Upgrade').length}</div>
              <div className="stat-label">คริสต้าสายอัพเกรด (Upgrade)</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="stat-value">{crystas.filter(c => c.boss).length}</div>
              <div className="stat-label">ดรอปจากบอส</div>
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
            placeholder="ค้นหาชื่อคริสต้า หรือ สเตตัส เช่น ดอย, มาริ, Don Profundo, ATK, MaxHP..."
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
            <option value="All">ทุกประเภทคริสต้า (All Types)</option>
            <option value="Normal">Normal (คริสต้าทั่วไป)</option>
            <option value="Weapon">Weapon (อาวุธ)</option>
            <option value="Armor">Armor (ชุดเกราะ)</option>
            <option value="Additional">Additional (อุปกรณ์เสริม)</option>
            <option value="Special">Special (อุปกรณ์พิเศษ)</option>
            <option value="Upgrade">Upgrade (คริสต้าอัพเกรด)</option>
          </select>

          <select
            className="filter-select"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option value="All">ทุกสี (All Colors)</option>
            <option value="Yellow">สีเหลือง (Yellow)</option>
            <option value="Red">สีแดง (Red)</option>
            <option value="Blue">สีฟ้า (Blue)</option>
            <option value="Green">สีเขียว (Green)</option>
            <option value="Purple">สีม่วง (Purple)</option>
          </select>
        </div>
      </div>

      {/* Crysta Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div className="pulse-dot" style={{ margin: '0 auto 1rem', width: '12px', height: '12px' }} />
          กำลังโหลดข้อมูลคริสต้า...
        </div>
      ) : crystas.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <Sparkles className="w-12 h-12 text-slate-600" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>ไม่พบคริสต้าที่ค้นหา</h3>
          <p style={{ color: 'var(--text-secondary)' }}>ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรอง</p>
        </div>
      ) : (
        <div className="items-grid">
          {crystas.map((c) => {
            const colorStyle = getColorStyle(c.color);
            return (
              <div 
                key={c.item_id}
                className="item-card"
                onClick={() => onSelectItem(c.item_id)}
                style={{ borderColor: colorStyle.border, boxShadow: `0 0 15px ${colorStyle.glow}` }}
              >
                <div className="item-card-header">
                  <div>
                    <div className="item-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: colorStyle.text, boxShadow: `0 0 8px ${colorStyle.text}` }} />
                      <span>{c.name_th}</span>
                    </div>
                    <div className="item-subtitle">{c.name_en || '—'}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                    <span className="type-badge badge-crysta">
                      {c.crysta_type}
                    </span>
                    {c.color && (
                      <span style={{ fontSize: '0.72rem', color: colorStyle.text, fontWeight: 700 }}>
                        {c.color}
                      </span>
                    )}
                  </div>
                </div>

                {/* Upgrade Lineage Banner if this Crysta upgrades from another */}
                {c.upgrade_from_item_id && c.upgrade_from_name_th && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(c.upgrade_from_item_id);
                    }}
                    style={{
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px dashed rgba(168, 85, 247, 0.4)',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: '#d8b4fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <span>⚡ <strong>อัพเกรดต่อจาก:</strong> {c.upgrade_from_name_th}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Stats Chips */}
                {c.stats && typeof c.stats === 'object' && (
                  <div className="stats-container">
                    <div className="stat-section-title">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      <span>สเตตัสคริสต้า (Crysta Stats)</span>
                    </div>
                    <div className="stat-chips">
                      {Object.entries(c.stats).map(([k, v]) => {
                        const isNegative = String(v).startsWith('-');
                        return (
                          <span 
                            key={k} 
                            className="stat-chip"
                            style={{
                              borderColor: isNegative ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                              background: isNegative ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.04)'
                            }}
                          >
                            <span style={{ color: 'var(--text-secondary)' }}>{formatStatKey(k)}:</span>
                            <strong style={{ color: isNegative ? '#fca5a5' : '#fde047', fontFamily: 'var(--font-mono)' }}>
                              {v}
                            </strong>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Conditional Bonus */}
                {c.conditional_bonus && typeof c.conditional_bonus === 'object' && (
                  <div className="stats-container">
                    <div className="conditional-chip">
                      <div style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.2rem', color: '#fde047' }}>
                        ⚡ เงื่อนไข: {c.conditional_bonus.condition}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', fontSize: '0.75rem' }}>
                        {Object.entries(c.conditional_bonus)
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

                {/* Footer */}
                <div className="card-footer">
                  <div>
                    {c.boss ? (
                      <span className="boss-badge">
                        🐉 บอส: {c.boss.name_th} ({c.boss.drop_rate_category || 'Rare'})
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ✓ แลกเปลี่ยนได้ในตลาด
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    <span>ดูรายละเอียด</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
