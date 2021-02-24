import React from 'react';
import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';
import { glsp, themeVal, antialiased } from '@devseed-ui/theme-provider';

import config from '../../config';
import Constrainer from '../../styles/constrainer';

const { appTitle } = config;

const PageHead = styled.header`
  ${antialiased()}
  padding: ${glsp(1, 0)};
  background-color: ${themeVal('color.primary')};
  color: #fff;
`;

const PageHeadInner = styled(Constrainer)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
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
  display: flex;
  margin: 0 0 0 auto;
`;

const GlobalMenu = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 0;
  list-style: none;

  > * {
    margin: ${glsp(0, 0, 0, 2)};
  }

  a {
    position: relative;
    font-weight: ${themeVal('type.base.regular')};
    text-transform: uppercase;
    color: inherit;

    &.active {
      font-weight: ${themeVal('type.base.bold')};
    }
  }

  .active::before {
    position: absolute;
    bottom: -0.25rem;
    width: 2rem;
    height: 0.125rem;
    background: #ffffff;
    content: '';
  }
`;

function PageHeader() {
  return (
    <PageHead role='banner'>
      <PageHeadInner>
        <div>
          <PageTitle>
            <Link to='/' title='Go to Homepage'>
              {appTitle}
            </Link>
          </PageTitle>
        </div>
        <PageNav role='navigation'>
          <GlobalMenu>
            <li>
              <NavLink exact to='/about' title='View About APT page'>
                <span>About</span>
              </NavLink>
            </li>
          </GlobalMenu>
        </PageNav>
      </PageHeadInner>
    </PageHead>
  );
}

export default PageHeader;
