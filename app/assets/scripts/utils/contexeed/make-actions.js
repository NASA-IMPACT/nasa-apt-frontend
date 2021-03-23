/**
 * Creates invalidate, request and receive actions.
 *
 * @param {object} op Options
 * @param {string} op.name The action name to use as suffix
 * @param {bool} op.useKey Whether the actions need to handle a key.
 *
 * @returns Object {
 *  invalidate
 *  request
 *  receive
 * }
 */
export function makeActions({ name, useKey }) {
  // Creates a function that when executed returns an action.
  // If `useKey` is set the function will accept an `id` as the first parameter
  // and it will be appended to the returned action object.
  const withId = (fn) => {
    return (...args) => {
      if (useKey) {
        const [id, ...remaining] = args;
        return {
          ...fn(...remaining),
          id
        };
      } else {
        return fn(...args);
      }
    };
  };

  const invalidate = withId(() => ({ type: `invalidate/${name}` }));
  const request = withId(() => ({ type: `request/${name}` }));
  const receive = withId((data, error = null) => ({
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
