import { createContext, useCallback, useMemo, useState } from 'react';

export function useHeadingNumberingProviderValue() {
  const [registeredElements, setRegisteredElements] = useState({});

  const register = useCallback((key) => {
    setRegisteredElements((prevElements) => {
      if (prevElements[key]) {
        return prevElements;
      }

      const numElements = Object.keys(prevElements).length;
      return {
        ...prevElements,
        [key]: numElements + 1
      };
    });
  }, []);

  const getNumbering = useCallback(
    (key, numberingFromParent = '') => {
      if (!registeredElements[key]) {
        return '';
      }

      return `${numberingFromParent}${registeredElements[key]}.`;
    },
    [registeredElements]
  );

  return useMemo(
    () => ({
      getNumbering,
      register
    }),
    [getNumbering, register]
  );
}

export const HeadingNumberingContext = createContext(null);
