import { axiosAPI } from '../axios';
import { getStateSlice, isFn } from './utils';

/**
 * Enhances the function defined by the user, returning a thunk to be used by
 * the reducer's dispatch.
 * @param {object} params Parameters
 * @param {string} params.type The type of api action being created (requests | mutations)
 * @param {function} params.fn The function to enhance
 * @param {string} params.fnName Then name of the function
 * @param {object} params.config The contexteed config
 * @param {object} params.actions The begin, end, and invalidate actions.
 *
 * @returns function - Thunk action to use with dispatch.
 */
export const makeApiAction = (params) => (...args) => {
  const { type, fn, fnName, config, actions } = params;

  const { name, slicedState } = config;
  const { begin, end, invalidate } = actions;

  const isMutation = type === 'mutations';

  const {
    sliceKey,
    url,
    requestOptions,
    skipStateCheck,
    overrideRequest,
    transformData,
    transformError,
    onDone
  } = fn(...args);

  // If the config defines this contexeed as `slicedState`, the `sliceKey`
  // becomes required.
  if (slicedState && !sliceKey) {
    throw new Error(
      `The contexeed \`${name}\` is setup as a sliced state (slicedState), but \`${type}.${fnName}\` is not returning a sliceKey.`
    );
  }

  // Return a thunk.
  return async function (dispatch, state) {
    const { isSliced, stateSlice } = getStateSlice(state, sliceKey);

    // Default data transformer fn is passthrough.
    const _transformData = isFn(transformData)
      ? transformData
      : (response) => response;

    // Default error transformer fn is passthrough.
    const _transformError = isFn(transformError)
      ? transformError
      : (error) => error;

    // Allow api request to be overridden.
    const _requestData = isFn(overrideRequest)
      ? async () =>
          overrideRequest({
            axios: axiosAPI,
            requestOptions,
            state: stateSlice,
            rawState: state
          })
      : async () => {
          const response = await axiosAPI({
            url,
            ...requestOptions
          });
          // By default we return the body.
          return response.data;
        };

    // Check if the cache is enabled but only if we're not working with a
    // mutation.
    if (!isMutation && isSliced && !skipStateCheck) {
      if (
        stateSlice &&
        stateSlice.status === 'succeeded' &&
        !stateSlice.error
      ) {
        return dispatch(
          end({
            key: sliceKey,
            data: stateSlice.data,
            error: null
          })
        );
      }
    }

    // Start request.
    dispatch(
      begin({
        key: sliceKey,
        isMutation
      })
    );

    const helpersBag = {
      state: stateSlice,
      rawState: state,
      dispatch,
      invalidate: (key) => {
        if (slicedState && !key) {
          throw new Error(
            `The contexeed \`${name}\` is setup as a sliced state (slicedState), but you're using invalidate action without a key value.`
          );
        }
        return dispatch(invalidate(key));
      }
    };

    // Function to call when the request was done.
    // Called either on success or failure.
    const callback = async (error, data) => {
      const finish = (replacementError, replacementData) =>
        dispatch(
          end({
            key: sliceKey,
            isMutation,
            data:
              typeof replacementData !== 'undefined'
                ? replacementData
                : data || null,
            error:
              typeof replacementError !== 'undefined'
                ? replacementError
                : error || null
          })
        );

      if (isFn(onDone)) {
        return onDone(finish, {
          data: data || null,
          error: error || null,
          ...helpersBag
        });
      } else {
        return finish();
      }
    };

    try {
      const response = await _requestData();
      const content = await _transformData(response, helpersBag);
      return callback(null, content);
    } catch (error) {
      // eslint-disable-next-line
      console.log('error', error.config?.url, error.message);
      const content = _transformError(error, helpersBag);
      return callback(content);
    }
  };
};
