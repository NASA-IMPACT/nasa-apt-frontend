import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import * as Scroll from 'react-scroll';
import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

import {
  Panel,
  PanelHeader,
  PanelHeadline,
  PanelTitle,
  PanelBody
} from '../../../styles/panel';
import { atbdContentSections } from './document-body';

const OutlineSelf = styled(Panel).attrs({ as: 'nav' })`
  background: transparent;
`;

const OutlineMenuSelf = styled.ol`
  background: transparent;
`;

const OutlineMenuLink = styled(Heading).attrs({ as: 'a' })`
  ${truncated()}
  display: block;
  font-size: 1rem;
  line-height: 1.5rem;
  padding: ${glsp(0.5, themeVal('layout.gap.medium'))};
  margin: 0;

  &.active {
    background-color: red;
  }

  &,
  &:visited {
    color: inherit;
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
export default function Outline(props) {
  const { atbd } = props;

  return (
    <OutlineSelf>
      <PanelHeader>
        <PanelHeadline>
          <PanelTitle>Outline</PanelTitle>
        </PanelHeadline>
      </PanelHeader>
      <PanelBody>
        <OutlineMenu items={atbdContentSections} atbdDocument={atbd.document} />
      </PanelBody>
    </OutlineSelf>
  );
}

Outline.propTypes = {
  atbd: T.object
};
