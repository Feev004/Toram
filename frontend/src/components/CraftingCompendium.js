'use client';

import React, { useState, useEffect } from 'react';
import { 
  Hammer, 
  Coins, 
  Box, 
  Layers, 
  Calculator, 
  ChevronRight, 
  Sparkles,
  Sword,
  Shield,
  Search
} from 'lucide-react';

export default function CraftingCompendium({ onSelectItem }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [craftMultipliers, setCraftMultipliers] = useState({});

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    setLoading(true);
    try {
      const res = await fetch('/api/recipes');
      const json = await res.json();
      if (json.success) {
        setRecipes(json.data || []);
      }
    } catch (e) {
      console.error('Failed to load recipes', e);
    } finally {
      setLoading(false);
    }
  }

  function handleMultiplierChange(recipeId, value) {
    const qty = Math.max(1, parseInt(value, 10) || 1);
    setCraftMultipliers(prev => ({ ...prev, [recipeId]: qty }));
  }

  const filtered = recipes.filter(r => 
    r.item_name_th?.toLowerCase().includes(search.toLowerCase()) ||
    r.item_name_en?.toLowerCase().includes(search.toLowerCase()) ||
    r.unlock_condition?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="hero-card">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Hammer className="w-7 h-7 text-amber-400" />
          Toram Blacksmith & Crafting Recipes
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
          สูตรสร้างอุปกรณ์ที่โรงตีบวก คำนวณค่าธรรมเนียม Spina และวัตถุดิบทั้งหมดที่ต้องใช้
        </p>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="w-4 h-4 search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาสูตรคราฟต์ไอเทม เช่น เจมินัสซอร์ด, บทที่ 15..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div className="pulse-dot" style={{ margin: '0 auto 1rem', width: '12px', height: '12px' }} />
          กำลังโหลดสูตรคราฟต์...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <Hammer className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>ไม่พบสูตรสร้างไอเทมที่ค้นหา</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((r) => {
            const qty = craftMultipliers[r.recipe_id] || 1;
            const totalSpina = (r.fee_spina || 0) * qty;
            const totalMatFee = (r.crafting_fee_material || 0) * qty;

            return (
              <div 
                key={r.recipe_id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  backdropFilter: 'blur(12px)'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div onClick={() => onSelectItem(r.item_id)} style={{ cursor: 'pointer' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{r.item_name_th}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.item_name_en || '—'}</div>
                  </div>
                  <span className="type-badge badge-weapon">
                    {r.sub_type || r.item_type}
                  </span>
                </div>

                {/* Unlock condition */}
                {r.unlock_condition && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px dashed rgba(245, 158, 11, 0.3)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#fbbf24' }}>
                    📜 <strong>เงื่อนไขปลดล็อค:</strong> {r.unlock_condition}
                  </div>
                )}

                {/* Craft Quantity Multiplier Box */}
                <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#93c5fd' }}>
                    <Calculator className="w-4 h-4 text-cyan-400" />
                    <span>จำนวนชิ้นที่ต้องการทำ:</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleMultiplierChange(r.recipe_id, qty - 1)}
                      style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', width: '26px', height: '26px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => handleMultiplierChange(r.recipe_id, e.target.value)}
                      style={{ width: '45px', textAlign: 'center', background: '#090d16', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px', padding: '0.2rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                    />
                    <button
                      onClick={() => handleMultiplierChange(r.recipe_id, qty + 1)}
                      style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', width: '26px', height: '26px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Costs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#fbbf24' }}>ค่าธรรมเนียม Spina:</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fde047', fontFamily: 'var(--font-mono)' }}>
                      {totalSpina.toLocaleString()} Spina
                    </div>
                  </div>

                  <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#67e8f9' }}>แต้มวัตถุดิบ ({r.crafting_material_type}):</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      {totalMatFee.toLocaleString()} pts
                    </div>
                  </div>
                </div>

                {/* Required Materials */}
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    วัตถุดิบที่ต้องการ (สำหรับ {qty} ชิ้น):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {r.materials?.map((m) => (
                      <div
                        key={m.mat_id}
                        onClick={() => onSelectItem(m.material_item_id)}
                        style={{
                          background: 'rgba(10, 13, 20, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{m.material_name_th}</span>
                        <span style={{ color: '#67e8f9', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          x{(m.quantity_required * qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
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
