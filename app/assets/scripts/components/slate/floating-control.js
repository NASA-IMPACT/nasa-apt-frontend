import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import PortalContainer from './plugins/common/portal-container';

export const FloatingToolbar = styled.div`
  position: absolute;
  top: 90%;
  z-index: 9999;
  display: grid;
  grid-gap: ${glsp(0.25)};
  margin-top: ${glsp(-0.5)};
  padding: ${glsp(0.25)};
  background-color: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  border-radius: ${themeVal('shape.rounded')};
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
  transition: visibility 120ms linear 10ms, opacity 120ms ease-out 10ms;

  > * {
    grid-row: 1;
  }
`;

// Display the toolbar buttons for the plugins that define a toolbar.
export const FloatingControl = React.forwardRef((props, ref) => {
  const { children, onChildrenMountState, visible, anchor } = props;

  const [state, setState] = useState(null);
  const [mounted, setMounted] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (visible) {
      setMounted(true);
      timeoutRef.current = setTimeout(() => {
        setState('enter');
      }, 1);
    } else {
      setState('exit');
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
        setState(null);
      }, 300);
    }
  }, [visible]);

  return (
    <PortalContainer>
      {mounted && (
        <Floater
          onChildrenMountState={onChildrenMountState}
          state={state}
          anchor={anchor}
          ref={ref}
        >
          {children}
        </Floater>
      )}
    </PortalContainer>
  );
});

FloatingControl.displayName = 'FloatingControl';

FloatingControl.propTypes = {
  onChildrenMountState: T.func,
  children: T.node,
  visible: T.bool,
  anchor: T.object
};

const Floater = React.forwardRef((props, ref) => {
  const { children, onChildrenMountState, state, anchor } = props;
  const toolbarRef = useRef(null);
  useImperativeHandle(ref, () => toolbarRef.current);

  const mounted = useRef(false);

  // Because of how the FloatingControl animation works, when it mounts, the
  // children are not necessarily mounted. We use the prop onChildrenMountState
  // to notify the parent of the children state.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    onChildrenMountState?.(mounted.current);
    return () => {
      onChildrenMountState?.(mounted.current);
    };
  }, [onChildrenMountState]);

  const [[top, left], setPosition] = useState([]);

  useEffect(() => {
    if (state === 'exit') return;

    // Account for the toolbar size when positioning it.
    const el = toolbarRef.current;
    const { top, left, width } = anchor || {};
    if (el && top && left && width) {
      setPosition([
        // Top
        top + window.pageYOffset - el.offsetHeight,
        // Left
        left + window.pageXOffset - el.offsetWidth / 2 + width / 2
      ]);
    }
  }, [anchor, state]);

  const stylePosition = {
    top: top || 0,
    left: left || 0
  };

  return (
    <FloatingToolbar
      isHidden={state !== 'enter'}
      ref={toolbarRef}
      style={stylePosition}
    >
      {children}
    </FloatingToolbar>
  );
});

Floater.displayName = 'Floater';

Floater.propTypes = {
  onChildrenMountState: T.func,
  children: T.node,
  state: T.string,
  anchor: T.object
};
