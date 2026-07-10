/**
 * JARVIS Bridge — local Node.js server
 * Serves the dashboard on localhost:3000
 * Routes commands to Claude Code CLI and streams text back via SSE
 *
 * Run: node bridge.js
 * Open: Chrome → http://localhost:3000
 */

const http = require('http');
const { spawn } = require('child_process');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const HTML = path.join(__dirname, 'command-center.html');

// Find the claude CLI — handles cases where PATH isn't fully loaded
function findClaude() {
  const candidates = [
    'claude',
    path.join(process.env.HOME || '', '.claude', 'local', 'claude'),
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
  ];
  for (const c of candidates) {
    try {
      require('child_process').execSync(`"${c}" --version`, { stdio: 'ignore', timeout: 3000 });
      return c;
    } catch (_) {}
  }
  return 'claude'; // fallback, let it fail with a clear error
}

const CLAUDE = findClaude();
console.log(`Using Claude at: ${CLAUDE}`);

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // ── Serve the dashboard ──────────────────────────────
  if (req.method === 'GET' && (req.url === '/' || req.url === '/dashboard')) {
    fs.readFile(HTML, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end(`Cannot find command-center.html at: ${HTML}`);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  // ── Health check ─────────────────────────────────────
  if (req.method === 'GET' && req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, claude: CLAUDE }));
    return;
  }

  // ── Stream a command to Claude Code ─────────────────
  // POST /command  { "cmd": "check my social stats" }
  if (req.method === 'POST' && req.url === '/command') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      let cmd = '';
      try { cmd = JSON.parse(body).cmd || ''; } catch (_) { cmd = body.trim(); }
      if (!cmd) { res.writeHead(400); res.end('no cmd'); return; }

      console.log(`\n▶ Command: "${cmd}"`);

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      // Keep-alive pings while Claude thinks
      const ping = setInterval(() => res.write(': ping\n\n'), 8000);

      // Run: claude -p "your prompt"
      const child = spawn(CLAUDE, ['-p', cmd], {
        env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
      });

      child.stdout.on('data', chunk => {
        const text = chunk.toString();
        process.stdout.write(text); // show in terminal too
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      });

      child.stderr.on('data', chunk => {
        const msg = chunk.toString().trim();
        if (msg) console.error('Claude stderr:', msg);
        // Surface auth errors to the dashboard
        if (/not logged in|auth|login/i.test(msg)) {
          res.write(`data: ${JSON.stringify({ text: 'Not logged in. Run: claude login' })}\n\n`);
        }
      });

      child.on('close', code => {
        clearInterval(ping);
        console.log(`✓ Done (exit ${code})`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      });

      child.on('error', err => {
        clearInterval(ping);
        console.error('Bridge error:', err.message);
        const hint = err.code === 'ENOENT'
          ? 'Claude Code CLI not found. Run: curl -fsSL https://claude.ai/install.sh | sh'
          : err.message;
        res.write(`data: ${JSON.stringify({ text: hint, done: true })}\n\n`);
        res.end();
      });

      req.on('close', () => { child.kill(); clearInterval(ping); });
    });
    return;
  }

  res.writeHead(404); res.end('not found');
});

server.listen(PORT, () => {
  console.log('\n🔥  JARVIS Bridge is live');
  console.log(`    Dashboard  →  http://localhost:${PORT}`);
  console.log(`    Claude CLI →  ${CLAUDE}`);
  console.log('\n    Tip: say "check socials" to pull the stats widget');
  console.log('    Press Ctrl+C to stop.\n');
});
