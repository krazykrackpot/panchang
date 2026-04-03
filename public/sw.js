const CACHE_NAME = 'panchang-v3';
const OFFLINE_URL = '/offline';

// Precache on install
const PRECACHE_URLS = [
  '/favicon.svg',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, API mutations, analytics, external
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/checkout') ||
    url.pathname.startsWith('/api/webhooks') ||
    url.pathname.startsWith('/api/user') ||
    url.pathname.startsWith('/api/notifications') ||
    url.hostname.includes('vercel') ||
    url.hostname.includes('google') ||
    url.hostname.includes('supabase')
  ) return;

  // API panchang/calendar: network-first with 1-hour cache
  if (url.pathname.startsWith('/api/panchang') || url.pathname.startsWith('/api/calendar')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Add expiry header
            const headers = new Headers(clone.headers);
            headers.set('sw-cached-at', Date.now().toString());
            const cachedResponse = new Response(clone.body, { status: clone.status, statusText: clone.statusText, headers });
            cache.put(request, cachedResponse);
          });
        }
        return response;
      }).catch(async () => {
        const cached = await caches.match(request);
        if (cached) {
          // Check if cache is < 1 hour old
          const cachedAt = parseInt(cached.headers.get('sw-cached-at') || '0');
          if (Date.now() - cachedAt < 3600000) return cached;
        }
        return new Response(JSON.stringify({ error: 'offline' }), { headers: { 'Content-Type': 'application/json' } });
      })
    );
    return;
  }

  // Static assets: cache-first
  if (
    url.pathname.match(/\.(js|css|svg|png|jpg|jpeg|webp|woff2?|ico|json)$/) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Pages: network-first with offline fallback
  event.respondWith(
    fetch(request).then((response) => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      // Return offline page for navigation requests
      if (request.mode === 'navigate') {
        const offlinePage = await caches.match(OFFLINE_URL);
        if (offlinePage) return offlinePage;
      }
      return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  let data = { title: 'Dekho Panchang', body: "Check today's Panchang!", url: '/en/panchang' };
  if (event.data) {
    try { data = { ...data, ...event.data.json() }; } catch { data.body = event.data.text(); }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/favicon.svg',
      vibrate: [100, 50, 100],
      data: { url: data.url || '/en/panchang' },
      actions: [
        { action: 'open', title: 'Open' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const url = event.notification.data?.url || '/en/panchang';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (new URL(client.url).pathname === url && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
