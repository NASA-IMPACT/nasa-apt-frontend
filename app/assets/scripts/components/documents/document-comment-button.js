import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { visuallyHidden } from '@devseed-ui/theme-provider';

import { Link } from '../../styles/clean/link';
import Tip from '../common/tooltip';

import { documentView } from '../../utils/url-creator';
import { useThreadStats } from '../../context/threads-list';

const Hide = styled.span`
  ${visuallyHidden()}
`;

// The thread stats are fetched in the same place the atbds are fetched since
// they need to be refetched every time the atbds change.
// When the stats are available render them and the tooltip, otherwise render
// just the button until they load.
export default function DocumentCommentsButton(props) {
  const { onClick, size, variation, atbd, active } = props;
  const { getThreadsStats } = useThreadStats();

  const stats = getThreadsStats({
    atbdId: atbd.id,
    atbdVersion: atbd.version
  });

  const item = (
    <Button
      forwardedAs={Link}
      variation={variation}
      size={size}
      useIcon='speech-balloon'
      to={documentView(atbd, atbd.version)}
      onClick={onClick}
      title='View comments'
      active={active}
    >
      {stats ? (
        <React.Fragment>
          <Hide>Has </Hide>
          {stats.status.open}/{stats.total}
          <Hide> comments</Hide>
        </React.Fragment>
      ) : (
        'Comments'
      )}
    </Button>
  );

  return stats ? (
    <Tip title={`${stats.status.open} unresolved of ${stats.total} comments`}>
      {item}
    </Tip>
  ) : (
    item
  );
}

DocumentCommentsButton.propTypes = {
  active: T.bool,
  variation: T.string,
  size: T.string,
  onClick: T.func,
  atbd: T.object
};
