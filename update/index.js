/**
 * The update function takes an immutable state object and an options object with an update action.
 * The function will then return a new version of the state object with all the proper updates performed.
 * Using this method allows for users to avoid mutating state and thus abiding by the laws of immutability.
 *
 * @param state - An immutable object
 * @param options - An object with directions to update state. Directions can be any of the following:
 *   {$push: array} push() all the items in array on the target.
 *   {$unshift: array} unshift() all the items in array on the target.
 *   {$splice: array of arrays} for each item in arrays call splice() on the target with the parameters provided by the item.
 *   {$set: any} replace the target entirely.
 *   {$merge: object} merge the keys of object with the target.
 *   {$apply: function} passes in the current value to the function and updates it with the new returned value.
 */

module.exports = function update(state, options) {
    /*
     * Assign the keys of the options parameter to a `commands` object. This will be used
     * to determine the process the function will execute in the swtich statement OR (in the event it's object props)
     * it will be used to determing a recursion event.
     */
    const commands = Object.keys(options);

    // Create enum for easier, cleaner access.
    const commandsEnum = {
        $push: '$push',
        $unshift: '$unshift',
        $splice: '$splice',
        $set: '$set',
        $merge: '$merge',
        $apply: '$apply',
    };

    // Make a copy of state and assign it to `nextState`. This is the first step toward immutability.
    const nextState = getCopy(state);

    /*
     * This switch statement will execute the proper command. Using a switch as it's much cleaner than
     * a long conditional block.
     */
    switch (commands[0]) {
        case commandsEnum.$set:
            /*
             * This return should assign the value of `$set` in the options object to the `nextState`.
             * Since the function is being called recursively, this return assigns the value of `nextState[key]`
             * to this new value.
             */
            return options[commandsEnum.$set];
        case commandsEnum.$push:
            // Pushes each item onto `nextState`
            options[commandsEnum.$push].forEach(el => nextState.push(el));
            break;
        case commandsEnum.$unshift:
            // Unshift each item onto `nextState`
            options[commandsEnum.$unshift].forEach(el => nextState.unshift(el));
            break;
        case commandsEnum.$splice:
            // Splice items into `nextState`
            options[commandsEnum.$splice].forEach(el => nextState.splice.apply(nextState, el));
            break;
        case commandsEnum.$merge:
            // Merge keys into `nextState`
            return {
                ...nextState,
                ...options[commandsEnum.$merge],
            };
        case commandsEnum.$apply:
            // Apply a function to the current value
            return options[commandsEnum.$apply](nextState);
        default:
            break;
    }

    /*
     * This is the engine. Check the keys of `options`. If the key doesn't exist as a command in the `commandsEnum`,
     * this means the command is more deeply nested. Thus, `update` must dive a level deeper into the object by calling
     * itself with `state` and `options` by accessing the value of the current key in each object
     * and assigning the return value to `nextState`.
     */
    commands.forEach(key => {
        if (!commandsEnum.hasOwnProperty(key)) {
            nextState[key] = update(state[key], options[key]);
        }
    });

    return nextState;
}

function getCopy(data) {
    /*
     * If the data passed in is an array, clone the array with slice to avoid mutation, otherwise return a cloned object
     * using the spread operator which copies the enumerable properties of the `state` object into the `nextState` object.
     * As we recursively iterate down the `state` object, this approach will ultimately create a deep copy of all
     * unchanged aspects of the object. If neither, return the data as is.
     */
    if (Array.isArray(data)) return data.slice();
    if (typeof data === 'object') return { ...data };
    return data;
}
