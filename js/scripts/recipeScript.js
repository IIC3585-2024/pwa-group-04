import { recipeRepository } from "../app.js";

// Lists all the recipes from recipeRepository
const listRecipes = async () => {
    const recipes = await recipeRepository.list();
    return recipes
};

$(document).ready(function() {
    $("#list-recipe").click(async () => {
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
    });
});