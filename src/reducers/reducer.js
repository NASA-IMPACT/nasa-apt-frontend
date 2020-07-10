import findIndex from 'lodash.findindex';
import actions from '../constants/action_types';

const initialState = {
  atbds: [],
  contacts: [],
  contact_groups: [],
  references: [],
  lastCreatedContact: undefined,
  uploadedFile: undefined,
  atbdVersion: undefined,
  atbdCitation: undefined,
  selectedAtbd: undefined,
  activeReference: undefined,
  t: undefined,
  // Store what actions are triggering a loading.
  // The will be added/removed as loadings are triggered.
  globalLoading: []
};

const deleteAtbdVersionChildItem = (idKey, tableName, state, action) => {
  const { payload } = action;
  const { [idKey]: id } = payload;
  const variables = state.atbdVersion[tableName].filter(
    variable => variable[idKey] !== id
  );
  return {
    ...state,
    atbdVersion: {
      ...state.atbdVersion,
      [tableName]: variables
    }
  };
};

const addAtbdVersionChildItem = (tableName, state, action) => {
  const { payload } = action;
  const next = state.atbdVersion[tableName].concat([payload]);
  return {
    ...state,
    atbdVersion: {
      ...state.atbdVersion,
      [tableName]: next
    }
  };
};

// Add common metadata to contacts and contact groups,
// to make working with them in combination easier.
const normalizeContact = (contactOrGroup) => {
  const isGroup = !contactOrGroup.contact_id;
  const displayName = isGroup
    ? contactOrGroup.group_name
    : `${contactOrGroup.last_name}, ${contactOrGroup.first_name}`;
  const id = isGroup
    ? `g${contactOrGroup.contact_group_id}`
    : `c${contactOrGroup.contact_id}`;
  return {
    ...contactOrGroup,
    isGroup,
    displayName,
    id
  };
};

// Normalize contact, contact groups
const normalizeSelectedAtbd = (atbd) => {
  const next = { ...atbd };
  next.contacts = Array.isArray(atbd.contacts)
    ? atbd.contacts.map(normalizeContact)
    : [];
  next.contact_groups = Array.isArray(atbd.contact_groups)
    ? atbd.contact_groups.map(normalizeContact)
    : [];
  return next;
};

const replaceAtIndex = (arr, idProperty, next) => {
  if (!arr || !Array.isArray(arr)) {
    return arr;
  }
  const idx = findIndex(arr, c => c[idProperty] === next[idProperty]);
  if (idx >= 0) {
    const result = arr.slice();
    result[idx] = Object.assign({}, next);
    return result;
  }
  return arr;
};

