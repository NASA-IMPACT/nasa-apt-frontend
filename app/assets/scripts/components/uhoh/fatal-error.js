import React from 'react';
import T from 'prop-types';
import styled, { keyframes } from 'styled-components';
import * as Sentry from "@sentry/react";
import { antialiased, glsp } from '@devseed-ui/theme-provider';

import { baseUrl } from '../../config';
import { starsImage, earthImage, satelliteImage } from './images';
import Constrainer from '../../styles/constrainer';

const rotateAnim = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
`;

const glitchAnim = keyframes`
  0% {
    top: -7px;
  }
  2% {
    top: -7px;
  }
  3% {
    top: 0px;
  }
  30% {
    top: 0px;
  }
  31% {
    top: -10px;
  }
  33% {
    top: -10px;
  }
  34% {
    top: 10px;
  }
  36% {
    top: 10px;
  }
  37% {
    top: 0px;
  }
  80% {
    top: 0px;
  }
  81% {
    top: 5px;
  }
  83% {
    top: 5px;
  }
  84% {
    top: 10px;
  }
  87% {
    top: 10px;
  }
  88% {
    top: 0px;
  }
  99% {
    top: 0px;
  } 
`;

const Page = styled.div`
  ${antialiased()}
  min-height: 100vh;
  background: url(${starsImage});
`;

const PageHeader = styled.header`
  text-align: center;
  padding: ${glsp(3, 1, 3, 1)};
`;

const Title = styled.h1`
  color: #fff;
  font-size: 3rem;
  margin: 0;
`;

const PageBody = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  color: #fff;
`;

const Message = styled.div`
  margin-bottom: ${glsp(2)};

  > *:not(:last-child) {
    margin-bottom: ${glsp(1)};
  }
`;

const EarthAnim = styled.div`
  width: 300px;
  height: 300px;
  background: url(${earthImage});
  overflow: hidden;

  > div {
    position: relative;
    width: 300px;
    height: 300px;
    background: url(${satelliteImage});
    animation: cubic-bezier(0.45, 1.2, 0.81, -0.42) 10s infinite ${rotateAnim},
      linear 5s infinite ${glitchAnim};
  }
`;

const ErrorDetails = styled.details`
  text-align: left;

  summary {
    text-align: center;
  }

  > strong {
    display: block;
    font-size: 1.5rem;
    margin-bottom: ${glsp()};
  }
`;

const ErrorLine = styled.p`
  margin-bottom: ${glsp()};

  small {
    display: block;
  }
`;

export default class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { error: error };
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, { componentStack }) {
    Sentry.captureException(error, { contexts: { react: { componentStack } } });
  }

  render() {
    return this.state.error ? (
      <Page>
        <PageHeader>
          <Title>Server Error</Title>
        </PageHeader>
        <PageBody>
          <Message>
            <p>
              Something went wrong and we were not able to fulfill your request.
              This is on our side and we&apos;ll fix it!
            </p>
            <p>
              In the meantime you can try again by refreshing the page or visit
              the{' '}
              <a href={`${baseUrl}/`} title='Visit homepage'>
                APT homepage
              </a>
              .
            </p>
            <p>
              If this error keeps on happening you can reach us via{' '}
              <a href='mailto:email@example.org' title='Send us an email'>
                email@example.org
              </a>
            </p>
          </Message>
          <EarthAnim>
            <div />
          </EarthAnim>
          <PrettyError error={this.state.error} />
        </PageBody>
      </Page>
    ) : (
      // eslint-disable-next-line react/prop-types
      this.props.children
    );
  }
}

function PrettyError({ error }) {
  const stack = error.stack.split('\n');

  return (
    <Constrainer>
      <ErrorDetails>
        <summary>Error details</summary>
        <strong>
          {error.name}: {error.message}
        </strong>
        {stack.map((l, i) => {
          const [name, path] = l.split(/@(.*)/);
          return (
            /* eslint-disable-next-line react/no-array-index-key */
            <ErrorLine key={i}>
              {name}
              <small>{path}</small>
            </ErrorLine>
          );
        })}
      </ErrorDetails>
    </Constrainer>
  );
}

PrettyError.propTypes = {
  error: T.object
};
