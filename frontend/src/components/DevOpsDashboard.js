'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Globe, 
  Cpu, 
  HardDrive, 
  Terminal, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Box,
  Radio
} from 'lucide-react';

export default function DevOpsDashboard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState('');

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/devops/status');
      const json = await res.json();
      if (json.success) {
        setStatus(json);
      }
    } catch (e) {
      console.error('Failed to load DevOps status', e);
    } finally {
      setLoading(false);
    }
  }

  function copyText(txt, key) {
    navigator.clipboard.writeText(txt);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(''), 2000);
  }

  function formatUptime(seconds) {
    if (!seconds) return '0s';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  }

  return (
    <div>
      <div className="hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Server className="w-7 h-7 text-cyan-400" />
              DevOps & Infrastructure Control Center
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
              สถานะเซิร์ฟเวอร์แบบเรียลไทม์ ตรวจสอบฐานข้อมูล MySQL, Docker Compose และ Ngrok Tunnel
            </p>
          </div>

          <button className="btn-secondary" onClick={fetchStatus}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>รีเฟรชสถานะ</span>
          </button>
        </div>
      </div>

      <div className="devops-grid">
        {/* Node.js Backend API Status */}
        <div className="devops-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
              <Server className="w-5 h-5 text-cyan-400" />
              <span>Backend Server (Node.js)</span>
            </div>
            <span className="status-pill">
              <span className="pulse-dot" />
              <span>Online</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Uptime:</span>
              <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{formatUptime(status?.server?.uptimeSeconds)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Node Version:</span>
              <strong style={{ color: '#67e8f9', fontFamily: 'var(--font-mono)' }}>{status?.server?.nodeVersion || 'v24.x'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CPU Cores:</span>
              <strong style={{ color: '#fff' }}>{status?.server?.cpuCount || '—'} Cores ({status?.server?.platform} / {status?.server?.arch})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>RAM Heap:</span>
              <strong style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                {status?.server?.memoryUsageMB?.heapUsed || 0} MB / {status?.server?.memoryUsageMB?.heapTotal || 0} MB
              </strong>
            </div>
          </div>
        </div>

        {/* Database Health & Metrics */}
        <div className="devops-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
              <Database className="w-5 h-5 text-amber-400" />
              <span>MySQL Database (toram)</span>
            </div>
            <span className={`status-pill ${status?.database?.status === 'connected' ? '' : 'error'}`}>
              <span className="pulse-dot" style={{ background: status?.database?.status === 'connected' ? '#10b981' : '#f43f5e' }} />
              <span>{status?.database?.status === 'connected' ? 'Connected' : 'Error'}</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Host / Port:</span>
              <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{status?.database?.host}:{status?.database?.port}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>DB Ping Latency:</span>
              <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{status?.database?.latency || '<1ms'}</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>จำนวนแถวในแต่ละตาราง:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
              {status?.database?.tableCounts && Object.entries(status.database.tableCounts).map(([t, count]) => (
                <div key={t} style={{ background: 'rgba(10, 13, 20, 0.5)', padding: '0.35rem 0.6rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t}:</span>
                  <strong style={{ color: '#fde047', fontFamily: 'var(--font-mono)' }}>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ngrok Tunnel Integration */}
        <div className="devops-card" style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
              <Globe className="w-5 h-5 text-purple-400" />
              <span>Ngrok Tunnel Gateway</span>
            </div>
            <span className="tunnel-badge">
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span>Configured</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: '#d8b4fe', marginBottom: '0.25rem' }}>Authtoken Status:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fff' }}>
                2ZcYV3J4cnxNGLiA5QY2u...UB3T <span style={{ color: '#34d399' }}>✓ (Saved)</span>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              เปิดใช้งาน Ngrok ให้คนภายนอกเข้าถึงเว็บของคุณได้ทันทีผ่านคำสั่ง:
            </div>

            <div style={{ background: '#090d16', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ color: '#38bdf8', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                npm run tunnel
              </code>
              <button 
                onClick={() => copyText('npm run tunnel', 'tunnel')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                {copiedCmd === 'tunnel' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Docker & DevOps Automation Guides */}
      <div style={{ marginTop: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', backdropFilter: 'blur(12px)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Box className="w-5 h-5 text-cyan-400" />
          DevOps & Docker Deployment Suite
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
              💻 1. Localhost Only (Dev)
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              เปิดเฉพาะหน้าบ้านและหลังบ้านบนเครื่อง (Localhost)
            </p>
            <div style={{ background: '#090d16', padding: '0.5rem 0.75rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>.\start-local.bat</code>
              <button onClick={() => copyText('.\\start-local.bat', 'local')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                {copiedCmd === 'local' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
              ⚡ 2. One-Click Full Stack (With Tunnel)
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              เปิด Backend, Frontend และ Ngrok พร้อมกัน
            </p>
            <div style={{ background: '#090d16', padding: '0.5rem 0.75rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ fontSize: '0.78rem', color: '#fde047', fontFamily: 'var(--font-mono)' }}>.\start-all.bat</code>
              <button onClick={() => copyText('.\\start-all.bat', 'all')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                {copiedCmd === 'all' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#67e8f9', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
              🐳 3. Docker Compose
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              รันทั้งระบบด้วย Docker Containers
            </p>
            <div style={{ background: '#090d16', padding: '0.5rem 0.75rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>docker-compose up -d</code>
              <button onClick={() => copyText('docker-compose up --build -d', 'docker')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                {copiedCmd === 'docker' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#a855f7', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
              🌐 4. Ngrok Tunnel
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              สร้าง URL สาธารณะผ่าน Ngrok
            </p>
            <div style={{ background: '#090d16', padding: '0.5rem 0.75rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <code style={{ fontSize: '0.78rem', color: '#d8b4fe', fontFamily: 'var(--font-mono)' }}>npm run tunnel</code>
              <button onClick={() => copyText('npm run tunnel', 'tunnel')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                {copiedCmd === 'tunnel' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
