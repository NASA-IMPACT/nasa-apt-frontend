import React from 'react';
import styled from 'styled-components/macro';
import { Link, withRouter, NavLink } from 'react-router-dom';

import Constrainer from '../../styles/constrainer';
import AuthBox from './AuthBox';

import { antialiased } from '../../styles/helpers';
import { themeVal } from '../../styles/utils/general';
import { multiply } from '../../styles/utils/math';
import { VerticalDivider } from '../../styles/divider';

const PageHead = styled.header`
  ${antialiased()}
  background-color: ${themeVal('color.primary')};
  color: #FFF;
`;

const PageHeadInner = styled(Constrainer)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

const PageHeadline = styled.div`

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

    @media only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 1.3 / 1), only screen and (min-resolution: 125dpi), only screen and (min-resolution: 1.3dppx) {
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

  ${VerticalDivider} {
    height: 1.5rem;
  }
`;

const GlobalMenu = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 0;
  list-style: none;

  > * {
    margin: 0 0 0 ${multiply(themeVal('layout.space'), 2)};
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
    background: #FFFFFF;
    content: '';
  }
`;

class PageHeader extends React.PureComponent {
  render() {
    return (
      <PageHead>
        <PageHeadInner>
          <PageHeadline>
            <PageTitle>
              <Link to="/" title="Go to Homepage">Algorithm Publication Tool</Link>
            </PageTitle>
          </PageHeadline>
          <PageNav>
            <GlobalMenu>
              <li><NavLink exact to="/atbds" title="View ATBD list page"><span>Documents</span></NavLink></li>
              <li><NavLink exact to="/about" title="View About APT page"><span>About</span></NavLink></li>
              <li><NavLink to="/help" title="View Help page"><span>Help</span></NavLink></li>
            </GlobalMenu>
            <VerticalDivider />
            <AuthBox />
          </PageNav>
        </PageHeadInner>
      </PageHead>
    );
  }
}

export default withRouter(PageHeader);
