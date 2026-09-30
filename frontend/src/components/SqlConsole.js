'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  Sparkles,
  Database
} from 'lucide-react';

export default function SqlConsole() {
  const defaultQuery = `SELECT i.name_th AS ชื่ออุปกรณ์, es.sub_type AS ประเภท, CONCAT(es.base_atk_min, ' - ', es.base_atk_max) AS Base_ATK, es.base_def AS Base_DEF, CONCAT(es.stability, '%') AS ความเสถียร, es.main_stats AS สเตตัสหลัก, es.conditional_bonus AS สเตตัสโบนัสพิเศษ, cr.unlock_condition AS เงื่อนไขคราฟต์, b.name_th AS ดรอปจากบอส \nFROM items i \nLEFT JOIN equipment_stats es ON i.item_id = es.item_id \nLEFT JOIN crafting_recipes cr ON i.item_id = cr.item_id \nLEFT JOIN boss_drops bd ON i.item_id = bd.item_id \nLEFT JOIN bosses b ON bd.boss_id = b.boss_id \nWHERE i.name_th = 'เจมินัสซอร์ด';`;

  const [query, setQuery] = useState(defaultQuery);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    fetchPresets();
    // Run the default query on mount to replicate phpMyAdmin
    handleExecute(defaultQuery);
  }, []);

  async function fetchPresets() {
    try {
      const res = await fetch('/api/query/sample');
      const json = await res.json();
      if (json.success) {
        setPresets(json.presets || []);
      }
    } catch (e) {
      console.error('Failed to load preset queries', e);
    }
  }

  async function handleExecute(queryToRun = query) {
    if (!queryToRun.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/query/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToRun })
      });
      const json = await res.json();
      setResult(json);
    } catch (e) {
      setResult({
        success: false,
        error: e.message,
        executionTimeSec: '0.0000 seconds'
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCopySQL() {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExportJSON() {
    if (!result?.data) return;
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toram-query-${Date.now()}.json`;
    a.click();
  }

  function handleExportCSV() {
    if (!result?.data || result.data.length === 0) return;
    const headers = result.columns || Object.keys(result.data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of result.data) {
      const values = headers.map(h => {
        const val = row[h] === null || row[h] === undefined ? '' : String(row[h]);
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toram-query-${Date.now()}.csv`;
    a.click();
  }

  return (
    <div>
      <div className="hero-card">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Terminal className="w-7 h-7 text-cyan-400" />
          Interactive SQL Console & Database Explorer
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
          รันคำสั่ง SQL กับฐานข้อมูล <code style={{ color: '#67e8f9' }}>toram</code> ได้ทันทีแบบสดๆ จำลองรูปแบบผลลัพธ์ phpMyAdmin
        </p>

        {/* Query Presets Chips */}
        <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>คิวรีตัวอย่าง:</span>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setQuery(p.sql);
                handleExecute(p.sql);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-primary)'
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* SQL Editor Box */}
      <div className="sql-console-container">
        <div className="sql-header">
          <div className="sql-title">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>SQL Query Box</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>[DB: toram]</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={handleCopySQL}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง'}</span>
            </button>

            <button className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setQuery(defaultQuery)}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>รีเซ็ตคำสั่งภาพต้นฉบับ</span>
            </button>
          </div>
        </div>

        <textarea
          className="sql-editor-textarea"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="พิมพ์คำสั่ง SQL เช่น SELECT * FROM items LIMIT 10;"
          rows={6}
        />

        <div className="sql-actions-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>รองรับคำสั่ง SELECT, JOIN, WHERE, GROUP BY, ORDER BY</span>
          </div>

          <button
            className="btn-primary"
            onClick={() => handleExecute(query)}
            disabled={loading}
          >
            <Play className="w-4 h-4" />
            <span>{loading ? 'กำลังประมวลผล...' : 'รันคำสั่ง (Execute)'}</span>
          </button>
        </div>

        {/* Execution Results View */}
        {result && (
          <div style={{ paddingTop: '0.5rem' }}>
            {/* Banner matching phpMyAdmin */}
            {result.success ? (
              <div className="pma-banner success">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <strong>Showing rows 0 - {Math.max(0, (result.rowCount || 1) - 1)}</strong> ({result.rowCount || 0} total, Query took {result.executionTimeSec || '0.0008 seconds'}.)
                </div>
              </div>
            ) : (
              <div className="pma-banner error">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <strong>SQL Error:</strong> {result.error} (Time: {result.executionTimeSec})
                </div>
              </div>
            )}

            {/* SQL Preview Box matching phpMyAdmin */}
            <div className="sql-preview-box">
              {result.query}
            </div>

            {/* Table Result Display */}
            {result.success && result.data && Array.isArray(result.data) && (
              <div>
                <div style={{ padding: '0 1.25rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    ผลลัพธ์: <strong>{result.data.length}</strong> แถว
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={handleExportCSV}>
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={handleExportJSON}>
                      <Download className="w-3.5 h-3.5" />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="pma-table">
                    <thead>
                      <tr>
                        {result.columns?.map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.map((row, idx) => (
                        <tr key={idx}>
                          {result.columns?.map((col) => {
                            const val = row[col];
                            return (
                              <td key={col}>
                                {val === null || val === undefined ? (
                                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>NULL</span>
                                ) : typeof val === 'object' ? (
                                  <code style={{ fontSize: '0.75rem', color: '#fde047' }}>{JSON.stringify(val)}</code>
                                ) : (
                                  <span>{String(val)}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
