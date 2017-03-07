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

}
