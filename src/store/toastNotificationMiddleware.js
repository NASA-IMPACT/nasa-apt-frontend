import toasts from '../components/common/toasts';

const toastNotificationMiddleware = (/* store */) => next => async (action) => {
  const { type } = action;

  // Define the human labels for each action type.
  // By default the messages will be:
  //
  // ${label} was successfully created
  // An error occurred while creating the ${label}
  // ${label} was successfully updated
  // An error occurred while updated the ${label}
  // ${label} was successfully deleted
  // An error occurred while deleting the ${label}
  // It is possible to define custom messages for each action that overrides
  // the default one.
  const humanLabels = {
    CONTACT: 'Contact',
    CONTACT_GROUP: 'Contact group',
    ATBD: 'ATBD',
    ATBD_VERSION: 'ATBD version',
    PERFORMANCE_ASSESSMENT: 'Performance assessment',
    CITATION: 'Citation',
    ATBD_CONTACT: {
      createSuccess: 'Contact successfully added to ATBD',
      createFail: 'An error occurred while adding contact to ATBD',
      deleteSuccess: 'Contact successfully removed from ATBD',
      deleteFail: 'An error occurred while removing contact from ATBD'
    },
    ATBD_CONTACT_GROUP: {
      createSuccess: 'Contact group successfully added to ATBD',
      createFail: 'An error occurred while adding contact group to ATBD',
      deleteSuccess: 'Contact group successfully removed from ATBD',
      deleteFail: 'An error occurred while removing contact group from ATBD'
    },
    ALGORITHM_INPUT_VARIABLE: 'Algorithm input variable',
    ALGORITHM_OUTPUT_VARIABLE: 'Algorithm output variable',
    ALGORITHM_IMPLEMENTATION: 'Algorithm implementation',
    ACCESS_INPUT: 'Access input',
    ACCESS_OUTPUT: 'Access output',
    ACCESS_RELATED: 'Access related',
    REFERENCE: 'Reference'
  };

  Object.keys(humanLabels).forEach((a) => {
    const label = humanLabels[a];
    if (type === `CREATE_${a}_SUCCESS`) {
      toasts.success(label.createSuccess
        ? label.createSuccess
        : `${label} was successfully created`);
    }
    if (type === `CREATE_${a}_FAIL`) {
      toasts.error(label.createFail
        ? label.createFail
        : `An error occurred while creating the ${label}`, { autoClose: false });
    }
    if (type === `UPDATE_${a}_SUCCESS`) {
      toasts.success(label.updateSuccess
        ? label.updateSuccess
        : `${label} was successfully updated`);
    }
    if (type === `UPDATE_${a}_FAIL`) {
      toasts.error(label.updateSuccess
        ? label.updateSuccess
        : `An error occurred while updated the ${label}`, { autoClose: false });
    }
    if (type === `DELETE_${a}_SUCCESS`) {
      toasts.success(label.deleteSuccess
        ? label.deleteSuccess
        : `${label} was successfully deleted`);
    }
    if (type === `DELETE_${a}_FAIL`) {
      toasts.error(label.deleteSuccess
        ? label.deleteSuccess
        : `An error occurred while deleting the ${label}`, { autoClose: false });
    }
  });

  return next(action);
};

export default toastNotificationMiddleware;
