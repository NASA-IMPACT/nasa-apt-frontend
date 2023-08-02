import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import { glsp, listReset } from '@devseed-ui/theme-provider';

import { getCitationPublicationDate } from '../citation';
import { CopyField } from '../../common/copy-field';
import Datetime from '../../common/date';
import Tip from '../../common/tooltip';
import DetailsList from '../../../styles/typography/details-list';
import { resolveTitle } from '../../../utils/common';

const DocumentHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(2)};
`;

const DocumentHeading = styled(Heading)`
  margin: 0;
`;

const DocumentMetaDetails = styled(DetailsList)`
  background: transparent;
`;

const ReleaseDate = ({ date }) => {
  if (!date) {
    return (
      <React.Fragment>
        <dt>Release date</dt>
        <dd>None provided</dd>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <dt>Release date</dt>
      <dd>
        <Datetime date={date} />
      </dd>
    </React.Fragment>
  );
};

ReleaseDate.propTypes = {
  date: T.object
};

const KeywordUnder = styled.small`
  display: block;
  opacity: 0.48;
`;

const KeywordsList = styled.ul`
  && {
    ${listReset()}
  }
`;

const DocumentKeywords = ({ keywords }) => {
  if (!keywords.length) {
    return (
      <React.Fragment>
        <dt>Keywords</dt>
        <dd>No keywords</dd>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <dt>Keywords</dt>
      <dd>
        <KeywordsList>
          {keywords.map((k) => {
            const under = k.path.split('|').slice(0, -1).join(' > ');
            return (
              <li key={k.value}>
                {k.label} <KeywordUnder>Under: {under}</KeywordUnder>
              </li>
            );
          })}
        </KeywordsList>
      </dd>
    </React.Fragment>
  );
};

DocumentKeywords.propTypes = {
  keywords: T.arrayOf(
    T.shape({
      label: T.string,
      value: T.string,
      id: T.int,
      path: T.string
    })
  )
};

const DOIValue = styled.dd`
  display: flex;
  align-items: center;

  ${Button} {
    margin-left: ${glsp(0.25)};
  }
`;

const DOIAddress = ({ value }) => {
  if (!value) {
    return (
      <React.Fragment>
        <dt>DOI</dt>
        <dd>None provided</dd>
      </React.Fragment>
    );
  }

  const isUrl = value.match(/https?:\/\//);

  const doiAddress = isUrl ? value : `https://doi.org/${value}`;

  return (
    <React.Fragment>
      <dt>DOI</dt>
      <DOIValue>
        <a href={doiAddress} title='DOI of the present document'>
          {value}
        </a>
        <CopyField value={doiAddress}>
          {({ showCopiedMsg, ref }) => (
            <Tip
              title={showCopiedMsg ? 'Copied' : 'Click to copy DOI'}
              hideOnClick={false}
            >
              <Button
                ref={ref}
                useIcon='clipboard'
                variation='base-plain'
                size='small'
                hideText
              >
                Copy DOI
              </Button>
            </Tip>
          )}
        </CopyField>
      </DOIValue>
    </React.Fragment>
  );
};

DOIAddress.propTypes = {
  value: T.string
};

function DocumentTitle(props) {
  const { data: atbdData } = props;

  return (
    <DocumentHeader>
      <DocumentHeading id='doc-header' data-scroll='target'>
        {resolveTitle(atbdData.title)}
      </DocumentHeading>
      <DocumentMetaDetails>
        <dt>Version</dt>
        <dd>{atbdData.version}</dd>
        <ReleaseDate date={getCitationPublicationDate(atbdData).date} />
        <DocumentKeywords keywords={atbdData.keywords} />
        <dt>Creators</dt>
        <dd>{atbdData.citation?.creators || 'None provided'}</dd>
        <dt>Editors</dt>
        <dd>{atbdData.citation?.editors || 'None provided'}</dd>
        <DOIAddress value={atbdData.doi} />
      </DocumentMetaDetails>
    </DocumentHeader>
  );
}

DocumentTitle.propTypes = {
  data: T.shape({
    title: T.string,
    version: T.string,
    keywords: T.arrayOf(T.string),
    citation: T.shape({
      creators: T.string,
      editors: T.string
    }),
    doi: T.string
  })
};

export default DocumentTitle;
