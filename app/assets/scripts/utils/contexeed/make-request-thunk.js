import get from 'lodash.get';

import { axiosAPI } from '../axios';

/**
 * Creates a thunk to perform a query to the given url dispatching the
 * appropriate actions.
 *
 * @param {object} opts Options.
 * @param {string} opts.url Url to query.
 * @param {string} opts.options Options for the request. See `axios`
 *                 documentation.
 * @param {func} opts.requestFn Request action to dispatch.
 * @param {func} opts.receiveFn Receive action to dispatch.
 * @param {func} opts.mutator Callback to change the response before sending it
 *               to the receive function. Called with (response). Defaults to
 *               returning the body content.
 * @param {func} opts.stateKey Path in the state to check for the data. Any
 *                format accepted by lodash.get. Controls whether or not the
 *                response should be cached. When defined the function will
 *                resolve immediately with dispatching the receive action. The
 *                request action is not dispatched if there's cached data.
 *
 * @example
 * function fetchSearchResults () {
 *  return makeFetchThunk({
 *    url: `${config.api}/search`,
 *    requestFn: requestSearchResults,
 *    receiveFn: receiveSearchResults
 *  });
 * }
 *
 * @example with request options.
 * function fetchSearchResults (query) {
 *  return makeFetchThunk({
 *    url: `${config.api}/search`,
 *    options: {
 *      headers: {
 *        'Content-Type': 'application/json'
 *      },
 *      method: 'post',
 *      data: query
 *    },
 *    requestFn: requestSearchResults,
 *    receiveFn: receiveSearchResults
 *  });
 * }
 *
 * @example with caching
 * function fetchSearchResults () {
 *  return makeFetchThunk({
 *    url: `${config.api}/search`,
 *    stateKey: [] // Empty array will look at the root
 *    requestFn: requestSearchResults,
 *    receiveFn: receiveSearchResults
 *  });
 * }
 */
export function makeRequestThunk(opts) {
  const {
    url,
    options = {},
    requestFn,
    receiveFn,
    __devDelay,
    stateKey,
    mutator
  } = opts;

  const axiosRequest = {
    url,
    ...options
  };

  // Default mutator fn is to return the body.
  const _mutator = mutator || ((response) => response.data);

  return async function (dispatch, state) {
    // Check if the cache is enabled.
    if (stateKey || stateKey === '') {
      // Get the data from the state to see if it is valid.
      // Empty array or string will look at the root
      const pageState = stateKey.length ? get(state, stateKey) : state;
      if (pageState && pageState.status === 'succeeded' && !pageState.error) {
        if (__devDelay) await delay(__devDelay);
        return dispatch(receiveFn(pageState.data));
      }
    }

    dispatch(requestFn());
    try {
      const response = await axiosAPI(axiosRequest);
      const content = _mutator(response);
      if (__devDelay) await delay(__devDelay);
      return dispatch(receiveFn(content));
    } catch (error) {
      if (__devDelay) await delay(__devDelay);
      console.log('error', url, error.message); // eslint-disable-line
      return dispatch(receiveFn(null, error));
    }
  };
}

/**
 * Delays the execution in x milliseconds.
 *
 * @param {int} millis Milliseconds
 */
export function delay(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
