'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Search, 
  Crown, 
  Layers, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Package,
  Award,
  Zap,
  Sword
} from 'lucide-react';

export default function BossExplorer({ onSelectItem }) {
  const [bosses, setBosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBossDetail, setSelectedBossDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchBosses();
  }, [search]);

  async function fetchBosses() {
    setLoading(true);
    try {
      const res = await fetch(`/api/bosses?search=${encodeURIComponent(search)}`);
      const json = await res.json();
      if (json.success) {
        setBosses(json.data || []);
        if (json.data?.length > 0 && !selectedBossDetail) {
          fetchBossDetail(json.data[0].boss_id);
        }
      }
    } catch (e) {
      console.error('Failed to load bosses', e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBossDetail(id) {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/bosses/${id}`);
      const json = await res.json();
      if (json.success) {
        setSelectedBossDetail(json.data);
      }
    } catch (e) {
      console.error('Failed to load boss detail', e);
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div>
      <div className="hero-card">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Crown className="w-7 h-7 text-amber-400" />
          Toram Boss Compendium & Drops
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
          ข้อมูลบอสทั้งหมด ระดับความยาก (Easy, Normal, Hard, NM, Ult) ค่า HP/EXP และตารางไอเทมดรอป
        </p>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="w-4 h-4 search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาชื่อบอส หรือ แผนที่ เช่น ดอย & มาริ, ป่าวิดก้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div className="pulse-dot" style={{ margin: '0 auto 1rem', width: '12px', height: '12px' }} />
          กำลังโหลดรายชื่อบอส...
        </div>
      ) : bosses.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <ShieldAlert className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>ไม่พบบอสที่ตรงกับคำค้นหา</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {/* Boss List Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              รายชื่อบอส ({bosses.length})
            </h3>
            {bosses.map((b) => {
              const isSelected = selectedBossDetail?.boss_id === b.boss_id;
              return (
                <div
                  key={b.boss_id}
                  onClick={() => fetchBossDetail(b.boss_id)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(168, 85, 247, 0.18))' : 'var(--bg-card)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? '0 0 15px rgba(6, 182, 212, 0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{b.name_th}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.name_en || '—'}</div>
                    </div>
                    <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                      {b.boss_type}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{b.map_name_th || 'ไม่ระบุ'}</span>
                    {b.chapter && <span style={{ color: 'var(--text-muted)' }}>(บทที่ {b.chapter})</span>}
                  </div>

                  {b.element_notes && (
                    <div style={{ marginTop: '0.5rem', background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.25)', padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#fde047' }}>
                      ⚡ <strong>ธาตุ:</strong> {b.element_notes}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>🎁 ไอเทมดรอป: <strong style={{ color: '#fff' }}>{b.total_drops || 0}</strong> ชิ้น</span>
                    {b.breakable_parts > 0 && <span>💥 ทำลายชิ้นส่วน: <strong style={{ color: '#fbbf24' }}>{b.breakable_parts} จุด</strong></span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Boss Detail View */}
          <div>
            {detailLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
                <div className="pulse-dot" style={{ margin: '0 auto 1rem', width: '12px', height: '12px' }} />
                กำลังโหลดรายละเอียดบอส...
              </div>
            ) : selectedBossDetail ? (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backdropFilter: 'blur(12px)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{selectedBossDetail.name_th}</h2>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{selectedBossDetail.name_en}</div>
                    </div>
                    <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fde047', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.85rem' }}>
                      {selectedBossDetail.boss_type}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginTop: '0.6rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#67e8f9' }}>
                      <MapPin className="w-4 h-4" />
                      <span>{selectedBossDetail.map_name_th} (บทที่ {selectedBossDetail.chapter || '—'})</span>
                    </div>

                    {selectedBossDetail.breakable_parts > 0 && (
                      <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fde047', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 600 }}>
                        💥 ชิ้นส่วนที่ทำลายได้: {selectedBossDetail.breakable_parts} จุด
                      </span>
                    )}
                  </div>

                  {selectedBossDetail.element_notes && (
                    <div style={{ marginTop: '0.75rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(239, 68, 68, 0.12))', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: '#e2e8f0' }}>
                      🌪️🔥 <strong>ข้อมูลธาตุประจำตัว:</strong> <span style={{ color: '#67e8f9', fontWeight: 600 }}>{selectedBossDetail.element_notes}</span>
                    </div>
                  )}
                </div>

                {/* Difficulties Table */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    ระดับความยาก & สเตตัสบอส
                  </h4>
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <table className="pma-table">
                      <thead>
                        <tr>
                          <th>ความยาก</th>
                          <th>เลเวล (Level)</th>
                          <th>พลังชีวิต (HP)</th>
                          <th>ค่าประสบการณ์ (EXP)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBossDetail.difficulties?.map((d) => (
                          <tr key={d.diff_id}>
                            <td style={{ fontWeight: 700, color: '#fbbf24' }}>{d.difficulty}</td>
                            <td>Lv. {d.level}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', color: '#f87171' }}>{d.hp?.toLocaleString()}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>+{d.exp?.toLocaleString()} EXP</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Boss Drops Table */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Package className="w-4 h-4 text-cyan-400" />
                    ตารางไอเทมดรอปทั้งหมด ({selectedBossDetail.drops?.length || 0})
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {selectedBossDetail.drops?.map((drop) => (
                      <div
                        key={drop.drop_id}
                        onClick={() => onSelectItem(drop.item_id)}
                        style={{
                          background: 'rgba(10, 13, 20, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{drop.item_name_th}</div>
                          <span style={{ fontSize: '0.72rem', color: '#93c5fd', background: 'rgba(59, 130, 246, 0.15)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                            {drop.item_type}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{drop.item_name_en || '—'}</div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.75rem' }}>
                          <span style={{ color: '#d8b4fe', fontWeight: 600 }}>{drop.drop_rate_category || 'Common'}</span>
                          {drop.part_break_required === 1 && (
                            <span style={{ color: '#fbbf24', fontSize: '0.7rem' }}>⚠️ Part Break</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
