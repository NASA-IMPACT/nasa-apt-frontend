import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
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
  const [atbdId, setAtbdId] = useState(null);
  const [atbdVersion, setAtbdVersion] = useState(null);
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

  useEffect(() => {
    // When the panel is closed, reset everything.
    if (!isPanelOpen) {
      setSelectedSection('all-section');
      setSelectedStatus('all-status');
      setAtbdId(null);
      setAtbdVersion(null);
      setOpenThreadId(null);
      setEditingCommentKey(null);
    }
  }, [setOpenThreadId, isPanelOpen]);

  const openPanelOn = useCallback(
    ({ atbdId, atbdVersion, section = 'all-section' }) => {
      setPanelOpen(true);
      setAtbdId(atbdId);
      setAtbdVersion(atbdVersion);
      setSelectedSection(section);
    },
    []
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
    setEditingCommentKey,
    atbdId,
    setAtbdId,
    atbdVersion,
    setAtbdVersion,
    openPanelOn
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

/**
 * Enables the use of the comment center
 * When an atbd is provided the stored id and version will be updated when they
 * change.
 *
 * @param {object} opts Options
 * @param {object} atbd The atbd for which to load comments.
 */
export const useCommentCenter = ({ atbd = null } = {}) => {
  const ctx = useSafeContextFn('useCommentCenter');

  useEffect(() => {
    if (!atbd?.data) return;
    // If the panel is open and the atbd changes update the values.
    // This happens when switching versions.

    // The atbdId must be numeric. The alias does not work.
    const { id, version } = atbd.data || {};
    if (ctx.isPanelOpen && id && version) {
      ctx.openPanelOn({
        // The atbdId must be numeric. The alias does not work.
        atbdId: id,
        atbdVersion: version
      });
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [atbd, ctx.isPanelOpen, ctx.openPanelOn]);

  return ctx;
};
