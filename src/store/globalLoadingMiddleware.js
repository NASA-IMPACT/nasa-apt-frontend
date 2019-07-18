import types from '../constants/action_types';
import * as actions from '../actions/actions';

const globalLoadingMiddleware = store => next => async (action) => {
  const { type } = action;

  // Get all the actions of the async type by checking if they end in _SUCCESS
  // filter.map = reduce
  const asyncActions = Object.keys(types).reduce((acc, k) => {
    if (!k.endsWith('_SUCCESS')) return acc;
    return [...acc, k.match(/(.*)_SUCCESS$/)[1]];
  }, []);

  asyncActions.forEach((act) => {
    if (type === act) {
      store.dispatch(actions.showLoading(act));
    }
    if (type === `${act}_SUCCESS` || type === `${act}_FAIL`) {
      store.dispatch(actions.hideLoading(act));
    }
  });

  return next(action);
};

export default globalLoadingMiddleware;
