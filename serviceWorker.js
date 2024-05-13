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


// Firebase Service worker
importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js');


const firebaseConfig = {
    apiKey: "AIzaSyAX2FRz3eHgNv2DAUdVfio82CCZalxVYCk",
    authDomain: "cooknote-57a97.firebaseapp.com",
    projectId: "cooknote-57a97",
    storageBucket: "cooknote-57a97.appspot.com",
    messagingSenderId: "1073449674999",
    appId: "1:1073449674999:web:1bc2aae67138591276cbf2",
    measurementId: "G-473RY4JRVK"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(function(payload) {

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});