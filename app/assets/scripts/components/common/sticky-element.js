/* eslint-disable react/prop-types */

import React from 'react';
import styled from 'styled-components';
import { RenderPropSticky } from 'react-sticky-el';

const Wrapper = styled.div`
  position: relative;
  z-index: 100;
`;

// This component is basically the same as exported by react-sticky-el with a
// change to support an offset value from the top. This is need to make some
// bars stick below the inpage header, at 84 px from the top. Internally the
// distance from the top is calculated as the inverse of topOffset, since this
// dictates the eagerness to stick. If the element starts to stick at X from the
// top, we also want it to remain stuck at X from the top.
// https://github.com/gm0t/react-sticky-el#advanced-usage

function StickyElement(props) {
  const {
    // props for StickyRenderProp
    mode,
    onFixedToggle,
    hideOnBoundaryHit,
    offsetTransforms,
    disabled,
    boundaryElement,
    scrollElement,
    bottomOffset,
    topOffset,
    positionRecheckInterval,
    children,
    isIOSFixEnabled,
    dontUpdateHolderHeightWhenSticky,

    // rest of the props that we will forward to wrapper
    ...rest
  } = props;

  const offsetFromTop = -(topOffset || 0);
  const _bottomOffset = bottomOffset
    ? bottomOffset + offsetFromTop
    : bottomOffset;

  return (
    <RenderPropSticky
      mode={mode}
      onFixedToggle={onFixedToggle}
      hideOnBoundaryHit={hideOnBoundaryHit}
      offsetTransforms={offsetTransforms}
      disabled={disabled}
      boundaryElement={boundaryElement}
      scrollElement={scrollElement}
      bottomOffset={_bottomOffset}
      topOffset={topOffset}
      positionRecheckInterval={positionRecheckInterval}
      isIOSFixEnabled={isIOSFixEnabled}
      dontUpdateHolderHeightWhenSticky={dontUpdateHolderHeightWhenSticky}
    >
      {({ isFixed, wrapperStyles, wrapperRef, holderStyles, holderRef }) => {
        let newWrapperStyles = { ...wrapperStyles, background: '#fff' };

        if (wrapperStyles?.top) {
          const newTop = offsetFromTop + parseInt(wrapperStyles.top || 0);
          newWrapperStyles = {
            ...newWrapperStyles,
            top: newTop
          };
        }

        return (
          <Wrapper {...rest} ref={holderRef} style={holderStyles}>
            <div
              {...rest}
              style={newWrapperStyles}
              ref={wrapperRef}
              className={isFixed ? 'is-sticky' : ''}
            >
              {children}
            </div>
          </Wrapper>
        );
      }}
    </RenderPropSticky>
  );
}

export default StickyElement;
