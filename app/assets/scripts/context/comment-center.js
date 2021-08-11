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

  const openPanelOn = useCallback(
    ({ atbdId, atbdVersion, section = 'all-section' }) => {
      setPanelOpen(true);
      setAtbdId(atbdId);
      setAtbdVersion(atbdVersion);
      setSelectedSection(section);
      setEditingCommentKey(null);
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

/**
 * To trigger the comment center to open from other pages, we use the history
 * state as the user is sent from one page to another. This is happening with
 * the dashboards for example. When the user clicks the comment button, the user
 * is sent to the atbd view page with {menuAction: <menu-id> } in the history
 * state. We then capture this, show the comment center and clear the history
 * state to prevent the modal from popping up on route change.
 *
 * @param {object} opts Options
 * @param {object} atbd The atbd for which to load comments.
 */
export const useCommentCenterHistoryHandler = ({ atbd = null } = {}) => {
  const { openPanelOn } = useSafeContextFn('useCommentCenter');
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // The atbdId must be numeric. The alias does not work.
    const { menuAction, ...rest } = location.state || {};

    if (atbd?.data && menuAction === 'toggle-comments') {
      const { id, version } = atbd.data || {};
      openPanelOn({
        atbdId: id,
        atbdVersion: version
      });
      // Using undefined keeps the same path.
      history.replace(undefined, rest);
    }
  }, [atbd, history, location, openPanelOn]);
};
