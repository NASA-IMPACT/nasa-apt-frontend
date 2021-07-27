import React from 'react';
import T from 'prop-types';

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
                atbdId={atbd.alias || atbd.id}
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
      <CardBody>
        <CardExcerpt>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec
            scelerisque mauris. Vestibulum auctor tempor quam eu pharetra. Nunc
            gravida lacus ipsum, sit amet dictum tellus sodales eget. Praesent
            elementum volutpat imperdiet. Nunc cursus lorem vulputate, faucibus
            nunc a, viverra leo...
          </p>
        </CardExcerpt>
      </CardBody>
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
