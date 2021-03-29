import { axiosAPI } from '../axios';
import { getStateSlice } from './utils';

/**
 * Creates a thunk to perform a query to the given url dispatching the
 * appropriate actions.
 *
 * @param {object} opts Options.
 * @param {string} opts.url Url to query.
 * @param {string} opts.options Options for the request. See `axios`
 * documentation.
 * @param {func} opts.requestFn Request action to dispatch.
 * @param {func} opts.receiveFn Receive action to dispatch.
 * @param {func} opts.transformResponse Callback to change the response before
 * sending it to the receive function. Called with (response). Defaults to
 * returning the body content.
 * @param {func} opts.stateKey Path in the state to check for the data. Any
 * format accepted by lodash.get. Controls whether or not the response should be
 * cached. When defined the function will resolve immediately with dispatching
 * the receive action. The request action is not dispatched if there's cached
 * data.
 * @param {func} opts.__overrideData By default we make a request to the api
 * with the given options and then run the response through the
 * transformResponse. Sometimes, however, it may be needed to have complete
 * control over how the request is made. The __overrideData escape hatch allows
 * us to produce the data anyway we need. The returned data will be sent to the
 * receiveFn. Throwing an error causes the request to fail.
 * @param {bool} opts.skipStateCheck Whether or not to check the state via the
 * stateKey. Sometimes is it useful to have a state key, but do not check it,
 * like for example a POST or DELETE request
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
    skipStateCheck,
    transformResponse,
    __overrideData
  } = opts;

  const axiosRequest = {
    url,
    ...options
  };

  // Default mutator fn is to return the body.
  const _transformResponse =
    typeof transformResponse === 'function'
      ? transformResponse
      : async (response) => response.data;

  return async function (dispatch, state) {
    const { isSliced, stateSlice } = getStateSlice(state, stateKey);

    // By default we make a request to the api with the given options and then run
    // the response through the transformResponse. Sometimes, however, it may be needed to
    // have complete control over how the request is made. The __overrideData
    // escape hatch allows us to produce the data anyway we need. The returned
    // data will be sent to the receiveFn. Throwing an error causes the request to
    // fail.
    const requestData =
      typeof __overrideData === 'function'
        ? async () =>
            __overrideData({
              axios: axiosAPI,
              requestOptions: axiosRequest,
              state: stateSlice
            })
        : async () => {
            const response = await axiosAPI(axiosRequest);
            return _transformResponse(response, stateSlice);
          };

    // Check if the cache is enabled.
    if (isSliced && !skipStateCheck) {
      if (
        stateSlice &&
        stateSlice.status === 'succeeded' &&
        !stateSlice.error
      ) {
        if (__devDelay) await delay(__devDelay);
        return dispatch(receiveFn(stateSlice.data));
      }
    }

    dispatch(requestFn());
    try {
      const content = await requestData();
      if (__devDelay) await delay(__devDelay);
      return dispatch(receiveFn(content));
    } catch (error) {
      if (__devDelay) await delay(__devDelay);
      console.log('error', error.config?.url, error.message); // eslint-disable-line
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
