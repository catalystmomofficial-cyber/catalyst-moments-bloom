/**
 * JARVIS Bridge — local Node.js server
 * Serves the dashboard on localhost:3000
 * Routes voice/typed commands to Claude Code CLI and streams results back
 *
 * Run:  node bridge.js
 * Then: open Chrome → http://localhost:3000
 */

const http = require('http');
const { spawn } = require('child_process');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const HTML = path.join(__dirname, 'command-center.html');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // ── Serve the dashboard ──────────────────────────────
  if (req.method === 'GET' && (req.url === '/' || req.url === '/dashboard')) {
    fs.readFile(HTML, (err, data) => {
      if (err) { res.writeHead(404); res.end('Run setup.sh first to generate the dashboard'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
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

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      // Send keep-alive while Claude thinks
      const ping = setInterval(() => res.write(': ping\n\n'), 8000);

      const child = spawn('claude', [
        '--print', cmd,
        '--output-format', 'stream-json',
        '--verbose',
      ], { env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' } });

      let buffer = '';

      child.stdout.on('data', chunk => {
        buffer += chunk.toString();
        // stream-json emits one JSON object per line
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const obj = JSON.parse(line);
            // content_block_delta carries the text tokens
            if (obj.type === 'content_block_delta' && obj.delta?.type === 'text_delta') {
              res.write(`data: ${JSON.stringify({ text: obj.delta.text })}\n\n`);
            }
          } catch (_) {
            // plain text fallback (non-JSON output)
            if (line.trim()) res.write(`data: ${JSON.stringify({ text: line + '\n' })}\n\n`);
          }
        }
      });

      child.on('close', () => {
        clearInterval(ping);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      });

      child.on('error', err => {
        clearInterval(ping);
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
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
  console.log(`    Open Chrome  →  http://localhost:${PORT}\n`);
  console.log('    Speak or type commands in the dashboard.');
  console.log('    Press Ctrl+C to stop.\n');
});
