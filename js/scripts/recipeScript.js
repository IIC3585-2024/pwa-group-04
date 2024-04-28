import { recipeRepository } from "../app.js";
import { RecipeFactory } from "../recipe/recipe_factory.js";

const recipeNameInput = document.getElementById("recipe_name");
const recipeDescriptionInput = document.getElementById("recipe_description");

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
        const recipeId = parseInt($(event.target).data("recipe-id"));
        
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

$(document).ready(function() {

    // List the recipes when the button is clicked
    $("#list-recipe").click(listRecipesHandler);

    // Create a recipe when the button is clicked
    $("#create-recipe").click(createRecipeHandler);

    $("#list-recipe-container").on("click", ".recipe-item", recipeItemClickHandler);
});