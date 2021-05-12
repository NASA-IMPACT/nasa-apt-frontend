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
              <h1>APT</h1>
              <p>
                This is the <strong>Algorithm Publication Tool</strong>{' '}
                prototype for use in writing, submitting, and discovering ATBDs.
                We have endeavored to make it as easy as possible to create and
                edit new ATBDs, and welcome your feedback.
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
                The APT is an authoring tool that streamlines the writing,
                publishing and maintenance process of Algorithm Theoretical
                Description Documents (ATBDs) for NASA’s Earth Science Division.
                The APT is also a centralized repository of submitted ATBDs for
                Earth Science users. Researchers and scientists are required to
                use the tool to standardize the ATBD content and make it
                searchable for all interested data users.
              </p>
              <h3>Why should I use the APT?</h3>
              <p>
                If you are a user, this is where you will find an ATBD you are
                looking for. Historical ATBDs are not available at this time. If
                you are a scientist, this tool provides you a means to write and
                submit your algorithm description so that it can be located by
                others and even aids in journal submission.
              </p>
              <h3>Can the public use the APT?</h3>
              <p>
                The public can not use the APT to write an ATBD, only to access
                submitted NASA Earth Science ATBDs. Users can view a selected
                ATBD as either a PDF or an HTML page.
              </p>
              <h3>How does the APT work?</h3>
              <p>
                The APT uses a standardized ATBD template that improves
                communication and sets content expectations for ATBDs. A review
                process is used to ensure content quality. ATBD content is
                stored as metadata making it completely machine readable,
                searchable, and useful in other tools and services.
              </p>

              <p>
                For more detailed information about APT, please visit the User
                Guide for Authoring ATBDs using the Algorithm Publication Tool
                (APT).
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
      window.feedback?.showForm();
    }}
    {...props}
  />
);
