'use client';

import React from 'react';
import { 
  Sword, 
  Database, 
  Terminal, 
  ShieldAlert, 
  Hammer, 
  Server, 
  PlusCircle, 
  Activity,
  Globe,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, serverStatus, onOpenAddItem }) {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="logo-group" onClick={() => setActiveTab('items')}>
          <div className="logo-icon">
            <Sword className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="logo-title">TORAM ONLINE</div>
            <div className="logo-sub">Database & System Hub</div>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            <Sword className="w-4 h-4" />
            <span>ไอเทม & อุปกรณ์</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'bosses' ? 'active' : ''}`}
            onClick={() => setActiveTab('bosses')}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>บอส & ดรอป</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'crystas' ? 'active' : ''}`}
            onClick={() => setActiveTab('crystas')}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>คริสต้า (Xtal)</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'crafting' ? 'active' : ''}`}
            onClick={() => setActiveTab('crafting')}
          >
            <Hammer className="w-4 h-4" />
            <span>คราฟต์ไอเทม</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'sql' ? 'active' : ''}`}
            onClick={() => setActiveTab('sql')}
          >
            <Terminal className="w-4 h-4" />
            <span>SQL Console</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'devops' ? 'active' : ''}`}
            onClick={() => setActiveTab('devops')}
          >
            <Server className="w-4 h-4" />
            <span>DevOps & Ngrok</span>
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', color: '#67e8f9', borderColor: 'rgba(6, 182, 212, 0.4)' }}
            onClick={onOpenAddItem}
          >
            <PlusCircle className="w-4 h-4" />
            <span>เพิ่มไอเทม</span>
          </button>

          <div className={`status-pill ${serverStatus?.online ? '' : 'error'}`}>
            <span className="pulse-dot" style={{ background: serverStatus?.online ? '#10b981' : '#f43f5e', boxShadow: `0 0 8px ${serverStatus?.online ? '#10b981' : '#f43f5e'}` }} />
            <span>{serverStatus?.online ? `DB: ${serverStatus.db || 'toram'}` : 'Offline'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
