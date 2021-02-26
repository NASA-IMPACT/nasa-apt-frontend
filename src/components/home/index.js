import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { rgba } from 'polished';

import { Inpage, InpageBody, InpageBodyInner } from '../common/Inpage';
import Constrainer from '../../styles/constrainer';
import Button from '../../styles/button/button';

import { stylizeFunction, themeVal } from '../../styles/utils/general';
import collecticon from '../../styles/collecticons';
import { glsp } from '../../styles/utils/theme-values';
import { getAppURL } from '../../store/store';

const _rgba = stylizeFunction(rgba);

const HomeInpage = styled(Inpage)`
  position: relative;
  padding: ${glsp(4, 0, 2, 0)};
  overflow: hidden;

  &::before {
    ${() => {
    // Remove trailing url if exists.
    const loc = getAppURL().cleanHref;
    return css`
        background-image: url(${loc}/assets/graphics/layout/welcome-illu.svg);
      `;
  }}
    display: block;
    content: '';
    width: 40rem;
    height: 55rem;
    position: absolute;
    /*
    content start: (100vw - min(1280px, 100vw)) / 2
    position left: min(56rem, 100vw)
    */
    left: calc((100vw - min(1280px, 100vw)) / 2 + min(56rem, 100vw));
    top: 4rem;
  }
`;

const HomeHeader = styled.header``;

const HomeHeaderInner = styled(Constrainer)`
  display: grid;
  grid-gap: ${glsp(2)};
  padding-top: 0;
  padding-bottom: 0;
`;

const HomeHeadline = styled.div`
  max-width: 48rem;
`;
const HomeHeaderActions = styled.div`
  display: grid;
  grid-template-columns: min-content min-content;
  grid-gap: ${glsp(0.5, 1)};
`;

const HomeTitle = styled.h1`
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: ${themeVal("type.base.bold")};
  margin: ${glsp(0, 0, 0.5, 0)};
`;

const Sep = styled.span`
  font-size: 0;
  display: inline-flex;
  height: 100%;
  width: 0.125rem;
  background: ${_rgba(themeVal("color.base"), 0.16)};
  vertical-align: top;
  margin: 0 0.25rem;
`;


const HomeLead = styled.p`
  font-size: 2rem;
  line-height: 2.25rem;
  font-weight: ${themeVal('type.base.bold')};
`;

const FocusBoxList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp(3, 2)};
  max-width: 48rem;
`;

const FocusBox = styled.div`
  display: grid;
  grid-gap: ${glsp()};
`;

const FocusBoxTitle = styled.h2`
  display: grid;
  grid-template-columns: min-content auto;
  grid-gap: ${glsp()};
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: ${themeVal("type.base.bold")};

  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
    color: ${themeVal("color.primary")};
    background-color: ${_rgba(themeVal("color.primary"), 0.16)};
    border-radius: ${themeVal("shape.rounded")};
  }
`;

const FocusBoxContent = styled.div``;

const LoginLink = styled.a`
  grid-column: 2;
  font-size: 0.875rem;
  text-align: center;
`;

class Home extends Component {
  render() {
    // Since the login doesn't have a page, fake a click on the dropdown trigger.
    const onLoginLinkClick = (e) => {
      e.preventDefault();
      // Defer to next tick otherwise event delegation will automatically close
      // the login dropdown.
      setTimeout(() => {
        const el = document.querySelector('#login-box-trigger');
        if (el) {
          el.click();
        }
      }, 1);
    };

    return (
      <HomeInpage>
        <HomeHeader>
          <HomeHeaderInner>
            <HomeHeadline>
              <HomeTitle>
                APT <Sep>&mdash;</Sep> The Algorithm Publication Tool
              </HomeTitle>
              <HomeLead>
                Enabling open science by making it easier to write and find key
                scientific documents
              </HomeLead>
            </HomeHeadline>
            <HomeHeaderActions>
              <Button
                forwardedAs={Link}
                variation="primary-raised-light"
                to="/about"
                title="View the about page"
              >
                Learn more
              </Button>
              <Button
                forwardedAs={Link}
                variation="primary-raised-dark"
                to="/atbds"
                title="View the ATBDs page"
              >
                Explore the ATBD&apos;s
              </Button>
              <LoginLink
                href="#"
                title="Open the login box"
                onClick={onLoginLinkClick}
              >
                Or login to create one
              </LoginLink>
            </HomeHeaderActions>
          </HomeHeaderInner>
        </HomeHeader>
        <InpageBody>
          <InpageBodyInner>
            <FocusBoxList>
              <li>
                <FocusBox>
                  <FocusBoxTitle useIcon="pencil">
                    Streamlined writing process
                  </FocusBoxTitle>
                  <FocusBoxContent>
                    APT makes it easy to create compliant ATBDs by walking you
                    through a standardized document template. Want to add
                    additional content? APT lets you add additional information
                    as needed APT’s centralized location makes it simple to
                    collaborate with your team on writing.
                  </FocusBoxContent>
                </FocusBox>
              </li>
              <li>
                <FocusBox>
                  <FocusBoxTitle useIcon="wrench">
                    User-friendly<br /> tools
                  </FocusBoxTitle>
                  <FocusBoxContent>
                    Easily generate properly formatted equations, tables and
                    figures using APT’s LaTex tools. Quickly format text using
                    APT’s rich text editor. Efficiently manage references and
                    citations using APT’s Bibtex citation manager.
                  </FocusBoxContent>
                </FocusBox>
              </li>
              <li>
                <FocusBox>
                  <FocusBoxTitle useIcon="eye">
                    Visually appealing documents
                  </FocusBoxTitle>
                  <FocusBoxContent>
                    Preview selected ATBD as an HTML webpage or a PDF document.
                  </FocusBoxContent>
                </FocusBox>
              </li>
              <li>
                <FocusBox>
                  <FocusBoxTitle useIcon="expand-top-right">
                    Straightforward journal submission
                  </FocusBoxTitle>
                  <FocusBoxContent>
                    Preview selected ATBD as an HTML webpage or a PDF document.
                  </FocusBoxContent>
                </FocusBox>
              </li>
            </FocusBoxList>
          </InpageBodyInner>
        </InpageBody>
      </HomeInpage>
    );
  }
}

export default Home;
