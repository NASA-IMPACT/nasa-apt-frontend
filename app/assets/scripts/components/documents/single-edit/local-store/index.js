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
  const { values, setValues, dirty } = useFormikContext();
  const { step } = useParams();

  const stepId = step || 'identifying_information';
  const [displayRecoverToast, setDisplayRecoverToast] = useState(false);

  const recoverData = useCallback(() => {
    const localAtbdStorage = new LocalAtbdStorage();
    const localValues = localAtbdStorage.getAtbd(atbd, stepId);
    setValues(defaultsDeep(localValues, values));
    setDisplayRecoverToast(false);
  }, [atbd, values, setValues, stepId]);

  const clearData = useCallback(() => {
    const localAtbdStorage = new LocalAtbdStorage();
    localAtbdStorage.removeAtbd(atbd, stepId);
    setDisplayRecoverToast(false);
  }, [atbd, stepId]);

  useEffect(() => {
    const localAtbdStorage = new LocalAtbdStorage();
    if (isInitialized.current) {
      if (dirty) {
        localAtbdStorage.setAtbd(atbd, stepId, values);
      } else {
        localAtbdStorage.removeAtbd(atbd, stepId);
      }
    } else {
      if (atbd) {
        const localValues = localAtbdStorage.getAtbd(atbd, stepId);
        if (localValues) {
          setDisplayRecoverToast(true);
        }
        isInitialized.current = true;
      }
    }
  }, [atbd, stepId, values, setValues, dirty]);

  useEffect(() => {
    if (displayRecoverToast) {
      toast.info(
        ({ closeToast }) => (
          <RecoverToast
            recoverData={recoverData}
            clearData={clearData}
            closeToast={closeToast}
          />
        ),
        {
          autoClose: false
        }
      );
    }
  }, [displayRecoverToast, clearData, recoverData]);

  return null;
}

LocalStore.propTypes = {
  atbd: T.object.isRequired
};
