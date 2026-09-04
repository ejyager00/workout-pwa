// Service Worker — cache-first for static assets, network-first for HTML navigation
// Increment CACHE_VERSION when making breaking changes to force old caches to clear.
const CACHE_VERSION = 'v4';
const CACHE_NAME = `app-${CACHE_VERSION}`;

// Home page is cached so users can see their last routine when offline.
const HOME_URL = '/';
const STATIC_ASSET_EXTENSIONS = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|otf|webp|avif)(\?.*)?$/i;

// Fully static pages: no user data, no server rendering. Safe to serve cache-first
// so they work offline (the training plan is read in the gym, where signal is bad).
// Bump CACHE_VERSION to publish edits to these.
//
// Listed in CANONICAL form, with the trailing slash. Cloudflare's asset handling
// serves directory pages at "/plan/" and 307s "/plan" to it; caching the
// redirecting form stores a redirected response, which browsers refuse to return
// for a navigation ("Response served by service worker has redirections").
const STATIC_PAGES = ['/plan/'];
const PRECACHE_URLS = ['/offline.html', ...STATIC_PAGES];

// ── Install: pre-cache offline fallback ──────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((url) =>
          // Not cache.add(): it stores whatever fetch returns, redirect flag and all.
          fetch(url)
            .then(async (response) => {
              if (!response.ok) return;
              await cache.put(url, await withoutRedirectFlag(response));
            })
            .catch(() => {
              // A missing entry must not fail the whole install — the rest of the
              // cache, including the offline fallback, is more valuable than this one.
            })
        )
      )
    )
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

  // Strategy 2: Static pages → cache-first, so they load offline. Checked before
  // the navigation branch below, which would otherwise send them to the network.
  const staticPage = canonicalStaticPage(url.pathname);
  if (staticPage) {
    event.respondWith(cacheFirst(request, staticPage));
    return;
  }

  // Strategy 3: HTML navigation → network-first
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

  // Strategy 4: Everything else (POST forms, HTMX XHR, API calls) → network-only
  // Data is dynamic and auth-sensitive; pass through without caching.
});

// ── Helpers ───────────────────────────────────────────────────────────────────

// Maps any spelling of a static page onto its canonical key, so "/plan" and
// "/plan/" share one cache entry and neither hits the network redirect.
function canonicalStaticPage(pathname) {
  const withSlash = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return STATIC_PAGES.includes(withSlash) ? withSlash : null;
}

// A response that followed a redirect carries `redirected === true`, and returning
// one from a service worker for a navigation is a hard error in Safari and Chrome.
// Rebuilding the response clears the flag; the body and headers are unchanged.
async function withoutRedirectFlag(response) {
  if (!response.redirected) return response;
  return new Response(await response.blob(), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

// `cacheKey` overrides the lookup/store key, so "/plan" and "/plan/" share one entry.
async function cacheFirst(request, cacheKey = request) {
  const cached = await caches.match(cacheKey);
  if (cached) return cached;

  const response = await withoutRedirectFlag(await fetch(request));
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(cacheKey, response.clone()); // update in background
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
