/**
 * YandexGPT CORS Proxy for Deno Deploy
 * 
 * Deploy to Deno Deploy:
 * 1. Go to https://deno.com/deploy
 * 2. Create new project from GitHub
 * 3. Select this file as entry point
 * 4. Deploy!
 */

const YANDEX_API_BASE = "https://ai.api.cloud.yandex.net/v1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-folder-id, x-data-logging-enabled",
  "Access-Control-Max-Age": "86400",
};

Deno.serve(async (request) => {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(request.url);
    const targetPath = url.pathname;
    const targetUrl = `${YANDEX_API_BASE}${targetPath}`;

    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: {
        "Content-Type": request.headers.get("Content-Type") || "application/json",
        "Authorization": request.headers.get("Authorization") || "",
        "x-folder-id": request.headers.get("x-folder-id") || "",
        "x-data-logging-enabled": request.headers.get("x-data-logging-enabled") || "false",
      },
      body: request.body,
    });

    const response = await fetch(modifiedRequest);

    const responseHeaders: Record<string, string> = {
      ...corsHeaders,
    };
    
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Proxy error", 
        message: error.message 
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
