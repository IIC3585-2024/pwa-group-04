import { recipeRepository } from "../app.js";
import { RecipeFactory } from "../recipe/recipe_factory.js";
import { IngredientFactory } from "../ingredient/ingredient_factory.js";
import { StepFactory } from "../steps/steps_factory.js";

// Recipes

const recipeNameInput = $("#recipe_name");
const recipeDescriptionInput = $("#recipe_description");
let recipeId;

// Lists all the recipes from recipeRepository
const listRecipes = async () => {
    const recipes = await recipeRepository.list();
    return recipes
};

// Delete all recipes

async function deleteAllRecipes() {
    await recipeRepository.deleteAll();
    await listRecipesHandler()

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
    const recipe_name = recipeNameInput.val();
    const recipe_description = recipeDescriptionInput.val();
    let recipe = RecipeFactory.create(recipe_name, recipe_description);
    recipe = await recipeRepository.createRecipe(recipe);
    console.log(recipe);

    // After creating the recipe, list all recipes again
    await listRecipesHandler();

    recipeNameInput.val("");
    recipeDescriptionInput.val("");
}

async function removeStepHandler(step) {
    try {
        await recipeRepository.removeStep(recipeId, step.id);
        showRecipe()
        
    } catch (error) {
        console.error("Error deleting step:", error);
    }
}

function showSteps(recipe) {
    const stepsContainer = $("#steps-container");

    stepsContainer.empty();

    // Iterate over the recipes and create HTML elements for each recipe
    recipe['steps'].forEach(step => {
        const stepItem = $("<div>", {
            class: "step-item item flex-x justify-start"
        });

        const idParagraph = $("<h3>", {
            class: "inline input"
        }).text(step.id);

        const descriptionParagraph = $("<p>", {
            class: "step-paragraph-item input"
        });

        const deleteButton = $("<button>", {
            class: "circle-button icon-button delete-button"
        }).click(() => removeStepHandler(step));

        const deleteIcon = $("<i>", {
            class: "material-icons"
        }).text("close")

        deleteButton.append(deleteIcon)
    
        descriptionParagraph[0].appendChild(document.createTextNode(step.description));

        stepItem.append(idParagraph, descriptionParagraph, deleteButton);

        stepsContainer.append(stepItem);
    });

};

async function removeIngredientHandler(ingredient) {
    try {
        await recipeRepository.removeIngredient(recipeId, ingredient.id);
        showRecipe()

    } catch (error) {
        console.error("Error deleting ingredient:", error);
    }
}

function showIngredients(recipe) {
    const ingredientsElement = $("#ingredients-container");

    ingredientsElement.empty();

    // Iterate over the recipes and create HTML elements for each recipe
    recipe['ingredients'].forEach(ingredient => {
        const ingredientItem = $("<div>", {
            class: "ingredient-item item"
        });
        
        const nameParagraph = $("<p>", {
            class: "inline input"
        }).text(ingredient.name);

        const endDiv = $("<div>", {
            class: "flex-x"
        })

        const quantityParagraph = $("<p>", {
            class: "inline input"
        }).text(ingredient.quantity);

        const deleteButton = $("<button>", {
            class: "circle-button icon-button delete-button"
        }).click(() => removeIngredientHandler(ingredient));

        endDiv.append(quantityParagraph, deleteButton)

        const deleteIcon = $("<i>", {
            class: "material-icons"
        }).text("close")

        deleteButton.append(deleteIcon)
        
        ingredientItem.append(nameParagraph, endDiv);
        // Append the recipe item to the container
        ingredientsElement.append(ingredientItem);
    });

};

async function showRecipe() {
    try {
        const recipe = await recipeRepository.read(recipeId);
        
        // Select the recipe title and description elements
        const recipeTitleElement = $("#recipe-title");
        const recipeDescriptionElement = $("#recipe-description");

        showIngredients(recipe);
        showSteps(recipe);

        // Insert the title and description into the respective elements
        recipeTitleElement.val(recipe.name);
        recipeDescriptionElement.val(recipe.description);

        $("#recipe-container").addClass('open');
        $("#add-ingredient").removeClass("open");
        $("#add-step").removeClass("open");

        $("#recipe-container").show()
        $(".delete-button").hide();

    } catch {
        recipeTitleElement.textContent = `Recipe with id ${recipeId} not found.`;
    }
}

// Function to handle click events on recipe items
async function recipeItemClickHandler(event) {
    // Check if the clicked element has the class "recipe-item"
    if ($(event.target).hasClass("recipe-item")) {
        // Retrieve the recipe ID from the data attribute
        recipeId = parseInt($(event.target).data("recipe-id"));
        
        $("#list-recipe-container .selected").removeClass('selected');

        $(this).addClass('selected')

        showRecipe()
    }
}


// Ingredients

const ingredientNameInput = $("#recipe-ingredient-input");
const ingredientQuantityInput = $("#quantity-ingredient-input");

// Function to add ingredient
async function addIngredientHandler() {
    const name = ingredientNameInput.val();
    const quantity = ingredientQuantityInput.val();
    let ingredient = IngredientFactory.create(name, quantity);
    const recipe = await recipeRepository.addIngredient(recipeId, ingredient);
    ingredientNameInput.val("")
    ingredientQuantityInput.val("");

    showIngredients(recipe);
    openAddIngredient();
    $(".delete-button").hide();
}

// Steps
const stepIdInput = $("#id-step-input");
const stepDescriptionInput = $("#recipe-step-input");

async function addStepHandler() {
    const description = stepDescriptionInput.val();
    const stepId = parseInt(stepIdInput.val());
    let step = StepFactory.create(stepId, description);
    const recipe = await recipeRepository.addStep(recipeId, step);
    stepIdInput.val("");
    stepDescriptionInput.val("");

    showSteps(recipe);
    openAddStep();
    $(".delete-button").hide();
}

function openAddIngredient() {
    $("#add-ingredient").toggleClass("open");
}


function openAddStep() {
    $("#add-step").toggleClass("open");
}

function editRecipeHandler() {
    // Toggle the disabled attribute of the input fields
    $(".input").prop("disabled", function(i, val) {
        return !val;
    });

    // Toggle the display of save and edit buttons
    $("#edit-recipe-button, #save-recipe-button").toggle();

    $(".delete-button").toggle();
}

async function saveRecipeHandler() {
    const recipe = await recipeRepository.read(recipeId);

    recipe.name = $("#recipe-title").val();
    recipe.description = $("#recipe-description").val();

    await recipeRepository.update(recipe);

    // Toggle the disabled attribute of the input fields
    $(".input").prop("disabled", function(i, val) {
        return !val;
    });

    // Toggle the display of save and edit buttons
    $("#edit-recipe-button, #save-recipe-button").toggle();

    $(".delete-button").toggle();

    listRecipesHandler();
}

$(document).ready(function() {

    $("#save-recipe-button").hide();
    
    //Delete all recipes
    $("#delete-all-recipe").click(deleteAllRecipes);

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

    // Edit recipe
    $("#edit-recipe-button").click(editRecipeHandler);

    // Edit recipe
    $("#save-recipe-button").click(saveRecipeHandler);
    
});