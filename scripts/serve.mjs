import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.argv[2] || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain',
};

createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
    }
    let path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = resolve(root, `.${path}`);
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep) || path.split(/[\\/]/).some(part => part.startsWith('.')) || !mime[extname(file)]) {
      response.writeHead(404); response.end('Not found'); return;
    }
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[extname(file)], 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch {
    response.writeHead(404); response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Local preview: http://127.0.0.1:${port}`);
});
