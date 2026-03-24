# HuggingFace Image Generation Proxy

This Cloudflare Worker provides a free, serverless proxy for HuggingFace image generation models. It keeps your API key secure on the server side while allowing users to generate images without their own API keys.

## Features

- **Secure**: API key stored in Cloudflare, never exposed to clients
- **Rate Limited**: 50 requests per hour per IP (configurable)
- **CORS Enabled**: Works directly from browser
- **Model Whitelist**: Only allows safe, popular image models
- **Base64 Output**: Returns images as data URLs for easy display

## Deployment Instructions

### 1. Create a Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com) and sign up for a free account
2. Verify your email

### 2. Get HuggingFace API Key

1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a new access token
3. Copy the token (starts with `hf_`)

### 3. Create the Worker

1. Go to [workers.cloudflare.com](https://workers.cloudflare.com)
2. Click "Create a Service"
3. Name it `sahyagpt-image-proxy` (or any name you prefer)
4. Click "Create service"

### 4. Add the Code

1. In the worker editor, replace the default code with the contents of `huggingface-proxy.js`
2. Click "Save and Deploy"

### 5. Add Environment Variables

1. Go to the "Settings" tab of your worker
2. Click "Variables"
3. Add a new secret:
   - Variable name: `HF_API_KEY`
   - Value: Your HuggingFace API key (e.g., `hf_xxxxxxxxxxxxxxxx`)
4. Click "Encrypt" to make it a secret
5. Click "Save"

### 6. Add KV Namespace (Optional - for rate limiting)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Workers → KV
2. Click "Create a namespace"
3. Name it: `RATE_LIMIT_STORE`
4. Go back to your worker settings
5. Under "KV Namespace Bindings", click "Add binding"
6. Set:
   - Variable name: `RATE_LIMIT_KV`
   - KV namespace: `RATE_LIMIT_STORE`
7. Click "Save"

### 7. Get Your Worker URL

1. Go back to the worker main page
2. Copy the URL (looks like: `https://sahyagpt-image-proxy.yourusername.workers.dev`)

### 8. Update imagine.html

In `imagine.html`, update the API endpoint to use your worker:

```javascript
// Instead of calling HuggingFace directly:
// const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, ...)

// Use your worker:
const response = await fetch('https://sahyagpt-image-proxy.yourusername.workers.dev', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: modelId,
        inputs: prompt,
        parameters: {
            width: dimensions.width,
            height: dimensions.height,
            num_inference_steps: 50,
            guidance_scale: 7.5
        }
    })
});
```

## Supported Models

The worker whitelists these safe, popular models:

| Model | Description | Best For |
|-------|-------------|----------|
| `black-forest-labs/FLUX.1-dev` | High quality | Detailed images |
| `black-forest-labs/FLUX.1-schnell` | Fast generation | Quick drafts |
| `black-forest-labs/FLUX.1-flash` | Ultra fast | Real-time previews |
| `stabilityai/stable-diffusion-3.5-large` | Best quality | Photorealistic |
| `stabilityai/stable-diffusion-3.5-large-turbo` | Fast quality | Quick high-quality |
| `stabilityai/stable-diffusion-xl-base-1.0` | SDXL | General purpose |
| `stabilityai/stable-diffusion-2-1` | SD 2.1 | Classic generation |
| `runwayml/stable-diffusion-v1-5` | SD 1.5 | Legacy compatibility |
| `prompthero/openjourney` | Midjourney-style | Artistic images |
| `dreamlike-art/dreamlike-photoreal-2.0` | Photorealistic | Realistic photos |

To add more models, edit the `allowedModels` array in the worker code.

## API Reference

### Endpoint

```
POST https://your-worker.yourusername.workers.dev
```

### Request Body

```json
{
  "model": "black-forest-labs/FLUX.1-dev",
  "inputs": "A serene landscape with mountains at sunset",
  "parameters": {
    "width": 1024,
    "height": 768,
    "num_inference_steps": 50,
    "guidance_scale": 7.5
  }
}
```

### Response

Success (200):
```json
{
  "success": true,
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "model": "black-forest-labs/FLUX.1-dev",
  "timestamp": "2026-03-24T10:30:00.000Z"
}
```

Error (429 - Rate Limited):
```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 3600
}
```

Error (403 - Model Not Allowed):
```json
{
  "error": "Model not allowed. Use one of the supported models.",
  "allowedModels": [...]
}
```

## Costs

- **Cloudflare Workers**: Free tier includes 100,000 requests/day
- **HuggingFace Inference API**: Free tier includes generous limits
  - Most models: ~$0.002-0.02 per image
  - See [HuggingFace Pricing](https://huggingface.co/pricing) for details

## Security Considerations

1. **API Key**: Stored as encrypted secret in Cloudflare
2. **Rate Limiting**: Prevents abuse (50 req/hour per IP default)
3. **Model Whitelist**: Only allows approved models
4. **No PII**: Workers don't log prompts or images
5. **HTTPS Only**: All traffic encrypted

## Troubleshooting

### Worker returns "API key not set"
- Make sure you added the `HF_API_KEY` secret in worker settings
- Verify the secret is encrypted

### Rate limit errors
- Normal if generating many images
- Wait 1 hour or implement client-side rate limiting
- Adjust `RATE_LIMIT_REQUESTS` in worker code if needed

### Model loading errors
- Some models need to "warm up" on HuggingFace
- First request may take 10-30 seconds
- Subsequent requests are faster

### CORS errors
- Make sure CORS headers are set in worker
- Check browser console for specific error

## Updating the Worker

1. Edit `huggingface-proxy.js` locally
2. Copy updated code to Cloudflare Worker editor
3. Click "Save and Deploy"

## Custom Domain (Optional)

1. In Cloudflare Workers, go to "Triggers" tab
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `images.yoursite.com`)
4. Follow DNS setup instructions

---

**Note**: This proxy is for personal/low-traffic use. For production apps with high traffic, consider:
- Implementing user authentication
- Adding request queuing
- Setting up usage quotas
- Using a dedicated HuggingFace Inference Endpoint
