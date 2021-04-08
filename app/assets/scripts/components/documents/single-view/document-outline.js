import React, { useEffect, useRef } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash.throttle';
import { glsp, rgba, themeVal, truncated } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import ShadowScrollbar from '@devseed-ui/shadow-scrollbar';

import {
  Panel,
  PanelHeader,
  PanelHeadline,
  PanelTitle,
  PanelBody
} from '../../../styles/panel';
import { atbdContentSections } from './document-body';
import { useScrollLink } from './scroll-manager';

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
    padding-left: ${glsp(2.5)};
  }

  ${OutlineMenuSelf} ${OutlineMenuSelf} ${OutlineMenuSelf} & {
    padding-left: ${glsp(3)};
  }

  ${OutlineMenuSelf} ${OutlineMenuSelf} ${OutlineMenuSelf} ${OutlineMenuSelf} & {
    padding-left: ${glsp(3.5)};
  }
`;

OutlineMenuLink.propTypes = {
  to: T.string
};

// Component to recursively render the outline menu.
const OutlineMenu = (props) => {
  const { items, atbdDocument = {} } = props;

  const { activeId, getScrollToId } = useScrollLink();

  return items?.length ? (
    <OutlineMenuSelf>
      {items.map((item) => {
        // User defined subsections.
        const editorSubsections = item.editorSubsections?.(atbdDocument) || [];
        // Regular children.
        // If children is a function means it needs props to dynamically render
        // them, like the case of array fields.
        const resultingChildren =
          typeof item.children === 'function'
            ? item.children({ document: atbdDocument })
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
            <OutlineMenu items={items} atbdDocument={atbdDocument} />
          </li>
        );
      })}
    </OutlineMenuSelf>
  ) : null;
};

OutlineMenu.propTypes = {
  items: T.array,
  atbdDocument: T.object
};

// Outline panel component
export default function DocumentOutline(props) {
  const { atbd } = props;
  const { activeId } = useScrollLink();

  const headerElRef = useRef(null);
  const footerElRef = useRef(null);
  const elementRef = useRef(null);

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
  }, [activeId]);

  // Make the outline sticky by computing the height taking the header and
  // footer into account.
  useEffect(() => {
    const positioner = throttle(() => {
      if (!headerElRef.current) {
        headerElRef.current = document.querySelector(
          '[data-element="inpage-header"]'
        );
      }

      if (!footerElRef.current) {
        footerElRef.current = document.querySelector('[data-element="footer"]');
      }

      const { top, height } = headerElRef.current.getBoundingClientRect();
      // The header end represents to distance of the header plus anything else
      // between it and the top of the viewport,
      const headerEnd = top + height;

      let visibleFooterHeight = 0;
      if (footerElRef.current) {
        const { top } = footerElRef.current.getBoundingClientRect();
        visibleFooterHeight = Math.max(0, window.innerHeight - top);
      }

      const finalElementHeight = Math.max(
        0,
        window.innerHeight - visibleFooterHeight - headerEnd
      );

      elementRef.current.style.height = `${finalElementHeight}px`;
      elementRef.current.style.top = `${height}px`;
    }, 16);

    // Using requestAnimationFrame with a lodash throttle is the best way to
    // ensure the outline position is appropriately calculated.
    let rafId;
    const rafRun = () => {
      positioner();
      rafId = requestAnimationFrame(rafRun);
    };

    rafRun();

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <OutlineSelf ref={elementRef}>
      <PanelHeader>
        <PanelHeadline>
          <PanelTitle>Outline</PanelTitle>
        </PanelHeadline>
      </PanelHeader>
      <PanelBody>
        <ShadowScrollbar>
          <OutlineMenu
            items={atbdContentSections}
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
