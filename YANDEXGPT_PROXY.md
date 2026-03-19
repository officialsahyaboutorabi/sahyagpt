# YandexGPT Proxy Setup

Yandex Cloud API blocks browser requests (CORS). This proxy allows SahyaGPT to connect to YandexGPT.

## Quick Start (Using Default Proxy)

A public proxy is available at:
```
https://yandexgpt-proxy.sahyagpt.workers.dev
```

This proxy is automatically used if you don't set a custom one.

## Deploy Your Own Proxy (Recommended)

For better reliability and privacy, deploy your own proxy:

### Option 1: Cloudflare Workers (Free)

1. Go to [workers.cloudflare.com](https://workers.cloudflare.com/) and sign up
2. Click "Create a Service" 
3. Name your worker (e.g., `yandexgpt-proxy`)
4. In the code editor, paste the contents of `yandexgpt-proxy.js`
5. Click "Save and Deploy"
6. Copy your worker URL (e.g., `https://yandexgpt-proxy.yourname.workers.dev`)
7. Enter this URL in SahyaGPT settings under "YandexGPT Proxy URL"

### Option 2: Deno Deploy (Free)

1. Go to [deno.com/deploy](https://deno.com/deploy) and sign in with GitHub
2. Click "New Project"
3. Choose "Deploy from GitHub"
4. Select your fork of this repo
5. Set the entry point to `yandexgpt-proxy-deno.ts`
6. Deploy and copy your URL

### Option 3: Node.js Server

If you have a VPS or server:

```bash
# Install dependencies
npm install express http-proxy-middleware cors

# Create server.js
cat > server.js << 'EOF'
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-folder-id', 'x-data-logging-enabled'],
}));

app.use('/v1', createProxyMiddleware({
  target: 'https://ai.api.cloud.yandex.net',
  changeOrigin: true,
  pathRewrite: {
    '^/v1': '/v1'
  },
  onProxyReq: (proxyReq, req) => {
    console.log('Proxying:', req.method, req.path);
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`YandexGPT proxy running on port ${PORT}`);
});
EOF

# Run
node server.js
```

## Getting Yandex Cloud Credentials

1. Go to [Yandex Cloud Console](https://console.cloud.yandex.com/)
2. Create a folder or use an existing one
3. Get your **Folder ID** from the folder page
4. Create a [service account](https://cloud.yandex.com/en/docs/iam/operations/sa/create) with `ai.languageModels.user` role
5. Create an [API Key](https://cloud.yandex.com/en/docs/iam/operations/api-key/create) for the service account
6. Enter these credentials in SahyaGPT settings

## Available Models

- `yandexgpt` - YandexGPT Pro (most capable)
- `yandexgpt-lite` - YandexGPT Lite (faster, cheaper)

## Troubleshooting

### "CORS header Access-Control-Allow-Origin missing"
The proxy is not configured correctly. Check that CORS headers are enabled.

### "401 Authentication failed"
Your API key is invalid or expired. Create a new one in Yandex Cloud.

### "403 Forbidden"
Your service account doesn't have the `ai.languageModels.user` role. Add it in Yandex Cloud IAM.

### "429 Too Many Requests"
You've hit the rate limit. Wait a moment or upgrade your Yandex Cloud quota.
