import React from 'react';
import styled from 'styled-components';
import { glsp, media, themeVal } from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { Button } from '@devseed-ui/button';
import { VerticalDivider } from '@devseed-ui/toolbar';

import config from '../../config';
import { Link, NavLink } from '../../styles/clean/link';

const { appTitle } = config;

const PageHeaderSelf = styled.header`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
  align-items: center;
  background-color: ${themeVal('color.primary')};
  color: #fff;
  animation: ${reveal} 0.32s ease 0s 1;
  padding: ${glsp(1, themeVal('layout.gap.xsmall'))};

  ${media.mediumUp`
    grid-gap: ${glsp(themeVal('layout.gap.medium'))};
    padding: ${glsp(1, themeVal('layout.gap.medium'))};
  `}
`;

const PageHeadline = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  line-height: 1;
  margin: 0;
  font-weight: ${themeVal('type.heading.light')};

  a {
    color: inherit;
    display: block;
    background-image: url('https://cdn.earthdata.nasa.gov/eui/latest/docs/assets/ed-logos/app-logo.png');
    background-repeat: no-repeat;
    padding: 1.5rem 0 0.25rem 4.5rem;
    background-size: 215px 50px;

    &:hover {
      background-image: url('https://cdn.earthdata.nasa.gov/eui/latest/docs/assets/ed-logos/app-logo_hover.png');
    }

    @media only screen and (-webkit-min-device-pixel-ratio: 1.3),
      only screen and (-o-min-device-pixel-ratio: 1.3 / 1),
      only screen and (min-resolution: 125dpi),
      only screen and (min-resolution: 1.3dppx) {
      background-image: url('https://cdn.earthdata.nasa.gov/eui/latest/docs/assets/ed-logos/app-logo_2x.png');

      &:hover {
        background-image: url('https://cdn.earthdata.nasa.gov/eui/latest/docs/assets/ed-logos/app-logo_hover_2x.png');
      }
    }
  }
`;

const PageNav = styled.nav`
  display: inline-grid;
  grid-gap: ${glsp(0.5)};
  align-items: center;
  margin-left: auto;

  > * {
    grid-row: 1;
  }
`;

const GlobalMenu = styled.ul`
  display: inline-grid;
  grid-gap: ${glsp(0.5)};

  > * {
    grid-row: 1;
  }
`;

function PageHeader() {
  return (
    <PageHeaderSelf role='banner'>
      <PageHeadline>
        <PageTitle>
          <Link to='/' title='Visit the welcome page'>
            {appTitle}
          </Link>
        </PageTitle>
      </PageHeadline>
      <PageNav role='navigation'>
        <GlobalMenu>
          <li>
            <Button
              forwardedAs={NavLink}
              exact
              to='/'
              variation='achromic-plain'
              title='Visit the welcome page'
            >
              Welcome
            </Button>
          </li>
          <li>
            <Button
              forwardedAs={NavLink}
              exact
              to='/documents'
              variation='achromic-plain'
              title='View the documents'
            >
              Documents
            </Button>
          </li>
          <li>
            <Button
              forwardedAs={NavLink}
              exact
              to='/about'
              variation='achromic-plain'
              title='Learn more about the app'
            >
              About
            </Button>
          </li>
        </GlobalMenu>
        <VerticalDivider variation='light' />
        <GlobalMenu>
          <li>
            <Button
              variation='achromic-plain'
              title='Leave feedback about the app'
            >
              Feedback
            </Button>
          </li>
          <li>
            <Button
              forwardedAs={NavLink}
              exact
              to='/signin'
              variation='achromic-plain'
              title='Sign in to the app'
            >
              Sign in
            </Button>
          </li>
        </GlobalMenu>
      </PageNav>
    </PageHeaderSelf>
  );
}

export default PageHeader;
