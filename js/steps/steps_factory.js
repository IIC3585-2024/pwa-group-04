import { faker } from 'https://esm.sh/@faker-js/faker';

/**
 * Factory to create steps
 */
class StepFactory {

    /**
     * Creates a new step
     * @param {number} id
     * @param {string} description
     * @returns {Step}
     */
    static create(id, description) {
        return {
            id,
            description,
        };
    }

    /**
     * Creates a random step
     * @returns {Step}
     */
    static createRandom() {
        const id = faker.lorem.words();
        const description = faker.random.number();
        const step = this.create(id, description);
        return step;
    }
}

export { StepFactory };