const handleLoading = (state, action) => {
  const { type, payload } = action;
  const { globalLoading } = state;

  if (type === actions.SHOW_LOADING) {
    return {
      ...state,
      globalLoading: [...globalLoading, payload]
    };
  }
  if (type === actions.HIDE_LOADING) {
    return {
      ...state,
      globalLoading: globalLoading.filter(a => a !== payload)
    };
  }
  if (type === actions.CLEAR_LOADING) {
    return {
      ...state,
      globalLoading: []
    };
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_ALGORITHM_VARIABLES_SUCCESS:
    case actions.FETCH_ALGORITHM_IMPLEMENTATION_SUCCESS:
    case actions.FETCH_ATBD_VERSION_SUCCESS: {
      const { payload } = action;
      return { ...state, atbdVersion: { ...payload } };
    }

    case actions.FETCH_ATBDS_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        atbds: [
          ...payload.map((a) => {
            if (!a.contacts) return a;
            return {
              ...a,
              contacts: a.contacts.filter(Boolean)
            };
          })
        ]
      };
    }

    case actions.FETCH_CONTACTS_SUCCESS: {
      const { payload } = action;
      return { ...state, contacts: [...payload.map(normalizeContact)] };
    }

    case actions.FETCH_CONTACT_GROUPS_SUCCESS: {
      const { payload } = action;
      return { ...state, contact_groups: [...payload.map(normalizeContact)] };
    }

    case actions.FETCH_ATBD_SUCCESS: {
      const { payload } = action;
      return { ...state, selectedAtbd: normalizeSelectedAtbd(payload) };
    }

    case actions.UPDATE_ATBD_VERSION_SUCCESS: {
      // Update the atbd version inside the atbds array.
      const atbdIdx = (state.atbds || []).findIndex(a => a.atbd_id === action.payload.atbd_id);
      if (atbdIdx === -1) return state;
      const versionIdx = state.atbds[atbdIdx].atbd_versions.findIndex(v => v.atbd_version === action.payload.atbd_version);
      if (versionIdx === -1) return state;
      return {
        ...state,
        atbds: Object.assign([], state.atbds, {
          [atbdIdx]: {
            ...state.atbds[atbdIdx],
            atbd_versions: Object.assign([], state.atbds[atbdIdx].atbd_versions, {
              [versionIdx]: {
                ...state.atbds[atbdIdx].atbd_versions[versionIdx],
                ...action.payload
              }
            })
          }
        })
      };
    }

    case actions.CREATE_CONTACT_GROUP_SUCCESS:
    case actions.CREATE_CONTACT_SUCCESS: {
      const next = normalizeContact(action.payload);
      const group = next.isGroup ? 'contact_groups' : 'contacts';
      return {
        ...state,
        [group]: [...state[group], next],
        lastCreatedContact: next
      };
    }

    case actions.CREATE_ATBD_CONTACT_GROUP_SUCCESS:
    case actions.CREATE_ATBD_CONTACT_SUCCESS: {
      const { payload } = action;
      const idProperty = payload.contact_id ? 'contact_id' : 'contact_group_id';
      const group = payload.contact_id ? 'contacts' : 'contact_groups';
      const addedContact = state[group].find(
        d => d[idProperty] === payload[idProperty]
      );
      const newState = {
        ...state,
        selectedAtbd: {
          ...state.selectedAtbd,
          [group]: [...state.selectedAtbd[group], { ...addedContact }]
        }
      };
      return newState;
    }

    case actions.DELETE_ATBD_CONTACT_GROUP_SUCCESS:
    case actions.DELETE_ATBD_CONTACT_SUCCESS: {
      const { payload } = action;
      const idProperty = payload.contact_id ? 'contact_id' : 'contact_group_id';
      const group = payload.contact_id ? 'contacts' : 'contact_groups';
      return {
        ...state,
        selectedAtbd: {
          ...state.selectedAtbd,
          [group]: state.selectedAtbd[group].filter(
            d => d[idProperty] !== payload[idProperty]
          )
        }
      };
    }

    case actions.UPDATE_CONTACT_GROUP_SUCCESS:
    case actions.UPDATE_CONTACT_SUCCESS: {
      const next = normalizeContact(action.payload);
      const group = next.isGroup ? 'contact_groups' : 'contacts';
      const idProperty = next.isGroup ? 'contact_group_id' : 'contact_id';
      return {
        ...state,
        [group]: replaceAtIndex(state[group], idProperty, next),
        selectedAtbd: {
          ...state.selectedAtbd,
          [group]: replaceAtIndex(state.selectedAtbd[group], idProperty, next)
        }
      };
    }

    case actions.CREATE_ALGORITHM_INPUT_VARIABLE_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        atbdVersion: {
          ...state.atbdVersion,
          algorithm_input_variables: [
            ...state.atbdVersion.algorithm_input_variables,
            { ...payload }
          ]
        }
      };
    }

    case actions.CREATE_ALGORITHM_OUTPUT_VARIABLE_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        atbdVersion: {
          ...state.atbdVersion,
          algorithm_output_variables: [
            ...state.atbdVersion.algorithm_output_variables,
            { ...payload }
          ]
        }
      };
    }

    case actions.DELETE_ALGORITHM_INPUT_VARIABLE_SUCCESS: {
      const idKey = 'algorithm_input_variable_id';
      const tableName = 'algorithm_input_variables';
      return deleteAtbdVersionChildItem(idKey, tableName, state, action);
    }

    case actions.DELETE_ALGORITHM_OUTPUT_VARIABLE_SUCCESS: {
      const idKey = 'algorithm_output_variable_id';
      const tableName = 'algorithm_output_variables';
      return deleteAtbdVersionChildItem(idKey, tableName, state, action);
    }

    case actions.UPLOAD_FILE_SUCCESS: {
      const {
        payload: { location }
      } = action;
      return {
        ...state,
        uploadedFile: location
      };
    }

    case actions.CREATE_ATBD_SUCCESS: {
      const { payload } = action;
      const { created_atbd, created_version } = payload;
      const newAtbd = {
        ...created_atbd,
        contacts: [],
        contact_groups: [],
        atbd_versions: [{ ...created_version }]
      };
      return { ...state, atbds: [...state.atbds, newAtbd] };
    }

    case actions.CREATE_ALGORITHM_IMPLEMENTATION_SUCCESS: {
      const tableName = 'algorithm_implementations';
      return addAtbdVersionChildItem(tableName, state, action);
    }

    case actions.DELETE_ALGORITHM_IMPLEMENTATION_SUCCESS: {
      const idKey = 'algorithm_implementation_id';
      const tableName = 'algorithm_implementations';
      return deleteAtbdVersionChildItem(idKey, tableName, state, action);
    }

    case actions.CREATE_ACCESS_INPUT_SUCCESS: {
      const tableName = 'data_access_input_data';
      return addAtbdVersionChildItem(tableName, state, action);
    }

    case actions.DELETE_ACCESS_INPUT_SUCCESS: {
      const idKey = 'data_access_input_data_id';
      const tableName = 'data_access_input_data';
      return deleteAtbdVersionChildItem(idKey, tableName, state, action);
    }

    case actions.CREATE_ACCESS_OUTPUT_SUCCESS: {
      const tableName = 'data_access_output_data';
      return addAtbdVersionChildItem(tableName, state, action);
    }

    case actions.DELETE_ACCESS_OUTPUT_SUCCESS: {
      const idKey = 'data_access_output_data_id';
      const tableName = 'data_access_output_data';
      return deleteAtbdVersionChildItem(idKey, tableName, state, action);
    }

    case actions.CREATE_ACCESS_RELATED_SUCCESS: {
      const tableName = 'data_access_related_urls';
      return addAtbdVersionChildItem(tableName, state, action);
    }

    case actions.DELETE_ACCESS_RELATED_SUCCESS: {
      const idKey = 'data_access_related_url_id';
      const tableName = 'data_access_related_urls';
      return deleteAtbdVersionChildItem(idKey, tableName, state, action);
    }

    case actions.FETCH_ATBD_VERSION_REFERENCES_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        references: payload
      };
    }

    case actions.SET_ACTIVE_REFERENCE: {
      const { payload } = action;
      return {
        ...state,
        activeReference: payload
      };
    }

    case actions.CREATE_REFERENCE_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        references: state.references.concat([payload]),
        activeReference: payload
      };
    }

    case actions.DELETE_REFERENCE_SUCCESS: {
      const { payload } = action;
      const id = payload.publication_reference_id;
      return {
        ...state,
        references: state.references.filter(
          d => d.publication_reference_id !== id
        )
      };
    }

    case actions.FETCH_CITATIONS_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        atbdCitation: payload
      };
    }

    case actions.FETCH_STATIC_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        t: payload
      };
    }

    case actions.DELETE_ATBD_SUCCESS: {
      const { payload: { atbd_id } } = action;
      return {
        ...state,
        atbds: state.atbds.filter(a => a.atbd_id !== atbd_id)
      };
    }

    case actions.SHOW_LOADING:
    case actions.HIDE_LOADING:
    case actions.CLEAR_LOADING: {
      return handleLoading(state, action);
    }

    default:
      return state;
  }
}
