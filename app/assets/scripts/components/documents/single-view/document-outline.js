import React, { useEffect, useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, rgba, themeVal, truncated } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import ShadowScrollbar from '@devseed-ui/shadow-scrollbar';

import {
  Panel,
  PanelHeader,
  PanelHeadline,
  PanelTitleAlt,
  PanelBody
} from '../../../styles/panel';

import { atbdContentSections } from './document-body';
import { useScrollLink } from './scroll-manager';
import { useSidePanelPositioner } from '../../../utils/use-sidepanel-positioner';

const OutlineSelf = styled(Panel).attrs({ as: 'nav' })`
  position: sticky;
  top: 0px;
  height: 100px;

  ${PanelBody} > * {
    /* Ensure the shadow scrollbar takes up the full height */
    flex: 1;
  }
`;

const OutlineMenuSelf = styled.ol`
  background: transparent;
`;

const OutlineMenuLink = styled(Heading).attrs({ as: 'a' })`
  ${truncated()}
  position: relative;
  display: block;
  font-size: 1rem;
  line-height: 1.5rem;
  padding: ${glsp(0.5, themeVal('layout.gap.medium'))};
  margin: 0;
  background-color: ${rgba(themeVal('color.link'), 0)};
  transition: all 0.24s ease-in-out 0s;

  &,
  &:visited {
    color: inherit;
  }

  &:hover {
    opacity: 1;
    background-color: ${rgba(themeVal('color.link'), 0.08)};
  }

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    width: 0.25rem;
    height: 0;
    background: ${themeVal('color.link')};
    content: '';
    pointer-events: none;
    transform: translate(0, -50%);
    transition: all 0.32s ease-in-out 0s;
  }

  &.active {
    background-color: ${rgba(themeVal('color.link'), 0.08)};
    color: ${themeVal('color.link')};

    &::before {
      height: 100%;
    }
  }

  ${OutlineMenuSelf} ${OutlineMenuSelf} & {
    padding-left: ${glsp(3)};
    font-size: 0.875rem;
  }

  ${OutlineMenuSelf} ${OutlineMenuSelf} ${OutlineMenuSelf} & {
    padding-left: ${glsp(4)};
    font-size: 0.875rem;
  }

  ${OutlineMenuSelf} ${OutlineMenuSelf} ${OutlineMenuSelf} ${OutlineMenuSelf} & {
    padding-left: ${glsp(5)};
    font-size: 0.875rem;
  }
`;

OutlineMenuLink.propTypes = {
  to: T.string
};

// Component to recursively render the outline menu.
const OutlineMenu = (props) => {
  const { items: inputItems = [], atbdDocument = {}, atbd = {} } = props;

  const { activeId, getScrollToId } = useScrollLink();

  const items = inputItems.filter((item) => {
    // Check if the item should be rendered, if a function exists.
    return typeof item.shouldRender === 'function'
      ? item.shouldRender({ document: atbdDocument, atbd })
      : true;
  });

  return items?.length ? (
    <OutlineMenuSelf>
      {items.map((item) => {
        // User defined subsections.
        const editorSubsections =
          item.editorSubsections?.(atbdDocument, item) || [];
        // Regular children.
        // If children is a function means it needs props to dynamically render
        // them, like the case of array fields.
        const resultingChildren =
          typeof item.children === 'function'
            ? item.children({ document: atbdDocument, atbd })
            : item.children;
        const children = resultingChildren || [];
        const items = [...editorSubsections, ...children];

        return (
          <li key={item.id}>
            <OutlineMenuLink
              className={activeId === item.id ? 'active' : ''}
              href={`#${item.id}`}
              title={`Go to ${item.label} section`}
              onClick={getScrollToId(item.id)}
            >
              {item.label}
            </OutlineMenuLink>
            <OutlineMenu
              items={items}
              atbdDocument={atbdDocument}
              atbd={atbd}
            />
          </li>
        );
      })}
    </OutlineMenuSelf>
  ) : null;
};

OutlineMenu.propTypes = {
  items: T.array,
  atbd: T.object,
  atbdDocument: T.object
};

// Outline panel component
export default function DocumentOutline(props) {
  const { atbd } = props;
  const { activeId } = useScrollLink();

  // Make the outline sticky by computing the height taking the header and
  // footer into account.
  const { ref: elementRef } = useSidePanelPositioner(
    useMemo(
      () => ({
        cacheElements: true,
        fn: (ref, { height, inpageHeaderHeight }) => {
          ref.current.style.height = `${height}px`;
          // Because the parent has a `position` we only need to account for the
          // inpage header height instead of the height from the top.
          ref.current.style.top = `${inpageHeaderHeight}px`;
        }
      }),
      []
    )
  );

  // If the active item has changed, ensure it is in view.
  useEffect(() => {
    if (!activeId) return;

    // Get reference to the element, using the href.
    const activeLinkElement = elementRef.current.querySelector(
      `[href="#${activeId}"]`
    );

    // For an item to be in view it has to be within the visible area of the
    // scroll container which in this case is the offsetParent.
    // The scroll area is the first parent element with a position attribute and
    // that's why using offsetParent works.
    // It is VERY IMPORTANT that this doesn't change
    const scrollArea = activeLinkElement.offsetParent;
    const scrollAreaVisibleExtent = [
      scrollArea.scrollTop,
      scrollArea.offsetHeight - scrollArea.scrollTop
    ];

    const linkTop = activeLinkElement.offsetTop;
    const linkBottom =
      activeLinkElement.offsetTop + activeLinkElement.offsetHeight;
    if (
      linkTop < scrollAreaVisibleExtent[0] ||
      linkBottom > scrollAreaVisibleExtent[1]
    ) {
      // Link is hidden. Scroll.
      scrollArea.scroll({
        // Aim for the link to be in the middle.
        top: linkTop - scrollArea.offsetHeight / 2,
        behavior: 'smooth'
      });
    }
  }, [elementRef, activeId]);

  return (
    <OutlineSelf ref={elementRef}>
      <PanelHeader>
        <PanelHeadline>
          <PanelTitleAlt>Outline</PanelTitleAlt>
        </PanelHeadline>
      </PanelHeader>
      <PanelBody>
        <ShadowScrollbar>
          <OutlineMenu
            items={atbdContentSections}
            atbd={atbd}
            atbdDocument={atbd.document}
          />
        </ShadowScrollbar>
      </PanelBody>
    </OutlineSelf>
  );
}

DocumentOutline.propTypes = {
  atbd: T.object
};
