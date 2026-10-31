import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let PORT = process.env.PORT || 5000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function createLocalServer(portToUse) {
  const server = http.createServer((req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // API Endpoint for Contact Form
    if (req.method === 'POST' && req.url === '/api/contact') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          console.log('\n📬 NEW PROJECT INQUIRY RECEIVED ON LOCALHOST:');
          console.log(`👤 Name:    ${parsed.name || 'N/A'}`);
          console.log(`📧 Email:   ${parsed.email || 'N/A'}`);
          console.log(`📞 Phone:   ${parsed.phone || 'N/A'}`);
          console.log(`🛠️ Service: ${parsed.service || 'N/A'}`);
          console.log(`💰 Budget:  ${parsed.budget || 'N/A'}`);
          console.log(`💬 Message: ${parsed.message || 'N/A'}\n`);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Thank you for contacting Ahmed Wazir! Your project request has been submitted successfully.'
          }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    // Route Aliases
    let reqUrl = req.url;
    if (reqUrl === '/admin' || reqUrl === '/dashboard') reqUrl = '/admin.html';
    if (reqUrl === '/login') reqUrl = '/login.html';

    // Serve Static Files
    let filePath = path.join(__dirname, reqUrl === '/' ? 'index.html' : reqUrl);
    filePath = path.normalize(filePath);

    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403);
      res.end('403 Forbidden');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.readFile(path.join(__dirname, 'index.html'), (fallbackErr, fallbackData) => {
            if (fallbackErr) {
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('404 Not Found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
              res.end(fallbackData);
            }
          });
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Server Error: ${err.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${portToUse} is in use, trying port ${portToUse + 1}...`);
      createLocalServer(portToUse + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(portToUse, () => {
    console.log(`\n==========================================================`);
    console.log(`🚀 AHMED WAZIR WEBSITE IS RUNNING ON LOCALHOST!`);
    console.log(`👉 Open link in browser: http://localhost:${portToUse}`);
    console.log(`==========================================================\n`);
  });
}

createLocalServer(PORT);
