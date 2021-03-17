import React, { Component } from 'react';
import styled from 'styled-components';

import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
} from '../common/Inpage';
import Prose from '../../styles/type/prose';

const AboutProse = styled(Prose)`
  max-width: 48rem;
  margin: 0 auto;
`;

class About extends Component {
  render() {
    return (
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>About</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>
            <AboutProse>
              <p>
                This is the <strong>Algorithm Publication Tool</strong>{' '}
                prototype for use in writing, submitting, and discovering ATBDs.
                We have endeavored to make it as easy as possible to create and
                edit new ATBDs, and welcome your feedback.
              </p>

              <p>
                APT has been developed by a diverse team at NASA IMPACT and
                Development Seed. Please use the feedback button to send us your
                questions, thoughts, and comments.
              </p>

              <h1>FAQs</h1>
              <h2>What is the APT?</h2>
              <p>
                The APT is an authoring tool that streamlines the writing,
                publishing and maintenance process of Algorithm Theoretical
                Description Documents (ATBDs) for NASA’s Earth Science Division.
                The APT is also a centralized repository of submitted ATBDs for
                Earth Science users. Researchers and scientists are required to
                use the tool to standardize the ATBD content and make it
                searchable for all interested data users.
              </p>
              <h2>Why should I use the APT?</h2>
              <p>
                If you are a user, this is where you will find an ATBD you are
                looking for. Historical ATBDs are not available at this time. If
                you are a scientist, this tool provides you a means to write and
                submit your algorithm description so that it can be located by
                others and even aids in journal submission.
              </p>
              <h2>Can the public use the APT?</h2>
              <p>
                The public can not use the APT to write an ATBD, only to access
                submitted NASA Earth Science ATBDs. Users can view a selected
                ATBD as either a PDF or an HTML page.
              </p>
              <h2>How does the APT work?</h2>
              <p>
                The APT uses a standardized ATBD template that improves
                communication and sets content expectations for ATBDs. A review
                process is used to ensure content quality. ATBD content is
                stored as metadata making it completely machine readable,
                searchable, and useful in other tools and services.{' '}
              </p>

              <p>
                For more detailed information about APT, please visit the User
                Guide for Authoring ATBDs using the Algorithm Publication Tool
                (APT).
              </p>

              <p>
                If you have questions, please click the feedback button on the
                top right of the page.
              </p>
            </AboutProse>
          </InpageBodyInner>
        </InpageBody>
      </Inpage>
    );
  }
}

export default About;
