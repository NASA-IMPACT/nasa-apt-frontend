import qs from 'qs';
import { LOCATION_CHANGE, push } from 'connected-react-router';

import * as actions from '../actions/actions';
import {
  atbds,
} from '../constants/routes';
import toasts from '../components/common/toasts';

const authMiddleware = store => next => async (action) => {
  const { type, payload } = action;
  if (type === LOCATION_CHANGE) {
    const { location: { pathname, search } } = payload;

    if (pathname === '/authorize') {
      const { token, error } = qs.parse(search.substring(1));

      if (error || !token) {
        /* eslint-disable-next-line no-console */
        console.log('Error logging in', error || 'Missing token');
        toasts.error('An error occurred trying to login');
      } else {
        store.dispatch(actions.storeUserToken(token));
        localStorage.setItem('token', token);
      }

      store.dispatch(push(`/${atbds}`));
    }
  }
  return next(action);
};

export default authMiddleware;
