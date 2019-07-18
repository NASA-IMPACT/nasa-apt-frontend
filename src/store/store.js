import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { apiMiddleware } from 'redux-api-middleware';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import reducer from '../reducers/reducer';
import locationMiddleware from './locationMiddleware';
import serializeMiddleware from './serializeMiddleware';
import toastNotificationMiddleware from './toastNotificationMiddleware';
import globalLoadingMiddleware from './globalLoadingMiddleware';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: () => (process.NODE_ENV !== 'production')
});

/*
const composeEnhancers = composeWithDevTools({
  serialize: {
    immutable: Immutable
  }
});
*/
export const history = createBrowserHistory();
const store = createStore(
  combineReducers({
    router: connectRouter(history),
    application: reducer
  }),
  applyMiddleware(
    routerMiddleware(history),
    thunk,
    apiMiddleware,
    locationMiddleware,
    serializeMiddleware,
    toastNotificationMiddleware,
    globalLoadingMiddleware,
    logger
  )
  /*
  composeEnhancers(
    applyMiddleware(
      thunk,
      apiMiddleware
    )
  )
  */
);

export default store;
