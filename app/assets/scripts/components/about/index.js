import React from 'react';
import styled from 'styled-components';

import App from '../common/app';
import {
  Inpage,
  InpageHeaderSticky,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';
import { ContentBlock } from '../../styles/content-block';
import Prose from '../../styles/typography/prose';
import { Link } from '../../styles/clean/link';

const DisclosureHeader = styled.h3`
  display: inline;
`;

const DisclosureContent = styled.p`
  padding: 1rem 0rem 0rem 0rem;
`;

function About() {
  return (
    <App pageTitle='About'>
      <Inpage>
        <InpageHeaderSticky>
          <InpageHeadline>
            <InpageTitle>About</InpageTitle>
          </InpageHeadline>
        </InpageHeaderSticky>
        <InpageBody>
          <ContentBlock>
            <Prose>
              <h1>The Algorithm Publication Tool (APT)</h1>
              <p>
                APT is a prototype environment for use in writing, submitting,
                discovering and accessing Algorithm Theoretical Basis Documents
                (ATBDs). The tool has been designed to make it easier to create
                and edit new ATBDs and discover ATBDs from within APT&apos;s
                centralized repository.
              </p>

              <p>
                APT has been developed by a diverse team at{' '}
                <a
                  href='https://impact.earthdata.nasa.gov/'
                  rel='noopener'
                  title='Visit NASA IMPACT webpage'
                >
                  NASA IMPACT
                </a>{' '}
                and{' '}
                <a
                  href='https://developmentseed.org/'
                  rel='noopener'
                  title='Visit the Development Seed webpage'
                >
                  Development Seed
                </a>
                . Please use the <FeedbackLink>feedback form</FeedbackLink> to
                send us your questions, thoughts, and comments. We welcome
                feedback from all users!
              </p>

              <p>
                The available processes for ATBD creation are described on the{' '}
                <a
                  href='/new-atbd'
                  rel='noopener'
                  title='Create a new ATBD page'
                >
                  Create a new ATBD page
                </a>
                . Authors and collaborators have a choice to construct an ATBD
                either using the APT authoring environment or using Google Docs,
                Microsoft Word, or LaTeX templates. The process is slightly
                different for each method.
              </p>

              <h2>FAQs</h2>
              <details open>
                <summary>
                  <DisclosureHeader>What is the APT?</DisclosureHeader>
                </summary>
                <DisclosureContent>
                  APT is an authoring tool that streamlines the writing,
                  publishing and maintenance process of ATBDs for NASA&apos;s
                  Earth Science Division. APT is also a centralized repository
                  of completed and submitted ATBDs for Earth Science users.
                  Researchers and scientists are required to use the tool or
                  templates to ensure creation of standardized ATBD content and
                  to provide searchable documents for all interested data and
                  algorithm users.
                </DisclosureContent>
              </details>
              <details>
                <summary>
                  <DisclosureHeader>Why should I use the APT?</DisclosureHeader>
                </summary>
                <DisclosureContent>
                  If you are looking for an algorithm description, this is where
                  you will find publicly available ATBDs for NASA&apos;s Earth
                  Science Division. The general public can view and download all
                  completed ATBDs without a user account. Historical ATBDs are
                  not available at this time but will be added over time once
                  the interface is adapted to receive the documents. All APT
                  ATBDs have a DOI that can be used as metadata in data products
                  pertaining to the algorithm.
                </DisclosureContent>
                <DisclosureContent>
                  If you are a researcher responsible for producing an ATBD,
                  this tool is used to write and submit your algorithm
                  description so that it can be located by others. The APT
                  environment has been designed to aid with creating and
                  submitting your ATBD to a journal, if you choose. Use of the
                  APT templates for document creation ensures content is
                  standardized to improve discoverability and automated document
                  use.
                </DisclosureContent>
              </details>
              <details>
                <summary>
                  <DisclosureHeader>
                    Can the public use the APT?
                  </DisclosureHeader>
                </summary>
                <DisclosureContent>
                  The public can freely view and download any completed ATBD as
                  a PDF file. No user account is needed. Only users required to
                  author, submit or review an ATBD can obtain an authorized user
                  account.
                </DisclosureContent>
              </details>
              <details>
                <summary>
                  <DisclosureHeader>How does the APT work?</DisclosureHeader>
                </summary>
                <DisclosureContent>
                  APT uses a standardized ATBD template that sets content
                  expectations for ATBDs and improves communication and
                  completed document discoverability. A review process is used
                  to ensure that all content meets quality requirements. Within
                  the APT authoring environment, all ATBD content is stored as
                  metadata making it completely machine readable, searchable,
                  and useful in other tools and services.
                </DisclosureContent>
                <DisclosureContent>
                  If an author chooses to use APT templates for ATBD creation,
                  only the completed and approved PDF is submitted to APT. From
                  the APT environment, authors will provide needed metadata
                  about the document to ensure discovery of the document.
                </DisclosureContent>
              </details>
              <p>
                For more detailed information about APT, check out the{' '}
                <Link to='/user-guide'>User Guide </Link>
                with the Algorithm Publication Tool (APT) .
              </p>
              <p>
                If you have questions, please use the{' '}
                <FeedbackLink>feedback form </FeedbackLink>
                to communicate with the APT Curator.
              </p>
            </Prose>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default About;

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
