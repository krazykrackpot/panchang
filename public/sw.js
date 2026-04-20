/**
 * Service Worker — Dekho Panchang PWA
 * v3: Multi-locale precache, offline fallback page, cache limits, update signaling
 * Strategies: Static=CacheFirst, Learn=StaleWhileRevalidate, API=NetworkFirst
 */
var CV = 'dp-v3';
var CS = CV + '-static', CP = CV + '-pages', CA = CV + '-api';

// Max entries per cache to prevent unbounded growth
var MAX_PAGES = 80, MAX_API = 40;

// Production locales to precache
var PRECACHE_LOCALES = ['en', 'hi', 'ta', 'bn'];

self.addEventListener('install', function(e) {
  var urls = ['/manifest.json', '/favicon.svg', '/offline'];
  PRECACHE_LOCALES.forEach(function(l) {
    urls.push('/' + l);
    urls.push('/' + l + '/panchang');
  });
  e.waitUntil(caches.open(CS).then(function(c) {
    return c.addAll(urls).catch(function(err) {
      console.warn('[SW] Precache partial failure:', err);
    });
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(ks) {
    return Promise.all(ks.filter(function(k) {
      return k.startsWith('dp-') && k !== CS && k !== CP && k !== CA;
    }).map(function(k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

// Notify clients when a new SW version is available
self.addEventListener('message', function(event) {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', function(e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || !u.protocol.startsWith('http')) return;
  if (u.pathname.startsWith('/api/')) { e.respondWith(netFirst(r, CA)); return; }
  if (u.pathname.includes('/learn/')) { e.respondWith(swr(r, CP)); return; }
  if (u.pathname.startsWith('/_next/static/') || u.pathname.match(/\.(svg|png|woff2|ico|webp)$/)) {
    e.respondWith(cacheFirst(r, CS));
    return;
  }
  if (r.headers.get('accept') && r.headers.get('accept').indexOf('text/html') > -1) {
    e.respondWith(htmlFetch(r));
    return;
  }
  e.respondWith(netFirst(r, CS));
});

// HTML pages: NetworkFirst with offline fallback page
function htmlFetch(r) {
  return fetch(r).then(function(res) {
    if (res.ok) {
      var clone = res.clone();
      caches.open(CP).then(function(ca) {
        ca.put(r, clone);
        trimCache(ca, MAX_PAGES);
      });
    }
    return res;
  }).catch(function() {
    return caches.match(r).then(function(c) {
      return c || caches.match('/offline');
    });
  });
}

function cacheFirst(r, n) {
  return caches.match(r).then(function(c) {
    if (c) return c;
    return fetch(r).then(function(res) {
      if (!res.ok) return res;
      var clone = res.clone();
      caches.open(n).then(function(ca) { ca.put(r, clone); });
      return res;
    }).catch(function() {
      return caches.match('/offline') || new Response('Offline', {status: 503});
    });
  });
}

function swr(r, n) {
  return caches.open(n).then(function(ca) {
    return ca.match(r).then(function(c) {
      var fp = fetch(r).then(function(res) {
        if (res.ok) {
          var clone = res.clone();
          ca.put(r, clone);
          trimCache(ca, MAX_PAGES);
        }
        return res;
      }).catch(function() { return null; });
      return c || fp.then(function(res) {
        return res || caches.match('/offline');
      });
    });
  });
}

function netFirst(r, n) {
  return fetch(r).then(function(res) {
    if (res.ok) {
      var clone = res.clone();
      caches.open(n).then(function(ca) {
        ca.put(r, clone);
        trimCache(ca, MAX_API);
      });
    }
    return res;
  }).catch(function() {
    return caches.match(r).then(function(c) {
      return c || new Response('{"error":"offline"}', {status:503, headers:{'Content-Type':'application/json'}});
    });
  });
}

// Evict oldest entries when cache exceeds max
function trimCache(cache, max) {
  cache.keys().then(function(keys) {
    if (keys.length > max) {
      cache.delete(keys[0]).then(function() { trimCache(cache, max); });
    }
  });
}

// ─── Push Notifications ─────────────────────────────────────────────────────

self.addEventListener('push', function(event) {
  if (!event.data) return;
  try {
    var payload = event.data.json();
    var title = payload.title || 'Dekho Panchang';
    var options = {
      body: payload.body || '',
      icon: payload.icon || '/favicon.svg',
      badge: payload.badge || '/apple-touch-icon.png',
      tag: payload.tag || 'dp-notification',
      data: { url: payload.url || '/' },
      vibrate: [100, 50, 100],
      actions: [
        { action: 'open', title: 'Open' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    console.error('[SW] Push parse error:', e);
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'dismiss') return;
  var url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
