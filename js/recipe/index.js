import { RecipeRepository } from "./recipe_repository.js";
import { RecipeFactory } from "./recipe_factory.js";
import { IngredientFactory } from "../ingredient/ingredient_factory.js";
import { StepFactory } from "../steps/steps_factory.js";

const recipeRepository = new RecipeRepository();

// Html elements
const recipeNameInput = document.getElementById("recipe_name");
const recipeDescriptionInput = document.getElementById("recipe_description");
const recipeIdInput = document.getElementById("recipe_id");

const output = document.getElementById("output");

// CRUD operations

// Create a recipe
const createRecipeButton = document.getElementById("create-recipe");

createRecipeButton.addEventListener("click", async () => {
  const recipe_name = recipeNameInput.value;
  const recipe_description = recipeDescriptionInput.value;
  let recipe = RecipeFactory.createRecipe(recipe_name, recipe_description);
  recipe = await recipeRepository.createRecipe(recipe);
  output.textContent = JSON.stringify(recipe, null, 2);
});

// Update a recipe
const updateRecipeButton = document.getElementById("update-recipe");

updateRecipeButton.addEventListener("click", async () => {
  const id = parseInt(recipeIdInput.value);
  const recipe = await recipeRepository.readRecipe(id);
  recipe.name = recipeNameInput.value;
  recipe.description = recipeDescriptionInput.value;
  await recipeRepository.updateRecipe(recipe);
  output.textContent = JSON.stringify(recipe, null, 2);
});

// Read a recipe
const readRecipeButton = document.querySelector("#read-recipe");

readRecipeButton.addEventListener("click", async () => {
  const id = parseInt(recipeIdInput.value);
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
  const id = parseInt(recipeIdInput.value);
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

// Ingredients

const ingredientNameInput = document.querySelector("#ingredient_name");
const ingredientQuantityInput = document.querySelector("#ingredient_quantity");

// Add ingredient
const addIngredientButton = document.querySelector("#add-ingredient");

addIngredientButton.addEventListener("click", async () => {
  const recipeId = parseInt(recipeIdInput.value);
  const name = ingredientNameInput.value;
  const quantity = parseInt(ingredientQuantityInput.value);
  let ingredient = IngredientFactory.create(name, quantity);
  const recipe = await recipeRepository.addIngredient(recipeId, ingredient);
  output.textContent = JSON.stringify(recipe, null, 2);
});

// Remove ingredient
const removeIngredientButton = document.querySelector("#remove-ingredient");

removeIngredientButton.addEventListener("click", async () => {
  const recipeId = parseInt(recipeIdInput.value);
  const name = ingredientNameInput.value;
  const recipe = await recipeRepository.removeIngredient(recipeId, name);
  output.textContent = JSON.stringify(recipe, null, 2);
});

// Steps

const stepIdInput = document.querySelector("#step_id");
const stepDescriptionInput = document.querySelector("#step_description");

// Add step
const addStepButton = document.querySelector("#add-step");

addStepButton.addEventListener("click", async () => {
  const recipeId = parseInt(recipeIdInput.value);
  const stepId = parseInt(stepIdInput.value)
  const description = stepDescriptionInput.value;
  let step = StepFactory.create(stepId, description);
  const recipe = await recipeRepository.addStep(recipeId, step);
  output.textContent = JSON.stringify(recipe, null, 2);
});

// Remove step
const removeStepButton = document.querySelector("#remove-step");

removeStepButton.addEventListener("click", async () => {
  const recipeId = parseInt(recipeIdInput.value);

  const stepId = stepIdInput.value;
  const recipe = await recipeRepository.removeStep(recipeId, stepId);
  output.textContent = JSON.stringify(recipe, null, 2);
});

