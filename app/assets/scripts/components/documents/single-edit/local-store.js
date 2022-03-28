import { useEffect, useRef } from 'react';
import { useFormikContext } from 'formik';
import { useParams } from 'react-router';
import defaultsDeep from 'lodash.defaultsdeep';

export class LocalAtbdStorage {
  constructor() {
    this.expiry = 15 * 60000; // 15 minutes
  }

  getStorageKey(atbd) {
    const { id, version } = atbd;
    return `atbd/${id}/${version}`;
  }

  getAtbd(atbd) {
    const key = this.getStorageKey(atbd);
    const values = JSON.parse(localStorage.getItem(key));

    if (values && values.created + this.expiry > Date.now()) {
      // Return values if the store is not expired
      return values;
    }

    // The store either doesn't exist or is expired,
    // trying to remove the store
    this.removeAtbd(atbd);
    return undefined;
  }

  setAtbd(atbd, values) {
    const key = this.getStorageKey(atbd);
    localStorage.setItem(
      key,
      JSON.stringify({
        ...values,
        created: Date.now()
      })
    );
  }

  removeAtbd(atbd) {
    const key = this.getStorageKey(atbd);
    localStorage.removeItem(key);
  }
}

export function LocalStore({ atbd }) {
  const isInitialized = useRef();
  const { values, setValues, dirty } = useFormikContext();
  const { step } = useParams();

  useEffect(() => {
    const localAtbdStorage = new LocalAtbdStorage();
    if (isInitialized.current) {
      if (dirty) {
        const storeValue = { step, values };
        localAtbdStorage.setAtbd(atbd, storeValue);
      } else {
        localAtbdStorage.removeAtbd(atbd);
      }
    } else {
      if (atbd) {
        const localValues = localAtbdStorage.getAtbd(atbd);
        if (localValues && localValues.step === step) {
          setValues(defaultsDeep(localValues.values, values));
        } else {
          localAtbdStorage.removeAtbd(atbd);
        }
        isInitialized.current = true;
      }
    }
  }, [atbd, step, values, setValues, dirty]);

  return null;
}
