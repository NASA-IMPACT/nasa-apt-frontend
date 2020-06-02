import qs from 'qs';
import { LOCATION_CHANGE, push } from 'connected-react-router';

import * as actions from '../actions/actions';
import types from '../constants/action_types';
import {
  atbds,
  atbdsedit,
  identifying_information,
  introduction,
  contacts,
  drafts,
  algorithm_description,
  algorithm_usage,
  algorithm_implementation,
  references,
  error
} from '../constants/routes';
import toasts from '../components/common/toasts';

const locationMiddleware = store => next => async (action) => {
  const { type, payload } = action;
  if (type === LOCATION_CHANGE) {
    const { location: { pathname, search } } = payload;

    // Redirect '/' to '/atbds'
    if (pathname === '/') {
      return store.dispatch(push(`/${atbds}`));
    }

    const pathComponents = pathname.split('/');
    if (pathComponents[1] === atbds) {
      if (pathComponents.length === 2) {
        const queryParams = qs.parse(search.substr(1));
        /* eslint-disable-next-line prefer-const */
        let filter = [];
        if (queryParams.search && queryParams.search.trim()) {
          filter.push(`searchstring=${encodeURIComponent(queryParams.search.trim())}`);
        }
        if (queryParams.status) {
          filter.push(`statusstring=${encodeURIComponent(queryParams.status)}`);
        }
        // Route /atbds
        store.dispatch(actions.fetchAtbds(filter.join('&')));
      } else {
        // Route /atbds/:atbd_id
        const res = await store.dispatch(actions.fetchAtbd(pathComponents[2]));
        const versionDef = {
          atbd_id: res.payload.atbd_id,
          atbd_version: res.payload.atbd_versions[0].atbd_version
        };
        store.dispatch(actions.fetchEntireAtbdVersion(versionDef));
        store.dispatch(actions.fetchCitation(versionDef));
      }
    }
    if (pathComponents[1] === atbdsedit) {
      if (pathComponents[3] === drafts) {
        const versionObject = {
          atbd_id: pathComponents[2],
          atbd_version: pathComponents[4]
        };

        // Version variables and algorithm implementations
        // queries both include the atbd version in their query.
        if (pathComponents[5] === algorithm_description) {
          store.dispatch(actions.fetchAtbdVersionVariables(versionObject));
        } else if (pathComponents[5] === algorithm_implementation) {
          store.dispatch(actions.fetchAlgorithmImplmentations(versionObject));
        } else {
          store.dispatch(actions.fetchAtbdVersion(versionObject));
        }

        if (pathComponents[5] === contacts) {
          store.dispatch(actions.fetchAtbd(pathComponents[2]));
          store.dispatch(actions.fetchContacts());
          store.dispatch(actions.fetchContactGroups());
        }

        if (pathComponents[5] === identifying_information) {
          store.dispatch(actions.fetchCitation(versionObject));
        }

        // Pages with rich editors need a full list of ATBD references
        // to allow reference re-use.
        const needsReferences = [
          introduction,
          algorithm_description,
          algorithm_usage,
          algorithm_implementation,
          references
        ];
        if (needsReferences.indexOf(pathComponents[5]) >= 0) {
          store.dispatch(actions.fetchAtbdVersionReferences(versionObject));
        }
      }
    }

    // Fetch static json assets if undefined
    if (!store.getState().application.static) {
      store.dispatch(actions.fetchStatic());
    }
  }
  if (type === types.FETCH_ATBD_VERSION_FAIL) {
    store.dispatch(push(`/${error}`));
  }
  if (type === types.FETCH_ATBD_FAIL) {
    store.dispatch(push(`/${error}`));
  }

  if (type === types.CREATE_ATBD_SUCCESS) {
    const { created_version } = payload;
    const { atbd_id, atbd_version } = created_version;
    store.dispatch(push(`/${atbdsedit}/${atbd_id}/${drafts}/${atbd_version}/`
      + `${identifying_information}`));
  }

  // After fetching the version, if we're on the edit page and the ATBD
  // was already published redirect with a notification.
  if (type === types.FETCH_ATBD_VERSION_SUCCESS) {
    const pieces = store.getState().router.location.pathname.split('/');
    if (pieces[1] === atbdsedit && payload.status === 'Published') {
      toasts.error('Editing a Published ATBD is not allowed. Consider making a copy.');
      store.dispatch(push(`/${atbds}`));
    }
  }
  return next(action);
};

export default locationMiddleware;
