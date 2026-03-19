/**
 * YandexGPT CORS Proxy - Node.js/Express Server
 * 
 * Setup:
 *   npm install express http-proxy-middleware cors
 * 
 * Run:
 *   node yandexgpt-proxy-node.js
 * 
 * Or with environment variables:
 *   PORT=3000 node yandexgpt-proxy-node.js
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-folder-id', 'x-data-logging-enabled'],
  credentials: true,
}));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'YandexGPT CORS Proxy',
    target: 'https://ai.api.cloud.yandex.net/v1',
    timestamp: new Date().toISOString(),
  });
});

// Proxy all /v1 requests to Yandex API
app.use('/v1', createProxyMiddleware({
  target: 'https://ai.api.cloud.yandex.net',
  changeOrigin: true,
  secure: true,
  logLevel: 'info',
  onProxyReq: (proxyReq, req) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  },
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║         YandexGPT CORS Proxy Server                    ║
╠════════════════════════════════════════════════════════╣
║  URL: http://localhost:${PORT}/v1                       ║
║  Target: https://ai.api.cloud.yandex.net/v1           ║
║  CORS: Enabled (allowing all origins)                 ║
╚════════════════════════════════════════════════════════╝

Add this URL to SahyaGPT settings:
  http://localhost:${PORT}/v1

Or deploy to a public server and use:
  https://your-server.com/v1
  `);
});
