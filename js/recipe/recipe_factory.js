import { faker } from 'https://esm.sh/@faker-js/faker';

/**
 * @typedef {import ('./recipe.js').Recipe} Recipe
 */


/**
 * Represents a RecipeFactory.
 */
class RecipeFactory {

    /**
     * Creates a new recipe with the given name and description.
     * @param {string} name - The name of the recipe.
     * @param {string} description - The description of the recipe.
     * @returns {Recipe} The created recipe object.
     */
    static createRecipe(name, description) {
        return {
            name,
            description,
            ingredients: [],
            steps: [],
        };
    }

    /**
     * Creates a random recipe with a generated name and description.
     * @returns {Recipe} The created random recipe object.
     */
    static createRandomRecipe() {
        const name = faker.lorem.sentence();
        const description = faker.lorem.paragraph();
        const recipe = this.createRecipe(name, description);
        return recipe;
    }
}

export { RecipeFactory };