import React, { createContext, useContext, useMemo } from 'react';
import T from 'prop-types';

// The RichContext is used to pass additional context information to slate's
// plugin components. Some components have to render in a different way when
// they're in read mode. Not only that but depending on where they're used, they
// may need contextual information. For example: The subsection needs to know
// the heading level that should be used to render it, and the section it
// appears in to use as id prefix. These values should be passed to the
// ReadEditor. Another example are the references. The reference node stores the
// id to the reference it refers to, but we need the full reference data to be
// able to display the popover

// Context
export const RichContext = createContext(null);

// Context provider
export const RichContextProvider = (props) => {
  const { children, context, contextDeps = [] } = props;

  // Approach used by slate-plugins.
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const value = useMemo(() => context, [...contextDeps]);

  return <RichContext.Provider value={value}>{children}</RichContext.Provider>;
};

RichContextProvider.propTypes = {
  children: T.node,
  context: T.object,
  contextDeps: T.array
};

// Context consumers.
export const useRichContext = () => {
  return useContext(RichContext) || {};
};
