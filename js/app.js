import { RecipeRepository } from "./recipe/recipe_repository.js";

export const recipeRepository = new RecipeRepository();

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Loaded DOM")
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register(`serviceWorker.js`)
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}
