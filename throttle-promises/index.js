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
     * Once the concurrency limit is reached, this method will only be called recursively once an
     * running promise resolves.
     */
    const createPromise = () => {
        if (index < actions.length) {
            const currentIndex = index;
            const currentAction = actions[currentIndex];
            ++index;

            /*
             * This is where the magic happens. When a promisified action resolves, place the result of the action
             * at the `currentIndex` it was called. Then call `createPromise` again. This ensures the action's result
             * is at the correct index (matching its index in the `actions` array), while also ensuring a new promisified
             * actions isn't created until an active promise finishes and one of the 'threads' becomes available.
             */
            return Promise.resolve(currentAction()).then(result => results[currentIndex] = result).then(createPromise);
        }
    }

    // Initalize array to store the returned promises
    let promises = [];

    // Loop will call `createPromise` method until it reaches the concurrency limit
    while (index < limit) {
        let currentPromise = createPromise();
        promises.push(currentPromise);
    }

    // Return a promise once all of the promisified actions have resolved.
    return Promise.all(promises).then(() => results);
}
