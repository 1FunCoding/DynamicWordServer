// server.js

import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleWordsRequest } from './words.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000;

const server = http.createServer(async (req, res) => {
  console.log(`[${new Date().toISOString()}] Request method: ${req.method}, URL: ${req.url}`);

  if (req.method !== 'GET') {
    res.statusCode = 405; // Method Not Allowed
    res.end('Method Not Allowed');
    return;
  }

  if (req.url.startsWith('/static/')) {
    await handleStaticRequest(req, res);
  } else if (req.url.startsWith('/words')) { // Add handling for /words
    console.log('Handling /words request...');
    handleWordsRequest(req, res);
  } else {
    res.statusCode = 404; // Not Found
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

async function handleStaticRequest(req, res) {
  const relativeFilePath = req.url.replace('/static/', '');

  if (!relativeFilePath) {
    console.warn(`[403] Attempt to access directory: ${req.url}`);
    res.statusCode = 403; // Forbidden
    res.end('Directory access is forbidden');
    return;
  }

  const absoluteFilePath = path.join(__dirname, 'static', relativeFilePath);

  try {
    const data = await fs.readFile(absoluteFilePath);

    const ext = path.extname(absoluteFilePath).toLowerCase();
    let contentType = 'text/plain';

    switch (ext) {
      case '.html':
        contentType = 'text/html';
        break;
      case '.js':
        contentType = 'application/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (error) {
    console.error(`Error reading file ${absoluteFilePath}:`, error);

    if (error.code === 'ENOENT') {
      console.error(`[404] File not found: ${absoluteFilePath}`);
      res.statusCode = 404; // Not Found
      res.end(`File Not Found: ${relativeFilePath}`);
    } else {
      console.error(`[500] Internal server error: ${error.message}`);
      res.statusCode = 500; // Internal Server Error
      res.end('Internal Server Error');
    }
  }
}