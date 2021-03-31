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
import { Link } from '../../styles/clean/link';

import { getAppURL } from '../../utils/history';
import { useUser } from '../../context/user';

const loc = getAppURL().cleanHref;

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
  height: 100%;
  align-items: center;
  overflow: hidden;
`;

const HomeContentInner = styled(UniversalGridder).attrs({
  as: 'div',
  grid: {
    smallUp: ['full-start', 'full-end'],
    mediumUp: ['full-start', 'full-end'],
    largeUp: ['full-start', 'full-end']
  }
})`
  padding: ${glsp(themeVal('layout.gap.xsmall'), 0)};
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};

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
  grid-template-columns: repeat(2, min-content);
  grid-gap: ${glsp(0.25, 1)};
  text-align: center;
`;

const SubAction = styled(Link)`
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

const Illu = styled.figure`
  grid-column: content-start / content-end;
  justify-self: center;

  ${media.largeUp`
    grid-column: content-9 / full-end;
    justify-self: auto;
  `}
`;

const IlluInner = styled.div`
  position: relative;
  width: min-content;

  img {
    display: block;
    max-width: 20rem;
    height: auto;

    ${media.mediumUp`
      max-width: 24rem;
    `}

    ${media.largeUp`
      max-width: 30rem;
    `}

    ${media.xlargeUp`
      max-width: 32rem;
    `}

    @media only screen and (min-width: 1920px) {
      max-width: 40rem;
    }
  }

  &::after {
    position: absolute;
    top: 99%;
    left: 0;
    width: 100%;
    height: 100vh;
    background-image: url('${loc}/assets/graphics/layout/welcome-illu--pattern.svg');
    background-repeat: repeat-y;
    background-size: 100% auto;
    content: '';
    pointer-events: none;
    max-width: inherit;
  }
`;

function Home() {
  const { isLogged } = useUser();

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
            <HomeContentInner>
              <Intro>
                <header>
                  <IntroTitle>
                    APT <span>—</span> The Algorithm Publication Tool
                  </IntroTitle>
                  <IntroLead>
                    <p>
                      Enabling open science by making it easier to write and
                      find key scientific documents.
                    </p>
                  </IntroLead>
                  <IntroActions>
                    <Button
                      forwardedAs={Link}
                      to='/about'
                      size='large'
                      variation='primary-raised-light'
                    >
                      Learn more
                    </Button>
                    <Button
                      forwardedAs={Link}
                      to='/documents'
                      size='large'
                      variation='primary-raised-dark'
                    >
                      Explore the documents
                    </Button>
                    {!isLogged && (
                      <SubAction to='/signin' title='Sign in now'>
                        Or sign in to start creating
                      </SubAction>
                    )}
                  </IntroActions>
                </header>
                <FocusBoxList>
                  <li>
                    <FocusBox>
                      <FocusBoxTitle useIcon='pencil'>
                        Streamlined writing process
                      </FocusBoxTitle>
                      <div>
                        Easily create compliant and complete ATBDs using a
                        standardized template. The APT&apos;s centralized
                        location makes it simple to collaborate with the writing
                        team.
                      </div>
                    </FocusBox>
                  </li>
                  <li>
                    <FocusBox>
                      <FocusBoxTitle useIcon='wrench'>
                        User-friendly
                        <br /> tools
                      </FocusBoxTitle>
                      <div>
                        Easily format text and add equations, tables, figures
                        and references using the APT&apos;s rich text editor,
                        LaTex tools and Bibtex citation manager.
                      </div>
                    </FocusBox>
                  </li>
                  <li>
                    <FocusBox>
                      <FocusBoxTitle useIcon='eye'>
                        Visually appealing documents
                      </FocusBoxTitle>
                      <div>
                        Preview a selected ATBD as an HTML webpage or a PDF
                        document.
                      </div>
                    </FocusBox>
                  </li>
                  <li>
                    <FocusBox>
                      <FocusBoxTitle useIcon='expand-top-right'>
                        Straightforward journal submission
                      </FocusBoxTitle>
                      <div>
                        Use a streamlined ATBD journal submission process with
                        AGU&apos;s Earth and Space Science, a gold open access
                        journal.
                      </div>
                    </FocusBox>
                  </li>
                </FocusBoxList>
              </Intro>
              <Illu>
                <IlluInner>
                  <img
                    alt='Tree of knowledge illustration'
                    src={`${loc}/assets/graphics/layout/welcome-illu.svg`}
                    width='640'
                    height='864'
                  />
                </IlluInner>
              </Illu>
            </HomeContentInner>
          </HomeContent>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Home;
