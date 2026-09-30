/* Service worker ringkas — cuma cache "shell" splash + offline page dalam
   bundle APK ni (index.html, offline.html, ikon). Data pesanan/menu sebenar
   datang terus dari https://kukusanmy.web.app/Admin.html (Firebase), TIDAK
   dicache di sini — sync realtime kekal live macam biasa. */
const CACHE = 'kukusan-shell-v1';
const ASSETS = [
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; /* jangan sentuh request ke kukusanmy.web.app/Firebase */
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => caches.match('./offline.html')))
  );
});
