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
  padding: ${glsp(2)};
`;

const TemplateLink = styled.a`
  display: flex;
  align-items: center;
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
            <div>
              See <Link to='/user-guide'>APT user guide</Link>
            </div>
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
            <div>
              See <Link to='/'>ATBD template user guide</Link>
            </div>
            <TemplateContainer>
              <TemplateLink href='/'>
                <span>
                  <FaFileAlt />
                </span>
                <div>Google Docs</div>
              </TemplateLink>
              <TemplateLink href='/'>
                <span>
                  <FaFileWord />
                </span>
                <div>Microsoft Word</div>
              </TemplateLink>
              <TemplateLink href='/'>
                <span>
                  <SiLatex />
                </span>
                <div>LaTeX</div>
              </TemplateLink>
            </TemplateContainer>
          </Section>
        </SectionContainer>
        <FooterContent>
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
                Benifits and drabacks of using the APT User Interface and ATBD
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
                      User friendly tools fo rformatting, adding equations,
                      tables, etc.
                    </Td>
                    <Td>
                      <CheckIcon /> Use familiar softawre (e.g., LaTeX) or word
                      processor (e.g., Microsoft Word)
                    </Td>
                  </tr>
                  <tr>
                    <Td>
                      <CheckIcon /> Entire ATBD creation process within APT
                      unser interface (i.e., creation, review, and publication)
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
                      <TimesIcon /> Requires external ATBD review
                    </Td>
                  </tr>
                  <tr>
                    <Td>
                      <TimesIcon /> User interface updates and improvements may
                      cause intermitted disruptions
                    </Td>
                    <Td>
                      <TimesIcon /> Content formatting is more cumbersome,
                      including equations, tables, and figures
                    </Td>
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
