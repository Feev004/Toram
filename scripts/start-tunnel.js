const { spawn } = require('child_process');
const path = require('path');

const AUTHTOKEN = '2ZcYV3J4cnxNGLiA5QY2uAUzbWp_215sNqYSFHBshFVX7UB3T';

console.log('==============================================');
console.log(' Starting Ngrok Tunnel for Toram Fullstack App');
console.log(' Target: http://localhost:3000 (Next.js)');
console.log('==============================================\n');

// Configure authtoken first
const configProc = spawn('ngrok', ['config', 'add-authtoken', AUTHTOKEN], { shell: true });

configProc.on('close', (code) => {
  console.log('[Ngrok] Authtoken registered successfully.');
  console.log('[Ngrok] Initializing public HTTP tunnel to port 3000...\n');

  // Start HTTP tunnel
  const tunnelProc = spawn('ngrok', ['http', '3000'], { stdio: 'inherit', shell: true });

  tunnelProc.on('error', (err) => {
    console.error('[Ngrok] Error starting tunnel:', err.message);
  });
});
