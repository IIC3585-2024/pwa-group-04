/**
 * @typedef {import ('./recipe.js').Recipe} Recipe
 */

/**
 * Represents a repository for managing recipes.
 */
class RecipeRepository {
    /**
     * Creates an instance of RecipeRepository.
     */
    constructor() {
        /**
         * The indexedDB instance.
         * @type {IDBDatabase}
         * @private
         */
        this.db;
        this._init_db();
    }

    _init_db() {
        this._dbRequest = indexedDB.open('recipe_note', 1);
        this._dbRequest.addEventListener('error', () => console.error('Error opening DB'));

        this._dbRequest.addEventListener('success', () => {
            console.log('Successfully opened DB');
            this.db = this._dbRequest.result;
        });

        this._dbRequest.addEventListener('upgradeneeded', init => {
            const db = init.target.result;
            this.db = db;
            db.onerror = () => {
                console.error('Error loading database.');
            };
            this._createRecipeStore(db);
        });
    }

    /**
     * Creates the recipe store in the indexedDB.
     * @param {IDBDatabase} db - The indexedDB instance.
     * @private
     */
    _createRecipeStore(db) {
        db.createObjectStore('recipes', { keyPath: 'id', autoIncrement: true });
    }

    /**
     * Adds a recipe to the repository.
     * @param {Object} recipe - The recipe object to add.
     */
    async createRecipe(recipe) {
        const transaction = this.db.transaction(['recipes'], 'readwrite');
        const objectStore = transaction.objectStore('recipes');
        const request = objectStore.add(recipe);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                recipe.id = request.result;
                resolve(recipe)
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     *
     * @param {number} id
     * @returns {Promise<Recipe>}
     */
    async read(id) {
        const transaction = this.db.transaction(['recipes'], 'readonly');
        const objectStore = transaction.objectStore('recipes');
        const query = objectStore.get(id);

        return new Promise((resolve, reject) => {
            query.addEventListener('success', () => {
                if (query.result) {
                    resolve(query.result);
                } else {
                    reject(new Error(`Recipe with id ${id} not found.`));
                }
            });
            query.addEventListener('error', () => reject(query.error));
        });
    }

    /**
     *
     * @param {Recipe} recipe
     * @returns {Promise<Recipe>}
     */
    async update(recipe) {
        const transaction = this.db.transaction(['recipes'], 'readwrite');
        const objectStore = transaction.objectStore('recipes');
        const query = objectStore.put(recipe);

        return new Promise((resolve, reject) => {
            query.addEventListener('success', () => resolve(query.result));
            query.addEventListener('error', () => reject(query.error));
        });
    }

    async delete(id) {
        const transaction = this.db.transaction(['recipes'], 'readwrite');
        const objectStore = transaction.objectStore('recipes');
        const query = objectStore.delete(id);

        return new Promise((resolve, reject) => {
            query.addEventListener('success', () => {
                resolve(query.result)
            });
            query.addEventListener('error', (event) => {
                reject(query.error);
            });
        });
    }

    /**
     *
     * @returns {Promise<Recipe>}
     */
    async list() {
        const transaction = this.db.transaction(['recipes'], 'readonly');
        const objectStore = transaction.objectStore('recipes');
        const query = objectStore.getAll();

        return new Promise((resolve, reject) => {
            query.addEventListener('success', () => resolve(query.result));
            query.addEventListener('error', () => reject(query.error));
        });
    }

    /**
     * Deletes all recipes from the repository.
     * @returns {Promise}
     */
    async deleteAll() {
        const transaction = this.db.transaction(['recipes'], 'readwrite');
        const objectStore = transaction.objectStore('recipes');
        objectStore.clear();
    }

    /**
     *
     * @param {number} recipeId
     * @param {Ingredient} ingredient
     * @returns {Promise<Recipe>}
     */
    async addIngredient(recipeId, ingredient) {
        const recipe = await this.read(recipeId);
        recipe.ingredients.push(ingredient);
        await this.update(recipe);
        return recipe;
    }

    /**
     * @returns {Promise<Recipe>}
     */
    async removeIngredient(recipeId, ingredientName) {
        const recipe = await this.read(recipeId);
        const ingredientIndex = recipe.ingredients.findIndex(ingredient => ingredient.name === ingredientName);
        recipe.ingredients.splice(ingredientIndex, 1);
        await this.update(recipe);
        return recipe;
    }

    /**
     * @returns {Promise<Recipe>}
     */
    async addStep(recipeId, step) {
        const recipe = await this.read(recipeId);
        recipe.steps.push(step);
        await this.update(recipe);
        return recipe;
    }

    /**
     * @returns {Promise<Recipe>}
     */

    async removeStep(recipeId, stepId) {
        const recipe = await this.read(recipeId);
        const stepIndex = recipe.steps.findIndex(step => step.id === stepId);
        recipe.steps.splice(stepIndex, 1);
        await this.update(recipe);
        return recipe;
    }

}

export { RecipeRepository };