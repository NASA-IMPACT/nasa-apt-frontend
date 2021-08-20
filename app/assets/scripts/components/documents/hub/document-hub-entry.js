import React, { useMemo } from 'react';
import T from 'prop-types';
import nl2br from 'react-nl2br';
import ReactGA from 'react-ga';
import { VerticalDivider } from '@devseed-ui/toolbar';

import {
  CardInteractive,
  CardHeader,
  CardHeadline,
  CardHgroup,
  CardToolbar,
  CardTitle,
  CardDetails,
  CardBody,
  CardExcerpt
} from '../../../styles/card';

import VersionsMenu from '../versions-menu';
import Datetime from '../../common/date';
import Tip from '../../common/tooltip';
import DocumentDownloadMenu from '../../documents/document-download-menu';

import { documentView } from '../../../utils/url-creator';
import getDocumentIdKey from '../get-document-id-key';
import { computeAtbdVersion } from '../../../context/atbds-list';

const getDropChange = (label) => (isOpen) =>
  isOpen &&
  ReactGA.event({
    category: 'Documents Hub',
    action: 'Interaction',
    label
  });

function DocumentHubEntry(props) {
  const { atbd } = props;

  const atbdVersion = computeAtbdVersion(atbd, atbd.versions.last);

  const atbdAbstract = useMemo(() => {
    const abstract = atbdVersion.document?.abstract?.trim();
    const abstractChars = 240;

    if (!abstract) return 'No summary available';
    if (abstract.length <= abstractChars) return abstract;

    // Limit the abstract ensuring that no words are split.
    const abstractSlice = abstract.slice(0, abstractChars);
    const abstractTruncated = abstractSlice.slice(
      0,
      abstractSlice.lastIndexOf(' ')
    );
    return `${abstractTruncated}...`;
  }, [atbdVersion]);

  return (
    <CardInteractive
      linkProps={{
        to: documentView(atbd, atbdVersion.version),
        title: 'View document'
      }}
      linkLabel='View'
    >
      <CardHeader>
        <CardHeadline>
          <CardHgroup>
            <CardTitle>{atbd.title}</CardTitle>
            <CardToolbar>
              <VersionsMenu
                onChange={useMemo(() => getDropChange('Version dropdown'), [])}
                atbdId={getDocumentIdKey(atbd).id}
                versions={atbd.versions}
                alignment='right'
              />
              <VerticalDivider />
              <DocumentDownloadMenu
                onChange={useMemo(() => getDropChange('PDF dropdown'), [])}
                atbd={atbdVersion}
                alignment='right'
                direction='down'
                hideText
                variation='base-plain'
              />
            </CardToolbar>
          </CardHgroup>
        </CardHeadline>
        <CardDetails>
          By <Creators creators={atbdVersion.citation?.creators} /> on{' '}
          <Datetime date={new Date(atbdVersion.last_updated_at)} />
        </CardDetails>
      </CardHeader>
      <CardBody>
        <CardExcerpt>
          <p>{nl2br(atbdAbstract)}</p>
        </CardExcerpt>
      </CardBody>
    </CardInteractive>
  );
}

DocumentHubEntry.propTypes = {
  atbd: T.object
};

export default DocumentHubEntry;

const Creators = ({ creators }) => {
  if (!creators) return 'Unknown';

  const creatorsList = creators?.split(' and ');

  if (creatorsList.length > 1) {
    return (
      <Tip title={creators} style={{ pointerEvents: 'auto' }} tag='span'>
        {creatorsList[0]} et al.
      </Tip>
    );
  }

  return creators;
};

Creators.propTypes = {
  creators: T.string
};
