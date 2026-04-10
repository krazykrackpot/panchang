/**
 * Service Worker — Dekho Panchang PWA
 * Caching: Static=CacheFirst, Learn=StaleWhileRevalidate, API=NetworkFirst
 */
var CV = 'dp-v1';
var CS = CV + '-static', CP = CV + '-pages', CA = CV + '-api';

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CS).then(function(c) {
    return c.addAll(['/', '/en', '/en/panchang', '/en/learn', '/manifest.json', '/favicon.svg']).catch(function(){});
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(ks) {
    return Promise.all(ks.filter(function(k) { return k.startsWith('dp-') && k !== CS && k !== CP && k !== CA; }).map(function(k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || !u.protocol.startsWith('http')) return;
  if (u.pathname.startsWith('/api/')) { e.respondWith(netFirst(r, CA)); return; }
  if (u.pathname.includes('/learn/')) { e.respondWith(swr(r, CP)); return; }
  if (u.pathname.startsWith('/_next/static/') || u.pathname.match(/\.(svg|png|woff2)$/)) { e.respondWith(cacheFirst(r, CS)); return; }
  if (r.headers.get('accept') && r.headers.get('accept').indexOf('text/html') > -1) { e.respondWith(swr(r, CP)); return; }
  e.respondWith(netFirst(r, CS));
});

function cacheFirst(r, n) {
  return caches.match(r).then(function(c) {
    if (c) return c;
    return fetch(r).then(function(res) { if (res.ok) caches.open(n).then(function(ca) { ca.put(r, res.clone()); }); return res; })
      .catch(function() { return new Response('Offline', {status: 503}); });
  });
}

function swr(r, n) {
  return caches.open(n).then(function(ca) {
    return ca.match(r).then(function(c) {
      var fp = fetch(r).then(function(res) { if (res.ok) ca.put(r, res.clone()); return res; }).catch(function() { return null; });
      return c || fp.then(function(res) { return res || new Response('Offline — visit this page while online first', {status:503, headers:{'Content-Type':'text/plain'}}); });
    });
  });
}

function netFirst(r, n) {
  return fetch(r).then(function(res) { if (res.ok) caches.open(n).then(function(ca) { ca.put(r, res.clone()); }); return res; })
    .catch(function() { return caches.match(r).then(function(c) { return c || new Response('Offline', {status:503}); }); });
}
