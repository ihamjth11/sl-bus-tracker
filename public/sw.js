/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'sl-bus-tracker-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache the live AI chat API — always needs a fresh network response.
  if (url.pathname.startsWith('/api/')) return;

  // Google Maps / external scripts: let the browser handle normally, don't intercept.
  if (url.origin !== self.location.origin) return;

  // App shell / static assets: cache-first, falling back to network, and cache what we fetch.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline and not cached — for navigations, fall back to the cached app shell.
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});