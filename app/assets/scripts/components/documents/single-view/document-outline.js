import React, { useEffect, useRef } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import * as Scroll from 'react-scroll';
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

// The scroll element needed for the smooth scrolling and active navigation
// links.
const ScrollLink = Scroll.ScrollLink(OutlineMenuLink);

const OutlineMenuScrollLink = (props) => {
  const { to, ...rest } = props;

  return (
    <ScrollLink
      to={to}
      href={`#${to}`}
      spy={true}
      hashSpy={true}
      duration={500}
      smooth={true}
      offset={-96}
      activeClass='active'
      {...rest}
    />
  );
};

OutlineMenuScrollLink.propTypes = {
  to: T.string
};

// Component to recursively render the outline menu.
const OutlineMenu = (props) => {
  const { items, atbdDocument = {} } = props;

  return items?.length ? (
    <OutlineMenuSelf>
      {items.map((item) => {
        // User defined subsections.
        const editorSubsections = item.editorSubsections?.(atbdDocument) || [];
        // Regular children.
        const children = item.children || [];
        const items = [...editorSubsections, ...children];

        return (
          <li key={item.id}>
            <OutlineMenuScrollLink
              to={item.id}
              title={`Go to ${item.label} section`}
            >
              {item.label}
            </OutlineMenuScrollLink>
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

  const headerElRef = useRef(null);
  const footerElRef = useRef(null);
  const elementRef = useRef(null);

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
