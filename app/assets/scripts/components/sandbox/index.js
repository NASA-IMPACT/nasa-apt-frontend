import React from 'react';
import { Link } from 'react-router-dom';
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

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

function Sandbox() {
  return (
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
                  <Link to='/sandbox/editor' title='View sandbox page'>
                    Editor
                  </Link>
                </li>
                <li>
                  <Link to='/sandbox/forms' title='View sandbox page'>
                    Forms
                  </Link>
                </li>
                <li>
                  <Link to='/sandbox/structure' title='View sandbox page'>
                    Structure
                  </Link>
                </li>
              </ol>
            </Prose>
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default Sandbox;
