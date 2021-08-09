import React, { createContext, useMemo, useState } from 'react';
import T from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import useQsStateCreator from 'qs-state-hook';

import { createContextChecker } from '../utils/create-context-checker';

// Context
export const CommentsCenterContext = createContext(null);

// Context provider
export const CommentCenterProvider = ({ children }) => {
  // react-router function to get the history for navigation.
  const history = useHistory();
  // react-router function to ensure the component re-renders when there is a
  // location change.
  useLocation();

  const [isPanelOpen, setPanelOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('all-section');
  const [selectedStatus, setSelectedStatus] = useState('all-status');
  // The key of the editing comment will be `threadId-commentId`
  const [editingCommentKey, setEditingCommentKey] = useState(null);

  const useQsState = useQsStateCreator({
    commit: history.push
  });

  const [openThreadId, setOpenThreadId] = useQsState(
    useMemo(
      () => ({
        key: 'threadId',
        default: null,
        hydrator: Number,
        dehydrator: String
      }),
      []
    )
  );

  const contextValue = {
    isPanelOpen,
    setPanelOpen,
    selectedSection,
    setSelectedSection,
    selectedStatus,
    setSelectedStatus,
    openThreadId,
    setOpenThreadId,
    editingCommentKey,
    setEditingCommentKey
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
