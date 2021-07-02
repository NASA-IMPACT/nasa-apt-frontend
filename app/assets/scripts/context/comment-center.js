import React, { createContext, useState } from 'react';
import T from 'prop-types';

import { createContextChecker } from '../utils/create-context-checker';

// Context
export const CommentsCenterContext = createContext(null);

// Context provider
export const CommentCenterProvider = ({ children }) => {
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('general');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const contextValue = {
    isPanelOpen,
    setPanelOpen,
    selectedSection,
    setSelectedSection,
    selectedStatus,
    setSelectedStatus
  };

  return (
    <CommentsCenterContext.Provider value={contextValue}>
      {children}
    </CommentsCenterContext.Provider>
  );
};

CommentCenterProvider.propTypes = {
  children: T.node
};

// Context consumers.
const useSafeContextFn = createContextChecker(
  CommentsCenterContext,
  'CommentsCenterContext'
);

export const useCommentCenter = () => {
  return useSafeContextFn('useCommentCenter');
};
