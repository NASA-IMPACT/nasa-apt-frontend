import React from 'react';
import T from 'prop-types';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { ContentBlock } from '../../../styles/content-block';
import Prose from '../../../styles/typography/prose';
import { BlockMessage } from '../../../styles/block-message';
import { Link } from '../../../styles/clean/link';

import { documentView } from '../../../utils/url-creator';

export default function ClosedReviewForbidden(props) {
  const { renderInpageHeader, id, version } = props;

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
                <Link
                  to={documentView(id, version)}
                  title='Visit document page'
                >
                  read the document
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
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  renderInpageHeader: T.func
};
