import React, { useState, useEffect, useCallback, useRef } from 'react';
import T from 'prop-types';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { useParams } from 'react-router';
import defaultsDeep from 'lodash.defaultsdeep';
import { toast } from 'react-toastify';
import { Button as BaseButton } from '@devseed-ui/button';

export class LocalAtbdStorage {
  constructor() {
    this.expiry = 15 * 60000; // 15 minutes
  }

  getStorageKey(atbd, step) {
    const { id, version } = atbd;
    return `atbd/${id}/${version}/${step}`;
  }

  getAtbd(atbd, step) {
    const key = this.getStorageKey(atbd, step);
    const values = JSON.parse(localStorage.getItem(key));

    if (values && values.created + this.expiry > Date.now()) {
      // Return values if the store is not expired
      return values;
    }

    // The store either doesn't exist or is expired,
    // trying to remove the store
    this.removeAtbd(atbd, step);
    return undefined;
  }

  setAtbd(atbd, step, values) {
    const key = this.getStorageKey(atbd, step);
    localStorage.setItem(
      key,
      JSON.stringify({
        ...values,
        created: Date.now()
      })
    );
  }

  removeAtbd(atbd, step) {
    const key = this.getStorageKey(atbd, step);
    localStorage.removeItem(key);
  }
}

const Button = styled(BaseButton)`
  margin-top: 0.5rem;
  margin-right: 0.5rem;
`;

function RecoverToast({ recoverData, clearData, closeToast }) {
  const handleRecover = () => {
    recoverData();
    closeToast();
  };

  const handleClear = () => {
    clearData();
    closeToast();
  };

  return (
    <div>
      <p>
        We have recovered data that you had inserted. Do you want to restore the
        data?
      </p>
      <Button
        variation='primary-raised-light'
        size='small'
        type='button'
        onClick={handleRecover}
      >
        Recover
      </Button>
      <Button
        variation='primary-raised-light'
        size='small'
        type='button'
        onClick={handleClear}
      >
        Discard
      </Button>
    </div>
  );
}

RecoverToast.propTypes = {
  recoverData: T.func.isRequired,
  clearData: T.func.isRequired,
  closeToast: T.func.isRequired
};

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
