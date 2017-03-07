/**
 * Throttle promises implements a concurrency model limiting the execution of active parallel functions as promises
 * to a given limit.
 *
 * @param limit - The concurrency limit
 * @param actions - The array of actions whose execution will be limited by `limit`
 */
module.exports = function throttlePromises(limit, actions) {
    let index = 0; // Keep track of current index of actions being promisified

    // Initialize array to store the results of the actions.
    let results = [];

    /*
     * If there are still actions to be executed, increment `index` and promisify the action.
     * This method will only be called iteratively by the outer scope a maximum of `limit` times.
     */
    const createPromise = () => {

    }

    // Initalize array to store the returned promises
    let promises = [];

    // Loop will call `createPromise` method until it reaches the concurrency limit
    while (index < limit) {
        let currentPromise = createPromise();
        promises.push(currentPromise);
    }
}
