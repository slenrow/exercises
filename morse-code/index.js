/*
 * @param options - An object with a toggler function, a timeout mechanism function, a string message, and a map of chars to dot-dashes.
 & @param cb - A callback to be called on completion
 */

module.exports = function transmitter(options, cb) {
	const { codes, message, toggle, timeouter } = options
	const messageLength = message.length;
	const chars = message.split(''); // Splits the message into an array of chars.
	const timeoutArray = [];

	/*
	 * Loop through the list of chars. This is the engine that will convert each character to it's respective code (if not a space)
	 * Each code corresponds to a timeout length that will be stored in the `timeoutArray` when iterating through the `chars` list.
	 */

    chars.forEach((char, charIndex) => {
    	// If the char is a space, timeout for 7 measures
        if (char === ' ') {
            timeoutArray.push(7);
        } else {
            const symbolsArray = codes[char].split(''); // Split the code version of the char into an array of symbols.

            // Loop through the symbols array and push a timeout corresponding to the proper symbol onto the `symbolsArray`
            symbolsArray.forEach((symbol, symbolIndex) => {
            	// If a dot, timeout for 1 measure
            	if (symbol === '.') {
            		timeoutArray.push(1);
            	// If a dash, timout for 3 measures
            	} else if (symbol === '-') {
            		timeoutArray.push(3);
            	}

            	// If the current symbol is not the last, timeout for 1 measure (timeout between symbols is 1)
                if (symbolIndex !== symbolsArray.length - 1) {
                    timeoutArray.push(1);
                // If the end of a letter, timout for 3 measures
                } else if (charIndex !== messageLength - 1 && message[charIndex + 1] !== ' ') {
                    timeoutArray.push(3);
                }
            });
        }
    });

    createTimeouts(timeoutArray, timeouter, toggle, cb);
};

function createTimeouts(timeouts, timeouter, toggle, cb) {
    toggle(); // Before every timeout, toggle the 'lightbulb' into the next state for the given timeout.

    if (timeouts.length > 0) {
    	// Assign the first timeout to the timeout and remove it from the timeouts array. This ensures every timeout is used
    	// only once.
		const timeout = timeouts.shift();
	    timeouter(() => createTimeouts(timeouts, timeouter, toggle, cb), timeout);
    } else {
    	// Call the done callback if the `timeouts` array is depleted
    	cb();
    }
}