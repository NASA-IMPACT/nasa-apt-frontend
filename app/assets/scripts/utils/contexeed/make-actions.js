/**
 * Creates invalidate, request and receive actions.
 *
 * @param {object} op Options
 * @param {string} op.name The action name to use as suffix
 * @param {bool} op.useKey Whether the actions need to handle a key. If true,
 * the first parameter passed to the actions will be considered the key.
 *
 * @returns Object {
 *  invalidate
 *  request
 *  receive
 * }
 */
export function makeActions({ name, useKey }) {
  // Creates a function that when executed returns an action.
  // If `useKey` is set the function will accept a `key` as the first parameter
  // and it will be appended to the returned action object.
  const withKey = (fn) => {
    return (...args) => {
      if (useKey) {
        const [key, ...remaining] = args;
        return {
          ...fn(...remaining),
          key
        };
      } else {
        return fn(...args);
      }
    };
  };

  const invalidate = withKey(() => ({ type: `invalidate/${name}` }));
  const request = withKey(() => ({ type: `request/${name}` }));
  const receive = withKey((data, error = null) => ({
    type: `receive/${name}`,
    data,
    error,
    receivedAt: Date.now()
  }));

  return {
    invalidate,
    request,
    receive
  };
}
