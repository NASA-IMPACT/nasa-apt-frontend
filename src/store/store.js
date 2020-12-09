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
import toastNotificationMiddleware from './toastNotificationMiddleware';
import globalLoadingMiddleware from './globalLoadingMiddleware';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: () => (process.env.NODE_ENV !== 'production')
});

export const history = createBrowserHistory({ basename: process.env.PUBLIC_URL });
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
      locationMiddleware,
      toastNotificationMiddleware,
      globalLoadingMiddleware,
      logger
    )
  )
);

export default store;
