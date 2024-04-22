import { assets } from "./assets";

const staticDevCoffee = "dev-coffee-site-v1";

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets).catch(error => {
        console.error("Failed to cache:", error);
      });
      console.log("Caching assets...")
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  console.log("Fetching...");
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
