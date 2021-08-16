import React from 'react';
import T from 'prop-types';
import nl2br from 'react-nl2br';

import {
  CardInteractive,
  CardHeader,
  CardHeadline,
  CardHgroup,
  CardToolbar,
  CardTitle,
  CardDetails,
  CardBody,
  CardExcerpt,
  CardActions
} from '../../../styles/card';

import VersionsMenu from '../versions-menu';
import Datetime from '../../common/date';
import Tip from '../../common/tooltip';
import DocumentDownloadMenu from '../../documents/document-download-menu';

import { documentView } from '../../../utils/url-creator';
import { documentUpdatedDate } from '../../../utils/date';
import getDocumentIdKey from '../get-document-id-key';

function DocumentHubEntry(props) {
  const { atbd } = props;
  const lastVersion = atbd.versions[atbd.versions.length - 1];

  // The updated at is the most recent between the version updated at and the
  // atbd updated at.
  const updateDate = documentUpdatedDate(atbd, lastVersion);

  return (
    <CardInteractive
      linkProps={{
        to: documentView(atbd, lastVersion.version),
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
                atbdId={getDocumentIdKey(atbd).id}
                versions={atbd.versions}
                alignment='right'
              />
            </CardToolbar>
          </CardHgroup>
        </CardHeadline>
        <CardDetails>
          By <Creators creators={lastVersion.citation?.creators} /> on{' '}
          <Datetime date={updateDate} />
        </CardDetails>
      </CardHeader>
      {lastVersion.document?.abstract &&
        typeof lastVersion.document.abstract === 'string' && (
          <CardBody>
            <CardExcerpt>
              <p>{nl2br(lastVersion.document.abstract)}</p>
            </CardExcerpt>
          </CardBody>
        )}
      <CardActions>
        <DocumentDownloadMenu
          atbd={lastVersion}
          alignment='left'
          direction='up'
          variation='primary-raised-dark'
        />
      </CardActions>
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
      <Tip title={creators} style={{ pointerEvents: 'auto' }}>
        {creatorsList[0]} et al.
      </Tip>
    );
  }

  return creators;
};

Creators.propTypes = {
  creators: T.string
};
