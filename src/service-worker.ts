// src/service-worker.ts
/* eslint-disable no-restricted-globals */
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  // Other webpack configurations...
  plugins: [
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/service-worker.ts', // Path to your service worker file
      swDest: 'service-worker.js', // Output service worker file
    }),
  ],
};
const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = ["/", "/index.html", "/favicon.ico"];

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
export {};