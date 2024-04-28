import { recipeRepository } from "../app.js";
import { RecipeFactory } from "../recipe/recipe_factory.js";
import { IngredientFactory } from "../ingredient/ingredient_factory.js";
import { StepFactory } from "../steps/steps_factory.js";

// Recipes

const recipeNameInput = document.getElementById("recipe_name");
const recipeDescriptionInput = document.getElementById("recipe_description");
let recipeId;

// Lists all the recipes from recipeRepository
const listRecipes = async () => {
    const recipes = await recipeRepository.list();
    return recipes
};

// Function to list recipes
async function listRecipesHandler() {
    const recipes = await listRecipes();
    console.log("recipes", recipes);
    const recipeListContainer = $("#list-recipe-container");
    // Clear the existing content
    recipeListContainer.empty();

    // Iterate over the recipes and create HTML elements for each recipe
    recipes.forEach(recipe => {
        const recipeItem = $("<div>", {
            class: "recipe-item",
            "data-recipe-id": recipe.id // Set a data attribute with the recipe ID
        }).text(recipe.name); // Example: Display the recipe name as text

        // Append the recipe item to the container
        recipeListContainer.append(recipeItem);
    });
}

// Function to create a recipe
async function createRecipeHandler() {
    const recipe_name = recipeNameInput.value;
    const recipe_description = recipeDescriptionInput.value;
    let recipe = RecipeFactory.create(recipe_name, recipe_description);
    recipe = await recipeRepository.createRecipe(recipe);
    console.log(recipe);

    // After creating the recipe, list all recipes again
    await listRecipesHandler();

    recipeNameInput.value = "";
    recipeDescriptionInput.value = "";
}

// Function to handle click events on recipe items
async function recipeItemClickHandler(event) {
    // Check if the clicked element has the class "recipe-item"
    if ($(event.target).hasClass("recipe-item")) {
        // Retrieve the recipe ID from the data attribute
        recipeId = parseInt($(event.target).data("recipe-id"));
        
        try {
            const recipe = await recipeRepository.read(recipeId);
            console.log(recipe, "recipe");
            // Select the recipe title and description elements
            const recipeTitleElement = $("#recipe-title");
            const recipeDescriptionElement = $("#recipe-description");

            // Insert the title and description into the respective elements
            recipeTitleElement.text(recipe.name);
            recipeDescriptionElement.text(recipe.description);

        } catch {
            output.textContent = `Recipe with id ${recipeId} not found.`;
        }
    }
}


// Ingredients

const ingredientNameInput = document.getElementById("recipe-ingredient-input");
const ingredientQuantityInput = document.getElementById("quantity-ingredient-input");

// Function to add ingredient
async function addIngredientHandler() {
    const name = ingredientNameInput.value;
    const quantity = ingredientQuantityInput.value;
    let ingredient = IngredientFactory.create(name, quantity);
    const recipe = await recipeRepository.addIngredient(recipeId, ingredient);
    console.log(recipe)
    ingredientNameInput.value = "";
    ingredientQuantityInput.value = "";
}

// Steps
const stepIdInput = document.getElementById("id-step-input");
const stepDescriptionInput = document.getElementById("recipe-step-input");

async function addStepHandler() {
    const description = stepDescriptionInput.value;
    const stepId = parseInt(stepIdInput.value);
    let step = StepFactory.create(stepId, description);
    const recipe = await recipeRepository.addStep(recipeId, step);
    console.log(recipe)
    stepIdInput.value = "";
    stepDescriptionInput.value = "";
}

$(document).ready(function() {

    // List the recipes when the button is clicked
    $("#list-recipe").click(listRecipesHandler);

    // Create a recipe when the button is clicked
    $("#create-recipe").click(createRecipeHandler);

    // Create an add ingredient to selected recipe
    $("#ingredient-button").click(addIngredientHandler);

    // Create an add step to selected recipe
    $("#step-button").click(addStepHandler);

    $("#list-recipe-container").on("click", ".recipe-item", recipeItemClickHandler);
});