import React from 'react';
import styled from 'styled-components';

import { rgba, themeVal } from '@devseed-ui/theme-provider';

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
  InpageSubtitle
} from '../../../styles/inpage';

import Constrainer from '../../../styles/constrainer';
import Prose from '../../../styles/typography/prose';

const InpageHeaderSticky = styled(InpageHeader)`
  position: sticky;
  top: 0;
`;

const InpageBodySticky = styled(InpageBody)`
  /* position: sticky;
  top: 0; */
`;

const Canvas = styled.div`
  /* position: sticky;
  top: 0; */
  display: grid;
  grid-template-columns: min-content 1fr;
  /* max-height: 100vh; */

  > * {
    grid-row: 1;
  }
`;

const CanvasAside = styled.div`
  background: ${rgba(themeVal('color.primary'), 0.24)};
  position: sticky;
  /* top: 84px; */
  height: min-content;
  border: 1px solid red;
  top: 84px;
  height: calc(100vh - 84px - 72px);
`;

const CanvasContent = styled.div`
  background: ${rgba(themeVal('color.primary'), 0.16)};
  /* position: sticky;
  top: 0; */
`;

function SandboxStructure() {
  return (
    <App pageTitle='Sandbox/Structure'>
      <Inpage>
        <InpageHeaderSticky>
          <InpageHeadline>
            <InpageTitle>
              GPM Integrated Multi-Satellite Retrievals for GPM (IMERG)
              Algorithm Theoretical Basis Document
            </InpageTitle>
            <InpageHeadNav role='navigation'>
              <BreadcrumbMenu>
                <li>
                  <strong>V1.0</strong>
                </li>
                <li>
                  <Button to='/' variation='achromic-plain' title='Create new'>
                    Viewing
                  </Button>
                </li>
              </BreadcrumbMenu>
            </InpageHeadNav>
          </InpageHeadline>
          <InpageMeta>
            <dt>Under</dt>
            <InpageSubtitle as='dd'>
              <Link to='/sandbox' title='Visit Sandbox hub'>
                Sandbox
              </Link>
            </InpageSubtitle>
            <dt>Status</dt>
            <dd>
              <StatusPill status='draft' completeness={56} />
            </dd>
            <dt>Discussion</dt>
            <dd>
              <a href='#' title='View threads'>
                2 unsolved threads
              </a>
            </dd>
          </InpageMeta>
          <InpageActions>
            <Button to='/' variation='achromic-plain' title='Create new'>
              Button 1A
            </Button>
            <VerticalDivider variation='light' />
            <Button to='/' variation='achromic-plain' title='Create new'>
              Button 2A
            </Button>
            <Button to='/' variation='achromic-plain' title='Create new'>
              Button 2B
            </Button>
          </InpageActions>
        </InpageHeaderSticky>
        <InpageBodySticky>
          <Canvas>
            <CanvasAside>
              <p>Aside</p>
              <p>Aside</p>
              <p>Aside</p>
              <p>Aside</p>
              <p>Aside</p>
              <p>Aside</p>
              <p>Aside</p>
              <p>Aside</p>
              <p>Aside</p>
              <p>Aside</p>
              <p>Aside</p>
            </CanvasAside>
            <CanvasContent>
              <Constrainer>
                <Prose>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer a tellus eu arcu ultrices dictum in eu ante.
                    Vestibulum rutrum nulla quis felis faucibus finibus. Aenean
                    sit amet faucibus mi. Integer at semper ante. In tempus erat
                    sed tincidunt luctus. In tempus volutpat eros. In egestas
                    sapien sit amet felis facilisis, ac maximus nulla porttitor.
                    Sed commodo placerat ligula nec tristique. Maecenas interdum
                    augue urna, vitae pellentesque arcu porta id. Integer
                    vestibulum faucibus porta. Vestibulum ante ipsum primis in
                    faucibus orci luctus et ultrices posuere cubilia curae;
                    Fusce mattis purus at ligula porttitor euismod in sit amet
                    felis. Praesent eget imperdiet felis. Praesent urna nunc,
                    elementum a enim eget, lacinia ullamcorper neque. Integer
                    fermentum ac velit a condimentum. Nam nec urna faucibus,
                    dictum felis nec, dignissim justo.{' '}
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer a tellus eu arcu ultrices dictum in eu ante.
                    Vestibulum rutrum nulla quis felis faucibus finibus. Aenean
                    sit amet faucibus mi. Integer at semper ante. In tempus erat
                    sed tincidunt luctus. In tempus volutpat eros. In egestas
                    sapien sit amet felis facilisis, ac maximus nulla porttitor.
                    Sed commodo placerat ligula nec tristique. Maecenas interdum
                    augue urna, vitae pellentesque arcu porta id. Integer
                    vestibulum faucibus porta. Vestibulum ante ipsum primis in
                    faucibus orci luctus et ultrices posuere cubilia curae;
                    Fusce mattis purus at ligula porttitor euismod in sit amet
                    felis. Praesent eget imperdiet felis. Praesent urna nunc,
                    elementum a enim eget, lacinia ullamcorper neque. Integer
                    fermentum ac velit a condimentum. Nam nec urna faucibus,
                    dictum felis nec, dignissim justo.{' '}
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer a tellus eu arcu ultrices dictum in eu ante.
                    Vestibulum rutrum nulla quis felis faucibus finibus. Aenean
                    sit amet faucibus mi. Integer at semper ante. In tempus erat
                    sed tincidunt luctus. In tempus volutpat eros. In egestas
                    sapien sit amet felis facilisis, ac maximus nulla porttitor.
                    Sed commodo placerat ligula nec tristique. Maecenas interdum
                    augue urna, vitae pellentesque arcu porta id. Integer
                    vestibulum faucibus porta. Vestibulum ante ipsum primis in
                    faucibus orci luctus et ultrices posuere cubilia curae;
                    Fusce mattis purus at ligula porttitor euismod in sit amet
                    felis. Praesent eget imperdiet felis. Praesent urna nunc,
                    elementum a enim eget, lacinia ullamcorper neque. Integer
                    fermentum ac velit a condimentum. Nam nec urna faucibus,
                    dictum felis nec, dignissim justo.{' '}
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer a tellus eu arcu ultrices dictum in eu ante.
                    Vestibulum rutrum nulla quis felis faucibus finibus. Aenean
                    sit amet faucibus mi. Integer at semper ante. In tempus erat
                    sed tincidunt luctus. In tempus volutpat eros. In egestas
                    sapien sit amet felis facilisis, ac maximus nulla porttitor.
                    Sed commodo placerat ligula nec tristique. Maecenas interdum
                    augue urna, vitae pellentesque arcu porta id. Integer
                    vestibulum faucibus porta. Vestibulum ante ipsum primis in
                    faucibus orci luctus et ultrices posuere cubilia curae;
                    Fusce mattis purus at ligula porttitor euismod in sit amet
                    felis. Praesent eget imperdiet felis. Praesent urna nunc,
                    elementum a enim eget, lacinia ullamcorper neque. Integer
                    fermentum ac velit a condimentum. Nam nec urna faucibus,
                    dictum felis nec, dignissim justo.{' '}
                  </p>
                </Prose>
              </Constrainer>
            </CanvasContent>
          </Canvas>
        </InpageBodySticky>
      </Inpage>
    </App>
  );
}

export default SandboxStructure;
