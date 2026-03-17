// Service Worker for sbgpt.qzz.io
// Fix: respondWith() must never resolve with undefined — always fall back to
// fetch() on a cache miss.  Cloudflare cdn-cgi/* requests (RUM, analytics)
// are skipped entirely so the browser handles them natively.

const CACHE_NAME = 'sahyagpt-v1';

// ── Install: pre-cache the shell ─────────────────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            cache.addAll([
                '/',
                '/index.html',
                '/fonts.css',
            ]).catch(() => {}) // ignore individual failures during install
        )
    );
    self.skipWaiting();
});

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// ── Fetch: cache-first with network fallback ─────────────────────────────────
self.addEventListener('fetch', event => {
    const url = event.request.url;

    // Never intercept Cloudflare analytics/RUM — let them go straight to network.
    // This is the fix for: "respondWith() resolved with non-Response value 'undefined'"
    if (url.includes('/cdn-cgi/')) return;

    // Only handle GET requests; pass everything else through unchanged.
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            // Always return a real Response — either from cache or network.
            // Returning `cached` alone would resolve with `undefined` on a miss.
            return cached || fetch(event.request).then(networkResponse => {
                // Cache successful same-origin responses for next time.
                if (
                    networkResponse.ok &&
                    new URL(url).origin === self.location.origin
                ) {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return networkResponse;
            });
        }).catch(() =>
            // Network failed and nothing in cache — return a minimal offline page.
            new Response('Offline — please check your connection.', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' },
            })
        )
    );
});
