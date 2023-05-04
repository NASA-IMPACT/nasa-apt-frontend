import React from 'react';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';

import documentIcon from '../../../graphics/layout/document-icon.png';
import { Link } from '../../styles/clean/link';
import App from '../common/app';

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${glsp(5)};
  padding: ${glsp(5)};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const SectionContainer = styled.main`
  display: flex;
  gap: ${glsp(4)};

  > * {
    flex-basis: 0;
    flex-grow: 1;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
`;

const Video = styled.iframe`
  width: 100%;
  height: 20rem;
`;

const TemplateContainer = styled.div`
  display: flex;
  gap: ${glsp(2)};
`;

const TemplateLink = styled.a`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  gap: ${glsp(2)};

  > img {
    width: fit-content;
    height: 3rem;
  }
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
`;

const LearnMore = styled.div`
  text-align: center;
  font-weight: bold;
`;

const Feedback = styled.div`
  text-align: center;
`;

function NewAtbd() {
  return (
    <App pageTitle='New ATBD'>
      <PageContent>
        <Header>
          <h1>ATBD Creation Choices</h1>
        </Header>
        <SectionContainer>
          <Section>
            <h2>APT User Interface</h2>
            <p>
              Create and publish an ATBD from start to fininsh using the APT
              user interface.
            </p>
            <Link to='/'>APT user guide</Link>
            <Video
              src='https://www.youtube.com/embed/dQw4w9WgXcQ'
              title='APT - creating a document'
              frameborder='0'
              allowfullscreen
            />
          </Section>
          <Section>
            <h2>ATBD Templates</h2>
            <p>
              Create an ATBD using a standardized template. Upload the completed
              document and basic metadata to APT. An account is required for
              upload.
            </p>
            <Link to='/'>ATBD template user guide</Link>
            <TemplateContainer>
              <TemplateLink href='/'>
                <img src={documentIcon} />
                <div>Google Docs</div>
              </TemplateLink>
              <TemplateLink href='/'>
                <img src={documentIcon} />
                <div>Microsoft Word</div>
              </TemplateLink>
              <TemplateLink href='/'>
                <img src={documentIcon} />
                <div>LaTeX</div>
              </TemplateLink>
            </TemplateContainer>
          </Section>
        </SectionContainer>
        <FooterContent>
          <LearnMore>
            Unsure whether the user interface or template is right for you?
            Click <Link to='/'>here</Link> to learn more about both.
          </LearnMore>
          <Feedback>
            Submit bugs and recommend improvements using the{' '}
            <a href='/'>feedback form</a>
          </Feedback>
        </FooterContent>
      </PageContent>
    </App>
  );
}

export default NewAtbd;
