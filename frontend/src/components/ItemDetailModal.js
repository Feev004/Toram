'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sword, 
  Shield, 
  Zap, 
  Sparkles, 
  Hammer, 
  MapPin, 
  Crown, 
  Coins, 
  Box, 
  CheckCircle,
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';

export default function ItemDetailModal({ itemId, onClose, onNavigateToItem }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (itemId) {
      fetchItemDetail(itemId);
    }
  }, [itemId]);

  async function fetchItemDetail(id) {
    setLoading(true);
    try {
      const res = await fetch(`/api/items/${id}`);
      const json = await res.json();
      if (json.success) {
        setItem(json.data);
      }
    } catch (e) {
      console.error('Failed to load item detail', e);
    } finally {
      setLoading(false);
    }
  }

  if (!itemId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 22, 36, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #06b6d4, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sword className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                {loading ? 'กำลังโหลดข้อมูล...' : item?.name_th}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {item?.name_en || 'Toram Online Item'}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}
          >
            <X className="w-6 h-6 hover:text-white" />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div className="pulse-dot" style={{ margin: '0 auto 1rem', width: '12px', height: '12px' }} />
            กำลังโหลดข้อมูลเชิงลึก...
          </div>
        ) : item ? (
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Badges & Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span className={`type-badge ${item.item_type === 'Crysta' ? 'badge-crysta' : 'badge-weapon'}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                {item.item_type}
              </span>
              {item.sub_type && (
                <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  {item.sub_type}
                </span>
              )}
              {item.crysta && (
                <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fde047', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  ◆ {item.crysta.crysta_type} ({item.crysta.color})
                </span>
              )}
              <span style={{ background: item.is_tradable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: item.is_tradable ? '#6ee7b7' : '#fca5a5', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
                {item.is_tradable ? '✓ แลกเปลี่ยนได้ (Tradable)' : '✗ ผูกมัดตัวละคร (Untradable)'}
              </span>
            </div>

            {/* Crysta Upgrade Lineage Section */}
            {item.crysta && (item.crysta.upgrade_from_name_th || item.crysta.upgraded_to?.length > 0) && (
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#d8b4fe', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  สายการอัพเกรดคริสต้า (Crysta Upgrade Lineage)
                </h4>

                {item.crysta.upgrade_from_item_id && item.crysta.upgrade_from_name_th && (
                  <div 
                    onClick={() => onNavigateToItem && onNavigateToItem(item.crysta.upgrade_from_item_id)}
                    style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(168, 85, 247, 0.4)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#c084fc' }}>⚡ ต้องติดตั้งทับต่อจากคริสต้า:</div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{item.crysta.upgrade_from_name_th}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>คลิกดูข้อมูล →</span>
                  </div>
                )}

                {item.crysta.upgraded_to?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#c084fc', marginBottom: '0.4rem' }}>⭐ สามารถอัพเกรดต่อไปเป็น:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                      {item.crysta.upgraded_to.map((nextC) => (
                        <div
                          key={nextC.item_id}
                          onClick={() => onNavigateToItem && onNavigateToItem(nextC.item_id)}
                          style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(168, 85, 247, 0.4)', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{nextC.name_th}</span>
                          <span style={{ fontSize: '0.72rem', color: '#fde047' }}>{nextC.crysta_type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Multiple Equipment Versions (Boss Drop vs Crafted) */}
            {item.equipment_versions && item.equipment_versions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {item.equipment_versions.map((ver, vIdx) => (
                  <div key={ver.equip_id || vIdx} style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                        <Shield className="w-4 h-4 text-cyan-400" />
                        <span>สเตตัสอุปกรณ์ {item.equipment_versions.length > 1 ? `(เวอร์ชัน ${vIdx + 1})` : ''}</span>
                      </h4>
                      {ver.source_type && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700,
                          background: ver.source_type === 'Boss Drop' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: ver.source_type === 'Boss Drop' ? '#fca5a5' : '#fde047',
                          border: ver.source_type === 'Boss Drop' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                        }}>
                          ที่มา: {ver.source_type}
                        </span>
                      )}
                    </div>

                    {/* Base stats */}
                    {(ver.base_atk_min || ver.base_def || ver.stability) && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                        {ver.base_atk_min && (
                          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Base ATK</div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#67e8f9', fontFamily: 'var(--font-mono)' }}>
                              {ver.base_atk_min} {ver.base_atk_max && ver.base_atk_max !== ver.base_atk_min ? `- ${ver.base_atk_max}` : ''}
                            </div>
                          </div>
                        )}
                        {ver.base_def && (
                          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Base DEF</div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#93c5fd', fontFamily: 'var(--font-mono)' }}>
                              {ver.base_def}
                            </div>
                          </div>
                        )}
                        {ver.stability && (
                          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Stability</div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fde047', fontFamily: 'var(--font-mono)' }}>
                              {ver.stability}%
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Main stats */}
                    {ver.main_stats && typeof ver.main_stats === 'object' && Object.keys(ver.main_stats).length > 0 && (
                      <div style={{ marginBottom: ver.conditional_bonus ? '0.75rem' : '0' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>สเตตัสหลัก</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
                          {Object.entries(ver.main_stats).map(([k, v]) => (
                            <div key={k} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{k.replace(/_/g, ' ')}:</span>
                              <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Conditional bonus */}
                    {ver.conditional_bonus && typeof ver.conditional_bonus === 'object' && (
                      <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginTop: '0.5rem' }}>
                        <div style={{ color: '#fde047', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Zap className="w-3.5 h-3.5 text-yellow-400" />
                          <span>เงื่อนไข: {ver.conditional_bonus.condition}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {Object.entries(ver.conditional_bonus)
                            .filter(([k]) => k !== 'condition')
                            .map(([k, v]) => (
                              <span key={k} style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', color: '#fef08a' }}>
                                {k.replace(/_/g, ' ')}: <strong style={{ color: '#fff' }}>{String(v)}</strong>
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            {/* Crafting Recipe Details */}
            {item.recipe && (
              <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#fbbf24', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Hammer className="w-4 h-4 text-amber-400" />
                  สูตรสร้างไอเทม (Smith Crafting Recipe)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fde047', fontSize: '0.9rem' }}>
                    <Coins className="w-4 h-4" />
                    <span>ค่าทำ: <strong>{item.recipe.fee_spina?.toLocaleString()} Spina</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#67e8f9', fontSize: '0.9rem' }}>
                    <Box className="w-4 h-4" />
                    <span>แต้มวัตถุดิบ: <strong>{item.recipe.crafting_fee_material?.toLocaleString()} ({item.recipe.crafting_material_type})</strong></span>
                  </div>
                </div>

                {item.recipe.unlock_condition && (
                  <div style={{ marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#cbd5e1' }}>
                    🔒 <strong>เงื่อนไขปลดล็อค:</strong> {item.recipe.unlock_condition}
                  </div>
                )}

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>วัตถุดิบที่ต้องใช้:</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.6rem' }}>
                  {item.recipe.materials?.map((mat) => (
                    <div 
                      key={mat.mat_id}
                      onClick={() => onNavigateToItem && onNavigateToItem(mat.material_item_id)}
                      style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{mat.material_name_th}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{mat.material_name_en}</div>
                      </div>
                      <span style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                        x{mat.quantity_required}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Boss Drops Section */}
            {item.drops?.length > 0 && (
              <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#f87171', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Crown className="w-4 h-4 text-red-400" />
                  ดรอปจากบอส (Boss Drops)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {item.drops.map((d) => (
                    <div key={d.drop_id} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                          🐉 {d.boss_name_th} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({d.boss_name_en})</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{d.map_name_th || 'ไม่ระบุแผนที่'} (บทที่ {d.chapter || '—'})</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {d.part_break_required === 1 && (
                          <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                            ต้องทำลายชิ้นส่วน (Part Break)
                          </span>
                        )}
                        <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {d.drop_rate_category || 'Common'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Used In Recipes Section */}
            {item.used_in_recipes?.length > 0 && (
              <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#67e8f9', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  ใช้เป็นวัตถุดิบในการคราฟต์ไอเทมอื่น (Used as Material in)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.6rem' }}>
                  {item.used_in_recipes.map((u) => (
                    <div 
                      key={u.recipe_id}
                      onClick={() => onNavigateToItem && onNavigateToItem(u.target_item_id)}
                      style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{u.target_name_th}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.target_name_en}</div>
                      </div>
                      <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fde047', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem' }}>
                        ใช้ x{u.quantity_required}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
