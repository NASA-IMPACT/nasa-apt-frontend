import {
  createStore, combineReducers, applyMiddleware, compose
} from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import reducer from '../reducers/reducer';
import locationMiddleware from './locationMiddleware';
import serializeMiddleware from './serializeMiddleware';
import toastNotificationMiddleware from './toastNotificationMiddleware';

export const history = createBrowserHistory();
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
      serializeMiddleware,
      toastNotificationMiddleware,
    )
  )
);

export default store;
