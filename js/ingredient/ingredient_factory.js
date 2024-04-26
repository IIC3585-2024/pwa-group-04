import { faker } from 'https://esm.sh/@faker-js/faker';

/**
 * Factory to create ingredients
 */
class IngredientFactory {

    /**
     * Creates a new ingredient
     * @param {string} name
     * @param {string} quantity
     * @returns {Ingredient}
     */
    static create(name, quantity) {
        return {
            name,
            quantity,
        };
    }

    /**
     * Creates a random ingredient
     * @returns {Ingredient}
     */
    static createRandom() {
        const name = faker.lorem.words();
        const quantity = faker.random.number();
        const ingredient = this.create(name, quantity);
        return ingredient;
    }
}

export { IngredientFactory };
