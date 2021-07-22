import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import App from '../common/app';
import Constrainer from '../../styles/constrainer';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';
import Prose from '../../styles/typography/prose';
import SandboxEditor from './editor';
import SandboxForms from './forms';
import SandboxInteractive from './interactive';
import SandboxStructure from './structure';
import SandboxStickyStructure from './structure/sticky';
import SandboxElements from './elements';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

function Sandbox() {
  // The `path` lets us build <Route> paths that are relative to the parent
  // route, while the `url` lets us build relative links.
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/editor`} component={SandboxEditor} />
      <Route exact path={`${path}/forms`} component={SandboxForms} />
      <Route
        exact
        path={`${path}/interactive`}
        component={SandboxInteractive}
      />
      <Route exact path={`${path}/structure`} component={SandboxStructure} />
      <Route
        exact
        path={`${path}/structure/sticky`}
        component={SandboxStickyStructure}
      />
      <Route exact path={`${path}/elements`} component={SandboxElements} />
      <Route>
        <App pageTitle='Sandbox'>
          <Inpage>
            <InpageHeader>
              <InpageHeadline>
                <InpageTitle>Sandbox</InpageTitle>
              </InpageHeadline>
            </InpageHeader>
            <InpageBodyScroll>
              <Constrainer>
                <Prose>
                  <h6>Contents</h6>
                  <ol>
                    <li>
                      <Link to={`${url}/editor`} title='View sandbox page'>
                        Editor
                      </Link>
                    </li>
                    <li>
                      <Link to={`${url}/forms`} title='View sandbox page'>
                        Forms
                      </Link>
                    </li>
                    <li>
                      <Link to={`${url}/structure`} title='View sandbox page'>
                        Structure
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`${url}/structure/sticky`}
                        title='View sandbox page'
                      >
                        Structure sticky
                      </Link>
                    </li>
                    <li>
                      <Link to={`${url}/interactive`} title='View sandbox page'>
                        Interactive
                      </Link>
                    </li>
                    <li>
                      <Link to={`${url}/elements`} title='View sandbox page'>
                        Elements
                      </Link>
                    </li>
                  </ol>
                </Prose>
              </Constrainer>
            </InpageBodyScroll>
          </Inpage>
        </App>
      </Route>
    </Switch>
  );
}

export default Sandbox;
