# HuggingFace Inference Endpoints Setup

This guide shows you how to deploy image generation models on HuggingFace's GPU servers, eliminating the need for users to download models or use API keys.

## Overview

**Architecture:**
```
User Browser → SahyaGPT Imagine → HuggingFace Inference Endpoint (GPU Server)
```

**Benefits:**
- ✅ No model downloads for users
- ✅ No API keys needed for users  
- ✅ You control which models are available
- ✅ Dedicated GPU resources
- ✅ Faster inference (models always warm)

## Pricing

| GPU Type | Hourly Rate | Images/Min | Cost per 1K Images |
|----------|-------------|------------|-------------------|
| Nvidia T4 (Base) | ~$0.60/hr | ~10 | ~$1.00 |
| Nvidia L4 (Recommended) | ~$1.00/hr | ~20 | ~$0.83 |
| Nvidia A10G | ~$2.00/hr | ~30 | ~$1.11 |
| Nvidia A100 | ~$4.00/hr | ~60 | ~$1.11 |

**Note:** Endpoints auto-scale to zero when not in use (no idle costs!)

## Step-by-Step Setup

### Step 1: Create HuggingFace Account

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for free account
3. Verify email

### Step 2: Add Payment Method

1. Go to [Settings → Billing](https://huggingface.co/settings/billing)
2. Add credit card (required even for free tier)
3. You'll get $5 free credits to start

### Step 3: Deploy Image Model

1. Go to [Endpoints](https://ui.endpoints.huggingface.co/)
2. Click "New Endpoint"
3. Configure:
   - **Model**: Select from list below
   - **Endpoint Name**: `sahyagpt-flux` (or custom)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **GPU**: `Nvidia L4` (recommended) or `Nvidia T4` (budget)
   - **Scaling**: 
     - Min replicas: `0` (scales to zero when idle)
     - Max replicas: `2` (handles traffic spikes)
   - **Advanced**:
     - Container type: `Default`
     - Task: `Text-to-Image`

4. Click "Create Endpoint"
5. Wait 5-10 minutes for deployment

### Step 4: Get Endpoint URL

Once deployed, copy your endpoint URL:
```
https://sahyagpt-flux-xxxxxxxx.us-east-1.aws.endpoints.huggingface.cloud
```

### Step 5: Update imagine.html

In `imagine.html`, replace the HuggingFace section with:

```javascript
async generateImage(prompt) {
    const dimensions = this.getAspectRatioDimensions(this.currentAspectRatio);
    
    // Using HuggingFace Inference Endpoint (no user API key needed!)
    const ENDPOINT_URL = 'https://your-endpoint-name-xxxxxxxx.region.aws.endpoints.huggingface.cloud';
    
    try {
        const response = await fetch(ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    width: dimensions.width,
                    height: dimensions.height,
                    num_inference_steps: 50,
                    guidance_scale: 7.5
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Endpoint error: ${response.status}`);
        }
        
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        this.removeGeneratingPlaceholder();
        this.addResult({
            type: 'image',
            url: imageUrl,
            prompt: prompt,
            aspectRatio: this.currentAspectRatio,
            timestamp: Date.now(),
            model: 'FLUX.1-dev (Hosted)'
        });
        
        this.showToast('Image generated!', 'success');
        
    } catch (error) {
        console.error('Generation error:', error);
        this.showToast(`Error: ${error.message}`, 'error');
        this.removeGeneratingPlaceholder();
    }
}
```

## Recommended Models to Deploy

### Best Overall: FLUX.1-dev
- **Model ID**: `black-forest-labs/FLUX.1-dev`
- **GPU**: Nvidia L4 or A10G
- **Speed**: ~8-12 sec/image
- **Quality**: Excellent
- **Cost**: ~$0.001-0.002 per image

### Fastest: FLUX.1-schnell
- **Model ID**: `black-forest-labs/FLUX.1-schnell`  
- **GPU**: Nvidia T4 (sufficient)
- **Speed**: ~2-4 sec/image
- **Quality**: Good
- **Cost**: ~$0.0005 per image

### Budget Option: Stable Diffusion XL
- **Model ID**: `stabilityai/stable-diffusion-xl-base-1.0`
- **GPU**: Nvidia T4
- **Speed**: ~5-8 sec/image
- **Quality**: Good
- **Cost**: ~$0.0008 per image

## Advanced: Multiple Endpoints

Deploy multiple models and let users choose:

```javascript
const ENDPOINTS = {
    'flux-dev': 'https://sahyagpt-flux-dev-xxx.us-east-1.aws.endpoints.huggingface.cloud',
    'flux-schnell': 'https://sahyagpt-flux-fast-xxx.us-east-1.aws.endpoints.huggingface.cloud',
    'sdxl': 'https://sahyagpt-sdxl-xxx.us-east-1.aws.endpoints.huggingface.cloud'
};

