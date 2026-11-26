var cacheName = 'zvonok-v8';
var appFiles = [
    './',
    'index.html',
    'schedule.html',
    'about.html',
    'manifest.json',
    'css/style.css',
    'js/theme.js',
    'js/calendar.js',
    'js/main.js',
    'images/bell.png',
    'images/icon-192.png',
    'images/icon-512.png'
];

self.addEventListener('install', function(e) {
    self.skipWaiting();
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(appFiles);
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.map(function(k) {
                    if (k !== cacheName) {
                        return caches.delete(k);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        fetch(e.request).catch(function() {
            return caches.match(e.request);
        })
    );
});
