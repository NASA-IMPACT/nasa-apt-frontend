import React from 'react';
import config from '../config';
import { getAppURL } from './history';

export const getHostedAuthUiUrl = (page) => {
  const clientId = config.auth.userPoolWebClientId;
  const returnTo = getAppURL().cleanHref;
  return `${config.hostedAuthUi}/${page}?client_id=${clientId}&response_type=token&redirect_uri=${returnTo}`;
};

export function useBooleanState(initialValue) {
  const [value, setValue] = React.useState(initialValue);

  const setValueTrue = React.useCallback(() => {
    setValue(true);
  }, []);

  const setValueFalse = React.useCallback(() => {
    setValue(false);
  }, []);

  const toggleValue = React.useCallback(() => {
    setValue((prevValue) => !prevValue);
  }, []);

  return [value, setValueTrue, setValueFalse, toggleValue];
}
