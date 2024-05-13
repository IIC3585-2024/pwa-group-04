import { RecipeRepository } from "./recipe/recipe_repository.js";
import initializeFirebase from "./firebase-initializer.js";


export const recipeRepository = new RecipeRepository();

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Loaded DOM")
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register(`serviceWorker.js`)
      .then(res => {
        console.log("Service worker registrado");
      })
      .catch(err => console.log("Service worker not registered", err));
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('firebase-messaging-sw.js')
  .then(function() {
      console.log("Service worker para notificaciones registrado");
      initializeFirebase();
  })
  .catch(function(err) {
      console.log('Registro de Service Worker para aplicaciones fallido:', err);
  });
}
