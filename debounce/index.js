/*
 * The debounce function ensures that a given callback is only invoked once during a given time limit.
 * Any consecutive calls within the delay will not trigger the callback.
 *
 * @param cb - The function to be debounced
 * @param delay - The length of time (in milliseconds) to wait from the most recent call before executing cb
 */

module.exports = function debounce(cb, delay) {
    // Keep a scoped reference to a timeout variable
    let timeout;

    // Return a function that will maintain a scoped reference to a function without calling it.
    return () => {
        /*
         * Create a function that will reset a preexisting timeout id assigned to `timeout` and call the passed callback.
         * This is the function that will be called if and only if the delay time is reached before debounce is called
         * again.
         */
        const resetAndCall = () => {
            timeout = null;
            // Call the cb with `arguments` passed in via currying
            cb(arguments);
        };

        // Clear the stored timeout id assigned to `timeout`
        clearTimeout(timeout);

        // Reset `timeout` to a new timeout that will execute resetAndCall after delay
        timeout = setTimeout(resetAndCall, delay);
    };
}
