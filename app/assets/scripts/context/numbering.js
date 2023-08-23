import { createContext, useCallback, useMemo, useState } from 'react';

export function useNumberingProviderValue() {
  const [registeredEquations, setRegisteredEquations] = useState({});
  const [registeredImages, setRegisteredImages] = useState({});
  const [registeredTables, setRegisteredTables] = useState({});

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

  const registerImage = useCallback((key) => {
    setRegisteredImages((prevElements) => {
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

  const registerTable = useCallback((key) => {
    setRegisteredTables((prevElements) => {
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

  const getTableNumbering = useCallback(
    (key) => {
      const numbering = registeredTables[key];
      if (!numbering) {
        return '';
      }

      return `Table ${numbering}: `;
    },
    [registeredTables]
  );

  const getImageNumbering = useCallback(
    (key) => {
      const numbering = registeredImages[key];
      if (!numbering) {
        return '';
      }

      return `Image ${numbering}: `;
    },
    [registeredImages]
  );

  return useMemo(
    () => ({
      getEquationNumbering,
      getTableNumbering,
      getImageNumbering,
      registerEquation,
      registerTable,
      registerImage
    }),
    [
      getEquationNumbering,
      getTableNumbering,
      getImageNumbering,
      registerEquation,
      registerTable,
      registerImage
    ]
  );
}

export const NumberingContext = createContext(null);
