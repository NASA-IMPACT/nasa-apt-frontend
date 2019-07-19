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

export const history = createBrowserHistory();

const enhancers = [];

// Dev Tools
if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const store = createStore(
  combineReducers({
    router: connectRouter(history),
    application: reducer
  }),
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunk,
      apiMiddleware,
      locationMiddleware,
      serializeMiddleware
    ),
    ...enhancers
  )
);

export default store;
