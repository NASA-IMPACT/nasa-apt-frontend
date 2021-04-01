import React from 'react';
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

const OutlineSelf = styled(Panel).attrs({ as: 'nav' })`
  background: transparent;
`;

const OutlineMenu = styled.ol`
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
`;

export default function Outline() {
  return (
    <OutlineSelf>
      <PanelHeader>
        <PanelHeadline>
          <PanelTitle>Outline</PanelTitle>
        </PanelHeadline>
      </PanelHeader>
      <PanelBody>
        <OutlineMenu>
          <li>
            <OutlineMenuLink href='#' title='Jump to item'>
              Entry 1.0
            </OutlineMenuLink>
          </li>
          <li>
            <OutlineMenuLink href='#' title='Jump to item'>
              Entry 2.0
            </OutlineMenuLink>
            <OutlineMenu>
              <li>
                <OutlineMenuLink href='#' title='Jump to item'>
                  Entry 2.1
                </OutlineMenuLink>
              </li>
              <li>
                <OutlineMenuLink href='#' title='Jump to item'>
                  Entry 2.2
                </OutlineMenuLink>
              </li>
            </OutlineMenu>
          </li>
          <li>
            <OutlineMenuLink href='#' title='Jump to item'>
              Entry 3.0
            </OutlineMenuLink>
            <OutlineMenu>
              <li>
                <OutlineMenuLink href='#' title='Jump to item'>
                  Entry 3.1
                </OutlineMenuLink>
              </li>
              <li>
                <OutlineMenuLink href='#' title='Jump to item'>
                  Entry 3.2
                </OutlineMenuLink>
                <OutlineMenu>
                  <li>
                    <OutlineMenuLink href='#' title='Jump to item'>
                      Entry 3.2.1
                    </OutlineMenuLink>
                  </li>
                  <li>
                    <OutlineMenuLink href='#' title='Jump to item'>
                      Entry 3.2.2
                    </OutlineMenuLink>
                  </li>
                </OutlineMenu>
              </li>
            </OutlineMenu>
          </li>
        </OutlineMenu>
      </PanelBody>
    </OutlineSelf>
  );
}
