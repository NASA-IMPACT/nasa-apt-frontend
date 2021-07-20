import React, { useCallback } from 'react';
import T from 'prop-types';

import { Button } from '@devseed-ui/button';

import {
  Card,
  CardHeader,
  CardHeadline,
  CardHgroup,
  CardTitle,
  CardDetails,
  CardBody,
  CardExcerpt,
  CardFooter
} from '../../../styles/card';

import { Link } from '../../../styles/clean/link';
import VersionsMenu from '../versions-menu';
import Datetime from '../../common/date';
import Tip from '../../common/tooltip';

import { documentView } from '../../../utils/url-creator';
import { useUser } from '../../../context/user';
import { documentUpdatedDate } from '../../../utils/date';

function DocumentHubEntry(props) {
  const { atbd, onDocumentAction } = props;
  const lastVersion = atbd.versions[atbd.versions.length - 1];
  const { isLogged } = useUser();

  const onAction = useCallback((...args) => onDocumentAction(atbd, ...args), [
    onDocumentAction,
    atbd
  ]);

  // The updated at is the most recent between the version updated at and the
  // atbd updated at.
  const updateDate = documentUpdatedDate(atbd, lastVersion);

  return (
    <Card>
      <CardHeader>
        <CardHeadline>
          <CardHgroup>
            <CardTitle>
              <Link
                to={documentView(atbd, lastVersion.version)}
                title='View document'
              >
                {atbd.title}
              </Link>
            </CardTitle>
            <VersionsMenu
              atbdId={atbd.alias || atbd.id}
              versions={atbd.versions}
            />
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
            nunc a, viverra leo
          </p>
        </CardExcerpt>
      </CardBody>
      <CardFooter>
        <Button
          className='toast-close-button'
          variation='primary-raised-light'
          useIcon='download-2'
        >
          Download
        </Button>
        <Button
          className='toast-close-button'
          variation='primary-raised-dark'
          useIcon='arrow-right'
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}

DocumentHubEntry.propTypes = {
  atbd: T.object,
  onDocumentAction: T.func
};

export default DocumentHubEntry;

const Creators = ({ creators }) => {
  if (!creators) return null;

  const creatorsList = creators?.split(' and ');

  if (creatorsList.length > 1) {
    return (
      <React.Fragment>
        <dt>By</dt>
        <dd>
          <Tip title={creators}>{creatorsList[0]} et al.</Tip>
        </dd>
      </React.Fragment>
    );
  }

  return <React.Fragment>{creators}</React.Fragment>;
};

Creators.propTypes = {
  creators: T.string
};
