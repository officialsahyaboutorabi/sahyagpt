/**
 * YandexGPT CORS Proxy Worker
 * 
 * Deploy to Cloudflare Workers:
 * 1. Go to https://dash.cloudflare.com/ → Workers & Pages → Create Worker
 * 2. Paste this code
 * 3. Save and Deploy
 */

const YANDEX_API_BASE = 'https://ai.api.cloud.yandex.net/v1';

// CORS headers to allow browser requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, OpenAI-Project, x-data-logging-enabled',
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

      // Get headers from incoming request
      const authHeader = request.headers.get('Authorization');
      const folderId = request.headers.get('OpenAI-Project');
      
      // Build headers for Yandex API
      const targetHeaders = {
        'Content-Type': 'application/json',
      };
      
      if (authHeader) {
        targetHeaders['Authorization'] = authHeader;
      }
      if (folderId) {
        targetHeaders['OpenAI-Project'] = folderId;
      }

      // Forward the request to Yandex API
      const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: targetHeaders,
        body: request.body,
      });

      // Fetch from Yandex API
      const response = await fetch(modifiedRequest);

      // Create response headers with CORS
      const responseHeaders = new Headers(response.headers);
      
      // Add CORS headers to response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });

      // Return response with CORS headers
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });

    } catch (error) {
      console.error('Proxy error:', error);
      
      // Return error with CORS headers
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
