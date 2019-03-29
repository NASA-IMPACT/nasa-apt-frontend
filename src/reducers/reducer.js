import * as actions from '../constants/action_types';

const initialState = {
  atbds: [],
  contacts: []
};

const deleteAtbdVersionChildItem = (schemaKey, state, action) => {
  const idKey = `${schemaKey}_id`;
  const keyPlural = `${schemaKey}s`;

  const { payload } = action;
  const { [idKey]: id } = payload;
  const variables = state.atbdVersion[keyPlural]
    .filter(variable => (variable[idKey] !== id));
  return {
    ...state,
    atbdVersion: {
      ...state.atbdVersion,
      [keyPlural]: variables
    }
  };
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_ATBD_VERSION_SUCCEEDED: {
      const { payload } = action;
      return { ...state, atbdVersion: payload };
    }

    case actions.FETCH_ATBDS_SUCCEEDED: {
      const { payload } = action;
      return { ...state, atbds: [...payload] };
    }

    case actions.FETCH_CONTACTS_SUCCEEDED: {
      const { payload } = action;
      return { ...state, contacts: [...payload] };
    }

    case actions.FETCH_ATBD_SUCCEEDED: {
      const { payload } = action;
      return { ...state, selectedAtbd: payload };
    }

    case actions.CREATE_CONTACT_SUCCEEDED: {
      const { payload } = action;
      return { ...state, contacts: [...state.contacts, payload] };
    }

    case actions.CREATE_ATBD_CONTACT_SUCCEEDED: {
      const { payload } = action;
      const addedContact = state.contacts.find(contact => (
        contact.contact_id === payload.contact_id
      ));
      const newState = {
        ...state,
        selectedAtbd: {
          ...state.selectedAtbd,
          contacts: [...state.selectedAtbd.contacts, { ...addedContact }]
        }
      };
      return newState;
    }

    case actions.CREATE_ALGORITHM_INPUT_VARIABLE_SUCCEEDED: {
      const { payload } = action;
      return {
        ...state,
        atbdVersion: {
          ...state.atbdVersion,
          algorithm_input_variables:
            [...state.atbdVersion.algorithm_input_variables, { ...payload }]
        }
      };
    }

    case actions.CREATE_ALGORITHM_OUTPUT_VARIABLE_SUCCEEDED: {
      const { payload } = action;
      return {
        ...state,
        atbdVersion: {
          ...state.atbdVersion,
          algorithm_output_variables:
            [...state.atbdVersion.algorithm_output_variables, { ...payload }]
        }
      };
    }

    case actions.DELETE_ALGORITHM_INPUT_VARIABLE_SUCCEEDED: {
      const schemaKey = 'algorithm_input_variable';
      return deleteAtbdVersionChildItem(schemaKey, state, action);
    }

    case actions.DELETE_ALGORITHM_OUTPUT_VARIABLE_SUCCEEDED: {
      const schemaKey = 'algorithm_output_variable';
      return deleteAtbdVersionChildItem(schemaKey, state, action);
    }

    default: return state;
  }
}
