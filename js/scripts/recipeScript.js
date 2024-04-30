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

    $("#list-recipe-container").addClass('open');
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

function showSteps(recipe) {
    const stepsContainer = $("#steps-container");

    stepsContainer.empty();

    // Iterate over the recipes and create HTML elements for each recipe
    recipe['steps'].forEach(step => {
        const stepItem = $("<div>", {
            class: "step-item"
        }).text(step.id + ' ' + step.description); // Example: Display the recipe name as text

        // Append the recipe item to the container
        stepsContainer.append(stepItem);
    });

};

function showIngredients(recipe) {
    const ingredientsElement = $("#ingredients-container");

    ingredientsElement.empty();

    // Iterate over the recipes and create HTML elements for each recipe
    recipe['ingredients'].forEach(ingredient => {
        const ingredientItem = $("<div>", {
            class: "ingredient-item"
        }).text(ingredient.quantity + ' ' + ingredient.name); // Example: Display the recipe name as text

        // Append the recipe item to the container
        ingredientsElement.append(ingredientItem);
    });

};

// Function to handle click events on recipe items
async function recipeItemClickHandler(event) {
    // Check if the clicked element has the class "recipe-item"
    if ($(event.target).hasClass("recipe-item")) {
        // Retrieve the recipe ID from the data attribute
        recipeId = parseInt($(event.target).data("recipe-id"));
        
        try {
            $("#list-recipe-container .selected").removeClass('selected');

            $(this).addClass('selected')
            const recipe = await recipeRepository.read(recipeId);
            console.log(recipe, "recipe");
            
            // Select the recipe title and description elements
            const recipeTitleElement = $("#recipe-title");
            const recipeDescriptionElement = $("#recipe-description");

            showIngredients(recipe);
            showSteps(recipe);

            // Insert the title and description into the respective elements
            recipeTitleElement.text(recipe.name);
            recipeDescriptionElement.text(recipe.description);

            $("#recipe-container").addClass('open');
            $("#add-ingredient").removeClass("open");
            $("#add-step").removeClass("open");

            $("#recipe-container").show()

        } catch {
            recipeTitleElement.textContent = `Recipe with id ${recipeId} not found.`;
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

    showIngredients(recipe);
    openAddIngredient();
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

    showSteps(recipe);
    openAddStep();
}

function openAddIngredient() {
    $("#add-ingredient").toggleClass("open");
}


function openAddStep() {
    $("#add-step").toggleClass("open");
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

    // Open add ingredient
    $("#add-ingredient-button").click(openAddIngredient);

    // Open add step
    $("#add-step-button").click(openAddStep);
    
    $("#list-recipe-container").on("click", ".recipe-item", recipeItemClickHandler);
    
});