/**
 * serve.mjs - tiny static server for local development.
 *
 *   node tools/serve.mjs            # http://localhost:8080
 *   node tools/serve.mjs 3000       # pick a different port
 *
 * Serving over http:// instead of opening the .html file directly gives the
 * tools a normal origin, so the generated quotation window and localStorage
 * behave properly. Responses are sent with no-store so a price change shows
 * up the moment you refresh.
 */

import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2]) || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  if (urlPath === '/') urlPath = '/index.html';

  // Keep everything inside the repo folder.
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      .end('Not found: ' + urlPath);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store, must-revalidate',
  });
  createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('V-Sustain Quotation Suite running:');
  console.log(`  http://localhost:${PORT}/`);
  console.log('');
  console.log('  on-grid   http://localhost:' + PORT + '/on-grid/index.html');
  console.log('  off-grid  http://localhost:' + PORT + '/off-grid/index.html');
  console.log('  hybrid    http://localhost:' + PORT + '/hybrid/index.html');
  console.log('  ups-b2b   http://localhost:' + PORT + '/ups-b2b/index.html');
  console.log('');
  console.log('Press Ctrl+C to stop.');
});
