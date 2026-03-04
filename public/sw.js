// Service Worker — cache-first for static assets, network-first for HTML navigation
// Increment CACHE_VERSION when making breaking changes to force old caches to clear.
const CACHE_VERSION = 'v2';
const CACHE_NAME = `app-${CACHE_VERSION}`;

// Home page is cached so users can see their last routine when offline.
const HOME_URL = '/';
const STATIC_ASSET_EXTENSIONS = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|otf|webp|avif)(\?.*)?$/i;
const PRECACHE_URLS = ['/offline.html'];

// ── Install: pre-cache offline fallback ──────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ── Activate: remove stale caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: routing strategies ─────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Strategy 1: Static assets → cache-first (serve from cache; fetch + update in background)
  if (STATIC_ASSET_EXTENSIONS.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Strategy 2: HTML navigation → network-first
  //   - For the home page (/): cache the response on success so the last-seen
  //     routine is available offline. Fall back to cached home, then offline.html.
  //   - For all other pages: fall back directly to offline.html.
  if (request.mode === 'navigate') {
    if (url.pathname === HOME_URL) {
      event.respondWith(networkFirstCacheHome(request));
    } else {
      event.respondWith(networkFirstWithOfflineFallback(request));
    }
    return;
  }

  // Strategy 3: Everything else (POST forms, HTMX XHR, API calls) → network-only
  // Data is dynamic and auth-sensitive; pass through without caching.
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone()); // update in background
  }
  return response;
}

// Network-first for the home page: saves successful response so the user
// can see their last routine when they open the app offline.
async function networkFirstCacheHome(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(HOME_URL);
    if (cached) return cached;
    const offline = await caches.match('/offline.html');
    return offline ?? new Response('You are offline.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch {
    const cached = await caches.match('/offline.html');
    return cached ?? new Response('You are offline.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}
