import types from '../constants/action_types';
import * as actions from '../actions/actions';

const globalLoadingMiddleware = store => next => async (action) => {
  const { type } = action;

  const excludedActions = [
    'UPLOAD_JSON',
    'SERIALIZE_DOCUMENT',
    'SERIALIZE_PDF',
    'SERIALIZE_HTML',
    'CHECK_PDF',
    'CHECK_HTML',
    'ATBD_ALIAS_COUNT'
  ];

  // Get all the actions of the async type by checking if they end in _SUCCESS
  // .filter().map() = reduce()
  const asyncActions = Object.keys(types).reduce((acc, k) => {
    if (!k.endsWith('_SUCCESS')) return acc;
    const name = k.match(/(.*)_SUCCESS$/)[1];
    if (excludedActions.includes(name)) return acc;
    return [...acc, name];
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
