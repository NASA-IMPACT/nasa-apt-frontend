import React, { createContext, useContext, useMemo } from 'react';
import T from 'prop-types';

// Some components have to render in a different way when they're in read mode.
// Not only that but depending on where they're used, they may need contextual
// information. For example: The subsection needs to know the heading level that
// should be used to render it, and the section it appears in to use as id
// prefix. These values should be passed to the ReadEditor.

// Context
export const ReadingContext = createContext(null);

// Context provider
export const ReadProvider = (props) => {
  const { children, context, contextDeps = [] } = props;

  // Approach used by slate-plugins.
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const value = useMemo(() => context, [...contextDeps]);

  return (
    <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>
  );
};

ReadProvider.propTypes = {
  children: T.node,
  context: T.object,
  contextDeps: T.array
};

// Context consumers.
export const useReadingContext = () => {
  return useContext(ReadingContext) || {};
};
