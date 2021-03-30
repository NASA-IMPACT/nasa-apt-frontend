import React from 'react';
import styled from 'styled-components';

import { glsp, media, rgba, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import collecticon from '@devseed-ui/collecticons';

import App from '../common/app';

import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';

import UniversalGridder from '../../styles/universal-gridder';

const HomeInpageHeader = styled(InpageHeader)`
  max-height: 0;
  padding: 0;
  overflow: hidden;
`;

const HomeContent = styled(UniversalGridder).attrs({
  as: 'div',
  grid: {
    smallUp: ['full-start', 'full-end'],
    mediumUp: ['full-start', 'full-end'],
    largeUp: ['full-start', 'full-end']
  }
})`
  padding: ${glsp(themeVal('layout.gap.xsmall'), 0)};
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
  height: 100%;

  ${media.mediumUp`
    padding: ${glsp(themeVal('layout.gap.medium'), 0)};
    grid-gap: ${glsp(themeVal('layout.gap.medium'))};
  `}

  ${media.largeUp`
    padding: ${glsp(themeVal('layout.gap.large'), 0)};
    grid-gap: ${glsp(themeVal('layout.gap.large'))};
  `}

  ${media.xlargeUp`
    padding: ${glsp(themeVal('layout.gap.xlarge'), 0)};
    grid-gap: ${glsp(themeVal('layout.gap.xlarge'))};
  `}
`;

const Intro = styled.section`
  grid-column: content-start / content-end;
  align-self: center;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(2)};

  ${media.mediumUp`
    grid-column: content-start / span 8;
  `}

  ${media.largeUp`
    grid-gap: ${glsp(3)};
  `}
`;

const IntroHeader = styled.header``;

const IntroTitle = styled(Heading)`
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin: 0 0 ${glsp(0.5)} 0;

  span {
    display: inline-block;
    line-height: 1rem;
    font-size: 0;
    box-shadow: -2px 0 0 0 ${themeVal('color.baseAlphaD')};
    padding-left: 0.25rem;
    margin-left: 0.25rem;
    vertical-align: middle;
  }
`;

const IntroLead = styled(Heading).attrs({ as: 'div' })`
  font-size: 2rem;
  line-height: 2.5rem;
  margin: 0 0 ${glsp(2)} 0;
`;

const IntroActions = styled.p`
  display: grid;
  grid-auto-columns: min-content;
  grid-gap: ${glsp(0.25, 1)};
  text-align: center;
`;

const SubAction = styled.a`
  grid-column: 2;
  grid-row: 2;
`;

const FocusBoxList = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(1, themeVal('layout.gap.xsmall'))};

  ${media.mediumUp`
    grid-template-columns: repeat(2, 1fr);
    grid-gap: ${glsp(2, themeVal('layout.gap.medium'))};
  `}

  ${media.largeUp`
    grid-gap: ${glsp(2, themeVal('layout.gap.large'))};
  `}

  ${media.xlargeUp`
    grid-gap: ${glsp(2, themeVal('layout.gap.xlarge'))};
  `}
`;

const FocusBox = styled.div`
  display: grid;
  grid-gap: ${glsp()};
`;

const FocusBoxTitle = styled(Heading).attrs({
  as: 'h2'
})`
  display: grid;
  grid-template-columns: min-content auto;
  grid-gap: ${glsp()};
  align-items: center;
  font-size: 1.5rem;
  line-height: 2rem;

  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
    color: ${themeVal('color.primary')};
    background-color: ${rgba(themeVal('color.primary'), 0.16)};
    border-radius: ${themeVal('shape.rounded')};
  }
`;

const FocusBoxContent = styled.div``;

const Illu = styled.figure`
  grid-column: content-start / content-end;
  align-self: end;
  justify-self: center;
  overflow-x: hidden;
  margin-bottom: -${glsp(themeVal('layout.gap.xsmall'))};

  ${media.mediumUp`
    margin-bottom: -${glsp(themeVal('layout.gap.medium'))};
  `}

  ${media.largeUp`
    margin-bottom: -${glsp(themeVal('layout.gap.large'))};
    grid-column: content-9 / full-end;
    justify-self: auto;
  `}

  ${media.xlargeUp`
    margin-bottom: -${glsp(themeVal('layout.gap.xlarge'))};
  `}

  img {
    display: block;
    max-width: 20rem;
    height: auto;

    ${media.mediumUp`
      max-width: 24rem;
    `}

    ${media.largeUp`
      max-width: none;
    `}
  }
`;

function Home() {
  return (
    <App pageTitle='Welcome'>
      <Inpage>
        <HomeInpageHeader>
          <InpageHeadline>
            <InpageTitle>Welcome</InpageTitle>
          </InpageHeadline>
        </HomeInpageHeader>
        <InpageBody>
          <HomeContent>
            <Intro>
              <IntroHeader>
                <IntroTitle>
                  APT <span>—</span> The Algorithm Publication Tool
                </IntroTitle>
                <IntroLead>
                  <p>
                    Enabling open science by making it easier to write and find
                    key scientific documents.
                  </p>
                </IntroLead>
                <IntroActions>
                  <Button
                    forwardedAs='a'
                    href='/about'
                    size='large'
                    variation='primary-raised-light'
                  >
                    Learn more
                  </Button>
                  <Button
                    forwardedAs='a'
                    href='/documents'
                    size='large'
                    variation='primary-raised-dark'
                  >
                    Explore the documents
                  </Button>
                  <SubAction href='/signin' title='Sign in now'>
                    Or sign in to start creating
                  </SubAction>
                </IntroActions>
              </IntroHeader>
              <FocusBoxList>
                <li>
                  <FocusBox>
                    <FocusBoxTitle useIcon='pencil'>
                      Streamlined writing process
                    </FocusBoxTitle>
                    <FocusBoxContent>
                      Easily create compliant and complete ATBDs using a
                      standardized template. The APT&apos;s centralized location
                      makes it simple to collaborate with the writing team.
                    </FocusBoxContent>
                  </FocusBox>
                </li>
                <li>
                  <FocusBox>
                    <FocusBoxTitle useIcon='wrench'>
                      User-friendly
                      <br /> tools
                    </FocusBoxTitle>
                    <FocusBoxContent>
                      Easily format text and add equations, tables, figures and
                      references using the APT&apos;s rich text editor, LaTex
                      tools and Bibtex citation manager.
                    </FocusBoxContent>
                  </FocusBox>
                </li>
                <li>
                  <FocusBox>
                    <FocusBoxTitle useIcon='eye'>
                      Visually appealing documents
                    </FocusBoxTitle>
                    <FocusBoxContent>
                      Preview a selected ATBD as an HTML webpage or a PDF
                      document.
                    </FocusBoxContent>
                  </FocusBox>
                </li>
                <li>
                  <FocusBox>
                    <FocusBoxTitle useIcon='expand-top-right'>
                      Straightforward journal submission
                    </FocusBoxTitle>
                    <FocusBoxContent>
                      Use a streamlined ATBD journal submission process with
                      AGU&apos;s Earth and Space Science, a gold open access
                      journal.
                    </FocusBoxContent>
                  </FocusBox>
                </li>
              </FocusBoxList>
            </Intro>
            <Illu>
              <img
                alt='Tree of knowledge illustration'
                src='/assets/graphics/content/welcome-illu.svg'
                width='640'
                height='864'
              />
            </Illu>
          </HomeContent>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Home;
