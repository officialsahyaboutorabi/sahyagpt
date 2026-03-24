/**
 * HuggingFace Image Generation Proxy Worker
 * 
 * This Cloudflare Worker proxies image generation requests to HuggingFace
 * while keeping the API key secure on the server side.
 * 
 * Setup:
 * 1. Create a Cloudflare Worker at https://workers.cloudflare.com
 * 2. Copy this code into the worker
 * 3. Add your HuggingFace API key as a secret: HF_API_KEY
 * 4. Deploy and use the worker URL in your application
 */

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 50;  // requests per window
const RATE_LIMIT_WINDOW = 3600;  // 1 hour in seconds

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders 
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        error: 'Method not allowed. Use POST.' 
      }), { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    try {
      // Get client IP for rate limiting
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      
      // Check rate limit
      const rateLimitKey = `rate_limit:${clientIP}`;
      const rateLimitData = await env.RATE_LIMIT_KV?.get(rateLimitKey);
      
      let requestCount = 0;
      let windowStart = Date.now();
      
      if (rateLimitData) {
        const data = JSON.parse(rateLimitData);
        // Check if window has expired
        if (Date.now() - data.windowStart < RATE_LIMIT_WINDOW * 1000) {
          requestCount = data.count;
          windowStart = data.windowStart;
        }
      }
      
      if (requestCount >= RATE_LIMIT_REQUESTS) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((windowStart + RATE_LIMIT_WINDOW * 1000 - Date.now()) / 1000)
        }), { 
          status: 429, 
          headers: {
            ...corsHeaders,
            'Retry-After': String(Math.ceil((windowStart + RATE_LIMIT_WINDOW * 1000 - Date.now()) / 1000))
          }
        });
      }
      
      // Update rate limit counter
      await env.RATE_LIMIT_KV?.put(rateLimitKey, JSON.stringify({
        count: requestCount + 1,
        windowStart: windowStart
      }), { expirationTtl: RATE_LIMIT_WINDOW });

      // Parse request body
      const body = await request.json();
      const { model, inputs, parameters } = body;

      if (!model || !inputs) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields: model, inputs' 
        }), { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      // Validate model (whitelist popular safe models)
      const allowedModels = [
        'black-forest-labs/FLUX.1-dev',
        'black-forest-labs/FLUX.1-schnell',
        'black-forest-labs/FLUX.1-flash',
        'stabilityai/stable-diffusion-3.5-large',
        'stabilityai/stable-diffusion-3.5-large-turbo',
        'stabilityai/stable-diffusion-xl-base-1.0',
        'stabilityai/stable-diffusion-2-1',
        'runwayml/stable-diffusion-v1-5',
        'prompthero/openjourney',
        'dreamlike-art/dreamlike-photoreal-2.0'
      ];

      if (!allowedModels.includes(model)) {
        return new Response(JSON.stringify({ 
          error: 'Model not allowed. Use one of the supported models.',
          allowedModels
        }), { 
          status: 403, 
          headers: corsHeaders 
        });
      }

      // Get API key from environment
      const apiKey = env.HF_API_KEY;
      
      if (!apiKey) {
        return new Response(JSON.stringify({ 
          error: 'Server configuration error: API key not set' 
        }), { 
          status: 500, 
          headers: corsHeaders 
        });
      }

      // Forward request to HuggingFace
      const hfResponse = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs,
          parameters: parameters || {
            num_inference_steps: 50,
            guidance_scale: 7.5
          }
        })
      });

      if (!hfResponse.ok) {
        const errorText = await hfResponse.text();
        console.error('HuggingFace API error:', hfResponse.status, errorText);
        
        return new Response(JSON.stringify({ 
          error: 'Image generation failed',
          details: errorText,
          status: hfResponse.status
        }), { 
          status: hfResponse.status, 
          headers: corsHeaders 
        });
      }

      // Get the image blob
      const imageBlob = await hfResponse.blob();
      
      // Convert to base64 for easier handling in browser
      const arrayBuffer = await imageBlob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const dataUrl = `data:${imageBlob.type};base64,${base64}`;

      // Return success response
      return new Response(JSON.stringify({
        success: true,
        image: dataUrl,
        model,
        timestamp: new Date().toISOString()
      }), { 
        status: 200, 
        headers: corsHeaders 
      });

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};
