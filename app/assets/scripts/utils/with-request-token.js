import defaultsDeep from 'lodash.defaultsdeep';

/**
 * Simplifies the creation of request functions in a contexeed configuration
 * while handling a token.
 *
 * @param {string} token The token to use
 * @param {function} fn The request creator function. Called with the arguments
 * provided to the returned function.
 *
 * @example
 * {
 *  request: {
 *    fetchExample: withRequestToken(token, (id) => ({
 *      url: `/example/${id}`
 *    }))
 *  }
 * }
 */
export default function withRequestToken(token, fn) {
  return (...args) => {
    const tokenHeader = token
      ? {
          requestOptions: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        }
      : {};
    const userOpts = fn(...args);
    return defaultsDeep(tokenHeader, userOpts);
  };
}
