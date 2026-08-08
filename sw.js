const CACHE = 'formue-v2';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.json', './icon.svg'];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => { if (event.request.method === 'GET' && response.ok && new URL(event.request.url).origin === self.location.origin) { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); } return response; }).catch(() => caches.match('./index.html')))));
