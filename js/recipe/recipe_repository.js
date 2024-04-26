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
     * @returns {Promise<Recipe>} - The promise object representing the result of the operation.
     */
    async readRecipe(id) {
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
     * @returns {Promise<Recipe>} - The promise object representing the result of the operation.
     */
    async updateRecipe(recipe) {
        const transaction = this.db.transaction(['recipes'], 'readwrite');
        const objectStore = transaction.objectStore('recipes');
        const query = objectStore.put(recipe);

        return new Promise((resolve, reject) => {
            query.addEventListener('success', () => resolve(query.result));
            query.addEventListener('error', () => reject(query.error));
        });
    }

    async deleteRecipe(id) {
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
     * @returns {Promise<Recipe>} - The promise object representing the result of the operation.
     */
    async listRecipes() {
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
     * @returns {Promise} - The promise object representing the result of the operation.
     */
    async deleteAllRecipes() {
        const transaction = this.db.transaction(['recipes'], 'readwrite');
        const objectStore = transaction.objectStore('recipes');
        objectStore.clear();
    }

}

export { RecipeRepository };