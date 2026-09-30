const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const os = require('os');

// In-memory tunnel info (if updated by tunnel runner)
let tunnelInfo = {
  active: false,
  url: null,
  startedAt: null
};

function setTunnelInfo(info) {
  tunnelInfo = { ...tunnelInfo, ...info };
}

// GET /api/devops/status - Health, system metrics, and database stats
router.get('/status', async (req, res) => {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbLatency = null;
  let tableCounts = {};

  try {
    const conn = await pool.getConnection();
    const pingStart = Date.now();
    await conn.query('SELECT 1');
    dbLatency = `${Date.now() - pingStart}ms`;
    dbStatus = 'connected';

    // Count rows in major tables
    const tables = ['items', 'equipment_stats', 'bosses', 'boss_difficulties', 'boss_drops', 'crafting_recipes', 'recipe_materials', 'maps', 'elements'];
    for (const t of tables) {
      try {
        const [c] = await conn.query(`SELECT COUNT(*) AS count FROM ${t}`);
        tableCounts[t] = c[0].count;
      } catch (e) {
        tableCounts[t] = 0;
      }
    }
    conn.release();
  } catch (error) {
    dbStatus = 'error: ' + error.message;
  }

  const memory = process.memoryUsage();

  res.json({
    success: true,
    server: {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cpuCount: os.cpus().length,
      freeMemMB: Math.round(os.freemem() / 1024 / 1024),
      totalMemMB: Math.round(os.totalmem() / 1024 / 1024),
      memoryUsageMB: {
        rss: Math.round(memory.rss / 1024 / 1024),
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024)
      }
    },
    database: {
      status: dbStatus,
      latency: dbLatency,
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      name: process.env.DB_NAME || 'toram',
      tableCounts
    },
    tunnel: tunnelInfo,
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  router,
  setTunnelInfo
};
