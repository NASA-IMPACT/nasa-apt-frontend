import React, { useState, useEffect, useCallback, useRef } from 'react';
import T from 'prop-types';
import { useFormikContext } from 'formik';

import { useParams } from 'react-router';
import defaultsDeep from 'lodash.defaultsdeep';
import { toast } from 'react-toastify';

import LocalAtbdStorage from './atbd-storage';
import RecoverToast from './recover-toast';

export function LocalStore({ atbd }) {
  const isInitialized = useRef();
  const toastId = useRef(null);
  const { values, setValues, dirty } = useFormikContext();
  const { step } = useParams();

  const stepId = step || 'identifying_information';
  const [isOutDated, setIsOutDated] = useState(false);

  const removeToast = useCallback(() => {
    if (toastId.current !== null) {
      toast.dismiss(toastId.current);
      toastId.current = null;
    }
  }, []);

  const recoverData = useCallback(() => {
    const localAtbdStorage = new LocalAtbdStorage();
    const localValues = localAtbdStorage.getAtbd(atbd, stepId);

    const { document, ...meta } = values;
    const { document: localDocument, ...localMeta } = localValues;

    setValues({
      ...defaultsDeep(localMeta, meta),
      document: Object.assign({}, document, localDocument)
    });

    removeToast();
  }, [atbd, values, setValues, stepId, removeToast]);

  const clearData = useCallback(() => {
    const localAtbdStorage = new LocalAtbdStorage();
    localAtbdStorage.removeAtbd(atbd, stepId);
    removeToast();
  }, [atbd, stepId, removeToast]);

  const showToast = useCallback(() => {
    if (!toastId.current) {
      toastId.current = toast.info(
        <RecoverToast
          recoverData={recoverData}
          clearData={clearData}
          closeToast={removeToast}
          dataIsOutdated={isOutDated}
        />,
        {
          autoClose: false,
          closeButton: false
        }
      );
    }
  }, [clearData, recoverData, isOutDated, removeToast]);

  useEffect(() => {
    const localAtbdStorage = new LocalAtbdStorage();
    if (isInitialized.current) {
      removeToast();
      if (dirty) {
        localAtbdStorage.setAtbd(atbd, stepId, values);
      } else {
        localAtbdStorage.removeAtbd(atbd, stepId);
      }
    } else {
      if (atbd) {
        const localValues = localAtbdStorage.getAtbd(atbd, stepId);
        if (localValues) {
          const atdbUpdated = new Date(atbd.last_updated_at).getTime();
          showToast();
          setIsOutDated(localValues.created < atdbUpdated);
        }
        isInitialized.current = true;
      }
    }
  }, [atbd, stepId, values, setValues, dirty, showToast, removeToast]);

  return null;
}

LocalStore.propTypes = {
  atbd: T.object.isRequired
};
