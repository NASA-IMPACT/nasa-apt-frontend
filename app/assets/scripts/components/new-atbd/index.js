import React from 'react';
import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import {
  FaFileAlt,
  FaFileWord,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { SiLatex } from 'react-icons/si';
import { GrClose } from 'react-icons/gr';

import { Link } from '../../styles/clean/link';
import { useUser } from '../../context/user';
import { getHostedAuthUiUrl } from '../../utils/common';
import App from '../common/app';
import {
  Backdrop,
  Modal,
  ModalContent,
  ModalHeader,
  BodyUnscrollable
} from '../common/modal';

const IconButton = styled(Button)`
  min-width: unset;
`;

const MoreInfoModal = styled(Modal)`
  max-width: 50rem;
`;

const Table = styled.table`
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: ${glsp()};
  border-bottom: ${themeVal('layout.border')} solid
    ${themeVal('color.baseAlphaC')};
  text-align: left;
`;

const Td = styled.td`
  padding: ${glsp()};
  border-bottom: ${themeVal('layout.border')} solid
    ${themeVal('color.baseAlphaC')};
`;

const CheckIcon = styled(FaCheckCircle)`
  color: green;
  margin-right: ${glsp(0.25)};
  vertical-align: baseline;
`;

const TimesIcon = styled(FaTimesCircle)`
  color: red;
  margin-right: ${glsp(0.25)};
  vertical-align: baseline;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${glsp(6)};
  padding: ${glsp(3)};
  max-width: ${themeVal('layout.max')};
  width: 100%;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: ${glsp(1.5)};

  > h1 {
    margin: 0;
  }

  > p {
    font-size: 1.25rem;
    font-weight: ${themeVal('type.base.medium')};
  }
`;

const SectionContainer = styled.main`
  display: flex;
  gap: ${glsp(8)};

  > * {
    flex-basis: 0;
    flex-grow: 1;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${glsp(1.5)};
`;

const Video = styled.iframe`
  width: 100%;
  height: 20rem;
`;

const TemplateContainer = styled.div`
  display: flex;
  gap: ${glsp(2)};
  padding: ${glsp(2)} 0;
`;

const TemplateLink = styled.a`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  gap: ${glsp()};

  > span {
    font-size: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
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
  max-width: 32rem;
`;

const Feedback = styled.div`
  text-align: center;
`;

const FeedbackLink = (props) => (
  <a
    href='#'
    title='Open feedback form modal'
    onClick={(e) => {
      e.preventDefault();
      document.dispatchEvent(new Event('show-feedback-modal'));
    }}
    {...props}
  />
);

function NewAtbd() {
  const [showMoreInfo, setShowMoreInfo] = React.useState(false);
  const { user } = useUser();

  return (
    <App pageTitle='New ATBD'>
      <PageContent>
        <Header>
          <h1>ATBD Creation Choices</h1>
          {!user.isLogged && (
            <Feedback>
              <a href={getHostedAuthUiUrl('signup')}>Sign up</a> now to get
              started!
            </Feedback>
          )}
          <LearnMore>
            Unsure whether the user interface or template is right for you?
            Click{' '}
            <Link
              as='button'
              to='#'
              onClick={() => {
                setShowMoreInfo(true);
              }}
            >
              here
            </Link>{' '}
            to learn more about both.
          </LearnMore>
        </Header>
        <SectionContainer>
          <Section>
            <h2>APT User Interface</h2>
            <p>
              Create and publish an ATBD from start to finish using the APT user
              interface.
            </p>
            <div>
              See <Link to='/user-guide'>APT user guide</Link>
            </div>
            <Video
              src='https://drive.google.com/file/d/1D9WpNJh3teOCLMbb_gDeJyIWjqarySyk/preview'
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
            <div>
              See <Link to='/'>ATBD template user guide</Link>
              <em> (coming soon)</em>
            </div>
            <TemplateContainer>
              <TemplateLink
                href='https://docs.google.com/document/d/1T4q56qZrRN5L6MGXA1UJLMgDgS-Fde9Fo4R4bwVQDF8/edit?usp=sharing'
                target='_blank'
                rel='noopener'
              >
                <span>
                  <FaFileAlt />
                </span>
                <div>Google Docs</div>
              </TemplateLink>
              <TemplateLink
                href='https://docs.google.com/document/d/1Jh3htOiivNIG_ZqhbN5nEK1TAVB6BjRY/edit?usp=share_link&ouid=102031143611308171378&rtpof=true&sd=true'
                target='_blank'
                rel='noopener'
              >
                <span>
                  <FaFileWord />
                </span>
                <div>Microsoft Word</div>
              </TemplateLink>
              <TemplateLink
                href='https://drive.google.com/file/d/1AusZOxIpkBiA0QJAB3AtSXSBUU5tWwlJ/view?usp=share_link'
                target='_blank'
                rel='noopener'
              >
                <span>
                  <SiLatex />
                </span>
                <div>LaTeX</div>
              </TemplateLink>
            </TemplateContainer>
          </Section>
        </SectionContainer>
        <FooterContent>
          <Feedback>
            Submit bugs and recommend improvements using the{' '}
            <FeedbackLink>feedback form.</FeedbackLink>
          </Feedback>
        </FooterContent>
      </PageContent>
      {showMoreInfo && (
        <Backdrop>
          <BodyUnscrollable />
          <MoreInfoModal>
            <ModalHeader>
              <h3>
                Benefits and drawbacks of using the APT User Interface and ATBD
                Template
              </h3>
              <IconButton
                variation='base-plain'
                size='large'
                onClick={() => {
                  setShowMoreInfo(false);
                }}
              >
                <GrClose />
              </IconButton>
            </ModalHeader>
            <ModalContent>
              <Table>
                <thead>
                  <tr>
                    <Th>APT User Interface</Th>
                    <Th>ATBD Template</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>
                      <CheckIcon /> Simplified step by step process
                    </Td>
                    <Td>
                      <CheckIcon /> Offline editing/writing
                    </Td>
                  </tr>
                  <tr>
                    <Td>
                      <CheckIcon />
                      User friendly tools for formatting, adding equations,
                      tables, etc.
                    </Td>
                    <Td>
                      <CheckIcon /> Use familiar software (e.g., LaTeX) or word
                      processor (e.g., Microsoft Word)
                    </Td>
                  </tr>
                  <tr>
                    <Td>
                      <CheckIcon /> Entire ATBD creation process within APT user
                      interface (i.e., creation, review, and publication)
                    </Td>
                    <Td>
                      <CheckIcon /> Simultaneous collaboration (e.g., Google
                      Docs)
                    </Td>
                  </tr>
                  <tr>
                    <Td>
                      <TimesIcon /> No offline editing
                    </Td>
                    <Td>
                      <TimesIcon /> Must download template and upload completed
                      ATBD
                    </Td>
                  </tr>
                  <tr>
                    <Td>
                      <TimesIcon /> Collaboration is not simultaneous
                    </Td>
                    <Td>
                      <TimesIcon /> Content formatting is more cumbersome,
                      including equations, tables, and figures
                    </Td>
                  </tr>
                  <tr>
                    <Td>
                      <TimesIcon /> User interface updates and improvements may
                      cause intermitted disruptions
                    </Td>
                    <Td />
                  </tr>
                  <tr>
                    <Td>
                      <TimesIcon /> Slight learning curve
                    </Td>
                    <Td />
                  </tr>
                </tbody>
              </Table>
            </ModalContent>
          </MoreInfoModal>
        </Backdrop>
      )}
    </App>
  );
}

export default NewAtbd;
