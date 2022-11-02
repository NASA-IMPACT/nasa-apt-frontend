import React from 'react';

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
                and discovering Algorithm Theoretical Basis Documents (ATBDs).
                The tool has been designed to make it easier to create and edit
                new ATBDs for which all content is searchable. We welcome your
                feedback.
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
                  title='Visit Development Seed webpage'
                >
                  Development Seed
                </a>
                . Please use the <FeedbackLink>feedback form</FeedbackLink> to
                send us your questions, thoughts, and comments.
              </p>

              <h2>FAQs</h2>
              <h3>What is the APT?</h3>
              <p>
                APT is an authoring tool that streamlines the writing,
                publishing and maintenance process of ATBDs for NASA’s Earth
                Science Division. APT is also a centralized repository of
                submitted ATBDs for Earth Science users. Researchers and
                scientists are required to use the tool to standardize ATBD
                content and make it searchable for all interested data users.
              </p>
              <h3>Why should I use the APT?</h3>
              <p>
                If you are looking for an algorithm description, this is where
                you will find publicly available ATBDs. The general public can
                view all completed ATBDs without a user account and download
                PDFs of the ATBDs. Historical ATBDs are not available at this
                time.
              </p>
              <p>
                If you are a researcher responsible for producing an ATBD, this
                tool is used to write and submit your algorithm description so
                that it can be located by others. APT has been designed to aid
                with submitting your ATBD to a journal.
              </p>
              <h3>Can the public use the APT?</h3>
              <p>
                The public can freely view and download any completed ATBD as
                HTML or PDF. No user account is needed. Only users required to
                author or review an ATBD can obtain an authorized user account.
              </p>
              <h3>How does the APT work?</h3>
              <p>
                APT uses a standardized ATBD template that sets content
                expectations for ATBDs and improves communication. A review
                process is used to ensure all content quality. ATBD content is
                stored as metadata making it completely machine readable,
                searchable, and useful in other tools and services.
              </p>

              <p>
                For more detailed information about APT, please visit the{' '}
                <Link to='/user-guide'>
                  User Guide for Authoring ATBDs using the Algorithm Publication
                  Tool (APT)
                </Link>
                .
              </p>

              <p>
                If you have questions, please submit them through the{' '}
                <FeedbackLink>feedback form</FeedbackLink>.
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
