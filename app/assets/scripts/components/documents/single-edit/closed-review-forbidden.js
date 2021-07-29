import React from 'react';
import T from 'prop-types';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { ContentBlock } from '../../../styles/content-block';
import Prose from '../../../styles/typography/prose';

export default function ClosedReviewForbidden(props) {
  const { renderInpageHeader } = props;

  return (
    <Inpage>
      {renderInpageHeader()}
      <InpageBody>
        <ContentBlock>
          <Prose>
            <p>
              It is not possible to edit a document during the closed review
              stage.
            </p>
            <p>You will be notified once the open review starts.</p>
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
