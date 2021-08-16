import React from 'react';
import styled from 'styled-components';

import App from '../../common/app';
import StatusPill from '../../common/status-pill';

import { Link } from '../../../styles/clean/link';

import { Button } from '@devseed-ui/button';
import { VerticalDivider } from '@devseed-ui/toolbar';

import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageMeta,
  InpageHeadNav,
  BreadcrumbMenu,
  InpageActions,
  InpageBody,
  InpageSubtitle,
  InpageHeadHgroup
} from '../../../styles/inpage';

import Constrainer from '../../../styles/constrainer';
import Prose from '../../../styles/typography/prose';
import { ContentBlock } from '../../../styles/content-block';

const InpageHeaderSticky = styled(InpageHeader)`
  position: sticky;
  top: 0;
`;

function SandboxStructure() {
  return (
    <App pageTitle='Sandbox/Structure'>
      <Inpage>
        <InpageHeaderSticky>
          <InpageHeadline>
            <InpageHeadHgroup>
              <InpageTitle>
                GPM Integrated Multi-Satellite Retrievals for GPM (IMERG)
                Algorithm Theoretical Basis Document
              </InpageTitle>
            </InpageHeadHgroup>
            <InpageSubtitle>
              <Link to='/sandbox' title='Visit Sandbox hub'>
                Sandbox
              </Link>
            </InpageSubtitle>
          </InpageHeadline>
        </InpageHeaderSticky>
        <InpageBody>
          <ContentBlock>
            <Prose>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                a tellus eu arcu ultrices dictum in eu ante. Vestibulum rutrum
                nulla quis felis faucibus finibus. Aenean sit amet faucibus mi.
                Integer at semper ante. In tempus erat sed tincidunt luctus. In
                tempus volutpat eros. In egestas sapien sit amet felis
                facilisis, ac maximus nulla porttitor. Sed commodo placerat
                ligula nec tristique. Maecenas interdum augue urna, vitae
                pellentesque arcu porta id. Integer vestibulum faucibus porta.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia curae; Fusce mattis purus at ligula porttitor
                euismod in sit amet felis. Praesent eget imperdiet felis.
                Praesent urna nunc, elementum a enim eget, lacinia ullamcorper
                neque. Integer fermentum ac velit a condimentum. Nam nec urna
                faucibus, dictum felis nec, dignissim justo.{' '}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                a tellus eu arcu ultrices dictum in eu ante. Vestibulum rutrum
                nulla quis felis faucibus finibus. Aenean sit amet faucibus mi.
                Integer at semper ante. In tempus erat sed tincidunt luctus. In
                tempus volutpat eros. In egestas sapien sit amet felis
                facilisis, ac maximus nulla porttitor. Sed commodo placerat
                ligula nec tristique. Maecenas interdum augue urna, vitae
                pellentesque arcu porta id. Integer vestibulum faucibus porta.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia curae; Fusce mattis purus at ligula porttitor
                euismod in sit amet felis. Praesent eget imperdiet felis.
                Praesent urna nunc, elementum a enim eget, lacinia ullamcorper
                neque. Integer fermentum ac velit a condimentum. Nam nec urna
                faucibus, dictum felis nec, dignissim justo.{' '}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                a tellus eu arcu ultrices dictum in eu ante. Vestibulum rutrum
                nulla quis felis faucibus finibus. Aenean sit amet faucibus mi.
                Integer at semper ante. In tempus erat sed tincidunt luctus. In
                tempus volutpat eros. In egestas sapien sit amet felis
                facilisis, ac maximus nulla porttitor. Sed commodo placerat
                ligula nec tristique. Maecenas interdum augue urna, vitae
                pellentesque arcu porta id. Integer vestibulum faucibus porta.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia curae; Fusce mattis purus at ligula porttitor
                euismod in sit amet felis. Praesent eget imperdiet felis.
                Praesent urna nunc, elementum a enim eget, lacinia ullamcorper
                neque. Integer fermentum ac velit a condimentum. Nam nec urna
                faucibus, dictum felis nec, dignissim justo.{' '}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                a tellus eu arcu ultrices dictum in eu ante. Vestibulum rutrum
                nulla quis felis faucibus finibus. Aenean sit amet faucibus mi.
                Integer at semper ante. In tempus erat sed tincidunt luctus. In
                tempus volutpat eros. In egestas sapien sit amet felis
                facilisis, ac maximus nulla porttitor. Sed commodo placerat
                ligula nec tristique. Maecenas interdum augue urna, vitae
                pellentesque arcu porta id. Integer vestibulum faucibus porta.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia curae; Fusce mattis purus at ligula porttitor
                euismod in sit amet felis. Praesent eget imperdiet felis.
                Praesent urna nunc, elementum a enim eget, lacinia ullamcorper
                neque. Integer fermentum ac velit a condimentum. Nam nec urna
                faucibus, dictum felis nec, dignissim justo.{' '}
              </p>
            </Prose>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default SandboxStructure;
