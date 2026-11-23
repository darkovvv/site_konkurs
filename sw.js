// скрипт сделан по руководству MDN "Caching":
// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching

const cacheName = "zvonok-v1";
const precachedResources = [
  "./",
  "index.html",
  "schedule.html",
  "about.html",
  "manifest.json",
  "css/style.css",
  "js/calendar.js",
  "js/main.js",
  "js/theme.js",
  "images/bell.png",
  "images/icon-192.png",
  "images/icon-512.png",
];

//при установке сохраняем основные файлы в кэш
async function precache() {
  const cache = await caches.open(cacheName);
  return cache.addAll(precachedResources);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

// удаляем старые версии при активации
async function deleteOldCaches() {
  const names = await caches.keys();
  await Promise.all(
    names.filter((name) => name !== cacheName).map((name) => caches.delete(name)),
  );
}

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});

//тыкаем сеть и обновляем кэш при ошибке из кэша берем
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  //get-запросы кэшируем
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }
  event.respondWith(networkFirst(event.request));
});
