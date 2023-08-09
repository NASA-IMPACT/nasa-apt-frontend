import React from 'react';
import { InlineMath } from 'react-katex';

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

export function resolveTitle(title) {
  if (!title || title === '') {
    return '';
  }

  const start = '{{';
  const end = '}}';

  const parts = title.split(start);
  const resolvedParts = parts.map((part) => {
    const endIndex = part.indexOf(end);

    if (endIndex === -1) {
      return part;
    }

    const key = part.substring(0, endIndex);
    const value = <InlineMath math={key} />;

    return (
      <>
        {/* And, replace with associated component */}
        {value}
        {/* Remove the key */}
        {part.replace(`${key}${end}`, '')}
      </>
    );
  });

  return (
    <>
      {resolvedParts.map((d, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={i}>{d}</React.Fragment>
      ))}
    </>
  );
}
