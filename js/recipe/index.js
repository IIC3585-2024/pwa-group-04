import { RecipeRepository } from "./recipe_repository.js";
import { RecipeFactory } from "./recipe_factory.js";

const recipeRepository = new RecipeRepository();

// Html elements
const recipeName = document.getElementById("recipe_name");
const recipeDescription = document.getElementById("recipe_description");
const recipeId = document.getElementById("recipe_id");

const output = document.getElementById("output");

// CRUD operations

// Create a recipe
const createRecipeButton = document.getElementById("create-recipe");

createRecipeButton.addEventListener("click", async () => {
  const recipe_name = recipeName.value;
  const recipe_description = recipeDescription.value;
  let recipe = RecipeFactory.createRecipe(recipe_name, recipe_description);
  recipe = await recipeRepository.createRecipe(recipe);
  output.textContent = JSON.stringify(recipe, null, 2);
});

// Update a recipe
const updateRecipeButton = document.getElementById("update-recipe");

updateRecipeButton.addEventListener("click", async () => {
  const id = parseInt(recipeId.value);
  const recipe = await recipeRepository.readRecipe(id);
  recipe.name = recipeName.value;
  recipe.description = recipeDescription.value;
  await recipeRepository.updateRecipe(recipe);
  output.textContent = JSON.stringify(recipe, null, 2);
});

// Read a recipe
const readRecipeButton = document.querySelector("#read-recipe");

readRecipeButton.addEventListener("click", async () => {
  const id = parseInt(recipeId.value);
  try {
    const recipe = await recipeRepository.readRecipe(id);
    output.textContent = JSON.stringify(recipe, null, 2);
  } catch {
    output.textContent = `Recipe with id ${id} not found.`;
  }
});

// List all recipes
const listRecipeButton = document.querySelector("#list-recipe");

listRecipeButton.addEventListener("click", async () => {
  const recipes = await recipeRepository.listRecipes();
  output.textContent = JSON.stringify(recipes, null, 2);
});

// Delete a recipe
const deleteRecipeButton = document.querySelector("#delete-recipe");

deleteRecipeButton.addEventListener("click", async () => {
  const id = parseInt(recipeId.value);
  try {
    await recipeRepository.deleteRecipe(id);
    output.textContent = `Recipe with id ${id} deleted.`;
  } catch {
    output.textContent = `Recipe with id ${id} could not be deleted.`;
  }
});
const deleteAllRecipeButton = document.querySelector("#delete-all-recipe");

deleteAllRecipeButton.addEventListener("click", async () => {
  await recipeRepository.deleteAllRecipes();
  console.log("Recipes deleted.");
});
