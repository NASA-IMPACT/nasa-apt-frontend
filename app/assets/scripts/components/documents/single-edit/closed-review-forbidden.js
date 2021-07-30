import React from 'react';
import T from 'prop-types';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { ContentBlock } from '../../../styles/content-block';
import Prose from '../../../styles/typography/prose';
import { BlockMessage } from '../../../styles/block-message';
import { Link } from '../../../styles/clean/link';

export default function ClosedReviewForbidden(props) {
  const { renderInpageHeader } = props;

  return (
    <Inpage>
      {renderInpageHeader()}
      <InpageBody>
        <ContentBlock>
          <Prose>
            <BlockMessage>
              <p>
                It is not possible to edit a document during the closed review
                stage. You will be notified once the open review starts.
              </p>
              <p>
                In the meantime, feel free to{' '}
                <Link to='#' title='Visit'>
                  visit the draft version
                </Link>
                .
              </p>
            </BlockMessage>
          </Prose>
        </ContentBlock>
      </InpageBody>
    </Inpage>
  );
}

ClosedReviewForbidden.propTypes = {
  renderInpageHeader: T.func,
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};
