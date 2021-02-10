import {
  createStore, combineReducers, applyMiddleware, compose
} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { apiMiddleware } from 'redux-api-middleware';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import reducer from '../reducers/reducer';
import locationMiddleware from './locationMiddleware';
import authMiddleware from './authMiddleware';
import toastNotificationMiddleware from './toastNotificationMiddleware';
import globalLoadingMiddleware from './globalLoadingMiddleware';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: () => (process.env.NODE_ENV !== 'production')
});

export const getAppURL = () => {
  const { protocol, host } = window.location;
  const publicUrl = process.env.PUBLIC_URL;
  const baseUrl = publicUrl.match(/https?:\/\//) ? publicUrl : `${protocol}//${host}/${publicUrl}`;

  // Remove trailing url if exists.
  const url = new URL(baseUrl.replace(/\/$/, ''));
  url.cleanHref = url.href.replace(/\/$/, '');
  return url;
};

export const history = createBrowserHistory({ basename: getAppURL().pathname });
const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;

const store = createStore(
  combineReducers({
    router: connectRouter(history),
    application: reducer
  }),
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      thunk,
      apiMiddleware,
      authMiddleware,
      locationMiddleware,
      toastNotificationMiddleware,
      globalLoadingMiddleware,
      logger
    )
  )
);

export default store;
