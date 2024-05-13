const precachedResources = [
  "",
  "index.html",
  "recipes.html",
  "styles/style.css",
  "js/app.js",
  "js/jquery-3.7.1.min.js",
  "js/scripts/recipeScript.js",
  "js/ingredient/ingredient_factory.js",
  "js/ingredient/ingredient.js",
  "js/steps/steps_factory.js",
  "js/recipe/index.js",
  "js/recipe/recipe_factory.js",
  "js/recipe/recipe_repository.js",
  "js/recipe/recipe.js",
  "js/firebase-initializer.js",
  "firebase-messaging-sw.js",
];

const cacheName = "cooknote-site-v1";

async function precache() {
  const cache = await caches.open(cacheName);
  return cache.addAll(precachedResources);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

function isCacheable(request) {
  const url = new URL(request.url);
  return !url.pathname.endsWith(".json");
}

async function cacheFirstWithRefresh(request) {
  const fetchResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return (await caches.match(request)) || (await fetchResponsePromise);
}

self.addEventListener("fetch", (event) => {
  if (isCacheable(event.request)) {
    event.respondWith(cacheFirstWithRefresh(event.request));
  }
});