async generateImage(prompt, modelKey = 'flux-dev') {
    const endpoint = ENDPOINTS[modelKey];
    // ... rest of generation code
}
```

## Security: Cloudflare Worker Proxy (Optional)

To hide your endpoint URL and add rate limiting, use a proxy:

### Cloudflare Worker Code

```javascript
export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    
    // Your HuggingFace endpoint (stored securely)
    const HF_ENDPOINT = env.HF_ENDPOINT;  // Set in Cloudflare secrets
    
    const body = await request.json();
    
    const response = await fetch(HF_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const blob = await response.blob();
    
    return new Response(blob, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': blob.type
      }
    });
  }
};
```

Then in imagine.html:
```javascript
// Use proxy instead of direct endpoint
const PROXY_URL = 'https://your-worker.yourusername.workers.dev';
```

## Monitoring & Logs

1. Go to your [Endpoints Dashboard](https://ui.endpoints.huggingface.co/)
2. Click on your endpoint
3. View:
   - **Metrics**: Requests/min, latency, GPU utilization
   - **Logs**: Request/response logs
   - **Billing**: Usage and costs

## Auto-Scaling Configuration

| Setting | Recommended | Description |
|---------|-------------|-------------|
| Min Replicas | 0 | Scales to zero when idle (saves money) |
| Max Replicas | 2 | Handles traffic spikes |
| Scale Down Delay | 30 sec | Time before scaling to zero |
| Concurrency | 1 | Requests per replica |

## Cost Optimization Tips

1. **Use T4 GPU for testing** - Cheapest option
2. **Set Min Replicas to 0** - No idle costs
3. **Use FLUX.1-schnell** - Faster = cheaper per image
4. **Batch requests** - Process multiple prompts together
5. **Monitor usage** - Set billing alerts

## Troubleshooting

### Cold Start Latency
- First request after idle: 10-30 seconds
- Keep Min Replicas = 1 if you need instant response
- Show "Warming up..." message to users

### Out of Memory
- Reduce batch size in parameters
- Use smaller GPU (T4 has 16GB)
- Switch to lighter model (FLUX.1-schnell)

### Model Not Loading
- Check model is supported on HuggingFace
- Verify license acceptance for some models
- Check logs in Endpoints dashboard

### High Costs
- Ensure Min Replicas = 0
- Check for runaway scaling
- Monitor with `hf endpoint logs`

## Example: Complete Setup

### 1. Deploy Endpoint
Model: `black-forest-labs/FLUX.1-schnell`
GPU: Nvidia T4
Min/Max Replicas: 0/2

### 2. Get URL
`https://sahyagpt-flux-xxxx.us-east-1.aws.endpoints.huggingface.cloud`

### 3. Update imagine.html
Replace the existing `generateImage` function with the endpoint version.

### 4. Test
```bash
curl -X POST \
  https://your-endpoint.huggingface.cloud \
  -H "Content-Type: application/json" \
  -d '{"inputs": "a sunset over mountains"}' \
  --output test.png
```

### 5. Monitor
Watch costs at [billing](https://huggingface.co/settings/billing)

---

**Next Steps:**
1. Choose your model (FLUX.1-schnell recommended for cost)
2. Deploy on HuggingFace
3. Copy endpoint URL
4. I'll update `imagine.html` to use it!
