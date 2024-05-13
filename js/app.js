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
        console.log("Service worker registrado", res);
        initializeFirebase(res);
      })
      .catch(err => console.log("Service worker not registered", err));
  });
}
