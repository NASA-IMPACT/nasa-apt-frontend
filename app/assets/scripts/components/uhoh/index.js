import React from 'react';
import styled, { keyframes } from 'styled-components';
import { antialiased, glsp } from '@devseed-ui/theme-provider';

import App from '../common/app';
import { Inpage, InpageBody } from '../../styles/inpage';

import { starsImage, earthImage, satelliteImage } from './images';

const rotateAnim = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-36000deg);
  }
`;

const UhOhHeader = styled.header`
  text-align: center;
  padding: ${glsp(4, 1, 1, 1)};
`;

const UhOhTitle = styled.h1`
  color: #fff;
  font-size: 2rem;
  margin: 0;
`;

const InpageBodyInnerUhOh = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  color: #fff;
`;

const InpageUhOh = styled(Inpage)`
  ${antialiased()}
  background: url(${starsImage});
`;

const EarthAnim = styled.div`
  margin-top: 3rem;
  width: 300px;
  height: 300px;
  background: url(${earthImage});

  > div {
    width: 300px;
    height: 300px;
    background: url(${satelliteImage});
    animation: 1000s linear 1s infinite ${rotateAnim};
  }
`;

function UhOh() {
  return (
    <App pageTitle='Not Found'>
      <InpageUhOh>
        <UhOhHeader>
          <UhOhTitle>Page not found</UhOhTitle>
        </UhOhHeader>
        <InpageBody>
          <InpageBodyInnerUhOh>
            <p>
              We were not able to find the page you are looking for. It may have
              been archived or removed.
            </p>
            <p>
              If you think this page should be here let us know via{' '}
              <a href='mailto:email@example.org' title='Send us an email'>
                email@example.org
              </a>
            </p>
            <EarthAnim>
              <div />
            </EarthAnim>
          </InpageBodyInnerUhOh>
        </InpageBody>
      </InpageUhOh>
    </App>
  );
}

export default UhOh;
