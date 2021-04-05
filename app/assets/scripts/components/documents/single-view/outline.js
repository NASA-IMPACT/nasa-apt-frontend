import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
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

const OutlineMenu = (props) => {
  const { items } = props;

  return items?.length ? (
    <OutlineMenuSelf>
      {items.map((item) => {
        // User defined subsections.
        const editorSubsections = item.editorSubsections?.() || [];
        // Regular children.
        const children = item.children || [];
        const items = [...editorSubsections, ...children];

        return (
          <li key={item.id}>
            <OutlineMenuLink
              href={`#${item.id}`}
              title={`Go to ${item.label} section`}
            >
              {item.label}
            </OutlineMenuLink>
            <OutlineMenu items={items} />
          </li>
        );
      })}
    </OutlineMenuSelf>
  ) : null;
};

OutlineMenu.propTypes = {
  items: T.array
};

export default function Outline() {
  return (
    <OutlineSelf>
      <PanelHeader>
        <PanelHeadline>
          <PanelTitle>Outline</PanelTitle>
        </PanelHeadline>
      </PanelHeader>
      <PanelBody>
        <OutlineMenu items={atbdContentSections} />
      </PanelBody>
    </OutlineSelf>
  );
}
