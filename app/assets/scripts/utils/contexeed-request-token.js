import defaultsDeep from 'lodash.defaultsdeep';

/**
 * Simplifies the creation of request function while handling a token. The
 * returned function must be called with a single argument which should be an
 * object. To include a token, use the `token` property.
 *
 * @param {contexeed} contexeed The contexeed instance
 * @param {function} fn The request creator function. Called with the arguments
 * provided to the returned function.
 *
 * @example
 * const fetchExample = makeContexeedRequestWithToken(contexeed, ({ id }) => ({
 *  url: `/example/${id}`
 * }));
 *
 * fetchExample({ token: 'some', id: 10 });
 */
export default function makeContexeedRequestWithToken(contexeed, fn) {
  return contexeed.makeRequestAction((arg) => {
    const { token } = arg;
    const tokenHeader = token
      ? {
          options: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        }
      : {};
    const userOpts = fn(arg);
    return defaultsDeep(tokenHeader, userOpts);
  });
}
