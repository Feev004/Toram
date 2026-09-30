'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ItemExplorer from '../components/ItemExplorer';
import BossExplorer from '../components/BossExplorer';
import CrystaExplorer from '../components/CrystaExplorer';
import CraftingCompendium from '../components/CraftingCompendium';
import SqlConsole from '../components/SqlConsole';
import DevOpsDashboard from '../components/DevOpsDashboard';
import ItemDetailModal from '../components/ItemDetailModal';
import AddItemModal from '../components/AddItemModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'bosses' | 'crystas' | 'crafting' | 'sql' | 'devops'
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState({ online: false, db: 'toram' });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  async function checkHealth() {
    try {
      const res = await fetch('/api/health');
      const json = await res.json();
      if (json.status === 'online') {
        setServerStatus({ online: true, db: json.db || 'toram' });
      } else {
        setServerStatus({ online: false, db: 'toram' });
      }
    } catch (e) {
      setServerStatus({ online: false, db: 'toram' });
    }
  }

  function handleItemCreated() {
    setRefreshKey(prev => prev + 1);
  }

  return (
    <div>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverStatus={serverStatus}
        onOpenAddItem={() => setIsAddItemOpen(true)}
      />

      <main className="main-wrapper">
        {activeTab === 'items' && (
          <ItemExplorer
            key={`items-${refreshKey}`}
            onSelectItem={(id) => setSelectedItemId(id)}
          />
        )}

        {activeTab === 'bosses' && (
          <BossExplorer
            key={`bosses-${refreshKey}`}
            onSelectItem={(id) => setSelectedItemId(id)}
          />
        )}

        {activeTab === 'crystas' && (
          <CrystaExplorer
            key={`crystas-${refreshKey}`}
            onSelectItem={(id) => setSelectedItemId(id)}
          />
        )}

        {activeTab === 'crafting' && (
          <CraftingCompendium
            key={`crafting-${refreshKey}`}
            onSelectItem={(id) => setSelectedItemId(id)}
          />
        )}

        {activeTab === 'sql' && (
          <SqlConsole />
        )}

        {activeTab === 'devops' && (
          <DevOpsDashboard />
        )}
      </main>

      {/* Item Detail Modal */}
      {selectedItemId && (
        <ItemDetailModal
          itemId={selectedItemId}
          onClose={() => setSelectedItemId(null)}
          onNavigateToItem={(id) => setSelectedItemId(id)}
        />
      )}

      {/* Add Item Modal */}
      {isAddItemOpen && (
        <AddItemModal
          isOpen={isAddItemOpen}
          onClose={() => setIsAddItemOpen(false)}
          onItemCreated={handleItemCreated}
        />
      )}
    </div>
  );
}
