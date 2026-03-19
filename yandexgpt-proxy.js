/**
 * YandexGPT CORS Proxy Worker
 * 
 * This Cloudflare Worker proxies requests from the browser to Yandex Cloud API,
 * bypassing CORS restrictions.
 * 
 * To deploy:
 * 1. Go to https://workers.cloudflare.com/
 * 2. Create a new worker
 * 3. Copy and paste this code
 * 4. Deploy and get your worker URL
 * 5. Enter the URL in SahyaGPT settings (or use the default)
 */

// Configuration
const YANDEX_API_BASE = 'https://ai.api.cloud.yandex.net/v1';

// CORS headers to allow browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-folder-id, x-data-logging-enabled',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      // Build the target URL
      const url = new URL(request.url);
      const targetPath = url.pathname;
      const targetUrl = `${YANDEX_API_BASE}${targetPath}`;

      // Forward the request to Yandex API
      const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: {
          // Forward original headers
          'Content-Type': request.headers.get('Content-Type') || 'application/json',
          'Authorization': request.headers.get('Authorization'),
          'x-folder-id': request.headers.get('x-folder-id'),
          'x-data-logging-enabled': request.headers.get('x-data-logging-enabled') || 'false',
        },
        body: request.body,
      });

      // Fetch from Yandex API
      const response = await fetch(modifiedRequest);

      // Create new response with CORS headers
      const modifiedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          ...corsHeaders,
        },
      });

      return modifiedResponse;

    } catch (error) {
      console.error('Proxy error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Proxy error', 
          message: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },
};
