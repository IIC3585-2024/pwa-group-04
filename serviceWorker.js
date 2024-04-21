const staticDevCoffee = "dev-coffee-site-v1";
const assets = [
  "/pwa-group-04/",
  "/pwa-group-04/index.html",
  "/pwa-group-04/css/style.css",
  "/pwa-group-04/js/app.js",
  "/pwa-group-04/images/coffee1.jpg",
  "/pwa-group-04/images/coffee2.jpg",
  "/pwa-group-04/images/coffee3.jpg",
  "/pwa-group-04/images/coffee4.jpg",
  "/pwa-group-04/images/coffee5.jpg",
  "/pwa-group-04/images/coffee6.jpg",
  "/pwa-group-04/images/coffee7.jpg",
  "/pwa-group-04/images/coffee8.jpg",
  "/pwa-group-04/images/coffee9.jpg"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
