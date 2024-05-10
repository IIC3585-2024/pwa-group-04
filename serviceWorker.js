const assets = [
  ``,
  `index.html`,
  `recipes.html`,
  `styles/style.css`,
  `js/app.js`,
  `js/jquery-3.7.1.min.js`,
  `js/scripts/recipeScript.js`,
  `js/ingredient/ingredient_factory.js`,
  `js/ingredient/ingredient.js`,
  `js/steps/steps_factory.js`,
  `js/recipe/index.js`,
  `js/recipe/recipe_factory.js`,
  `js/recipe/recipe_repository.js`,
  `js/recipe/recipe.js`,
  `assets/images/coffee1.jpg`,
  `assets/images/coffee2.jpg`,
  `assets/images/coffee3.jpg`,
  `assets/images/coffee4.jpg`,
  `assets/images/coffee5.jpg`,
  `assets/images/coffee6.jpg`,
  `assets/images/coffee7.jpg`,
  `assets/images/coffee8.jpg`,
  `assets/images/coffee9.jpg`
];

const staticCookNote = "cooknote-site-v1";

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticCookNote).then(cache => {
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
      console.log(res, "res")
      return res || fetch(fetchEvent.request);
    })
  );
});
