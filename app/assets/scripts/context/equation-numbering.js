import { createContext, useCallback, useMemo, useState } from 'react';

/**
 *  Provides a context for equation numbering.
 */
export function useEquationNumberingProviderValue() {
  const [registeredEquations, setRegisteredEquations] = useState({});

  const registerEquation = useCallback((key) => {
    setRegisteredEquations((prevElements) => {
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

  const getEquationNumbering = useCallback(
    (key) => {
      const numbering = registeredEquations[key];
      if (!numbering) {
        return '';
      }

      return `(${numbering})`;
    },
    [registeredEquations]
  );

  return useMemo(
    () => ({
      getEquationNumbering,
      registerEquation
    }),
    [getEquationNumbering, registerEquation]
  );
}

export const EquationNumberingContext = createContext(null);
