import React, { useCallback, useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { VerticalDivider } from '@devseed-ui/toolbar';
import { Button } from '@devseed-ui/button';

import App from '../../common/app';
import {
  Inpage,
  InpageHeaderSticky,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';
import UhOh from '../../uhoh';
import { ContentBlock } from '../../../styles/content-block';
import Prose from '../../../styles/typography/prose';
import DetailsList from '../../../styles/typography/details-list';
import DocumentHeadline from '../document-headline';
import DocumentActionsMenu from '../document-actions-menu';
import DocumentDownloadMenu from '../document-download-menu';
import DocumentOutline from './document-outline';
import DocumentBody from './document-body';
import { ScrollAnchorProvider } from './scroll-manager';
import Datetime from '../../common/date';
import Tip from '../../common/tooltip';
import { CopyField } from '../../common/copy-field';

import { useSingleAtbd } from '../../../context/atbds-list';
import { documentDeleteVersionConfirmAndToast } from '../document-delete-process';
import { useDocumentModals, DocumentModals } from '../use-document-modals';
import { documentUpdatedDate } from '../../../utils/date';

const DocumentCanvas = styled(InpageBody)`
  padding: 0;
  display: grid;
  grid-template-columns: min-content 1fr;
  height: 100%;

  > * {
    grid-row: 1;
  }
`;

const DocumentProse = styled(Prose)`
  > * {
    position: relative;
    padding-bottom: ${glsp(3)};
    margin-bottom: ${glsp(3)};

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 1px;
      width: 100%;
      background: ${themeVal('color.baseAlphaC')};
      content: '';
      pointer-events: none;
    }
  }

  > *:last-child {
    padding-bottom: 0;
    margin-bottom: 0;

    &::after {
      display: none;
    }
  }
`;

const DocumentContent = styled.div`
  grid-column: content-start / content-end;
  max-width: 52rem;
`;

const DocumentHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(2)};
`;

const DocumentTitle = styled(Heading)`
  margin: 0;
`;

const DocumentMetaDetails = styled(DetailsList)`
  background: transparent;
`;

const DOIValue = styled.dd`
  display: flex;
  align-items: center;

  ${Button} {
    margin-left: ${glsp(0.25)};
  }
`;

function DocumentView() {
  const { id, version } = useParams();
  const history = useHistory();
  const {
    atbd,
    updateAtbd,
    fetchSingleAtbd,
    deleteAtbdVersion,
    createAtbdVersion,
    publishAtbdVersion
  } = useSingleAtbd({
    id,
    version
  });

  useEffect(() => {
    fetchSingleAtbd();
  }, [id, version, fetchSingleAtbd]);

  const { menuHandler, documentModalProps } = useDocumentModals({
    atbd: atbd.data,
    createAtbdVersion,
    updateAtbd,
    publishAtbdVersion
  });

  const onDocumentMenuAction = useCallback(
    async (menuId) => {
      // Handle actions that would trigger document modals.
      await menuHandler(menuId);

      switch (menuId) {
        case 'delete':
          await documentDeleteVersionConfirmAndToast({
            atbd: atbd.data,
            deleteAtbdVersion,
            history
          });
          break;
      }
    },
    [atbd.data, deleteAtbdVersion, history, menuHandler]
  );

  // We only want to handle errors when the atbd request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (atbd.status === 'failed') {
    const errCode = atbd.error?.response.status;

    if (errCode === 400 || errCode === 404) {
      return <UhOh />;
    } else if (atbd.error) {
      // This is a serious server error. By throwing it will be caught by the
      // error boundary. There's no recovery from this error.
      throw atbd.error;
    }
  }

  const pageTitle = atbd.data?.title
    ? `Viewing ${atbd.data.title}`
    : 'Document view';

  // The updated at is the most recent between the version updated at and the
  // atbd updated at. In the case of a single ATBD the selected version data is
  // merged with the ATBD meta and that's why both variables are
  // the same.
  const updatedDate = atbd.data && documentUpdatedDate(atbd.data, atbd.data);

  return (
    <App pageTitle={pageTitle}>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && (
        <Inpage>
          <DocumentModals {...documentModalProps} />
          <InpageHeaderSticky data-element='inpage-header'>
            <DocumentHeadline
              atbdId={id}
              title={atbd.data.title}
              version={version}
              versions={atbd.data.versions}
              updatedDate={updatedDate}
              onAction={onDocumentMenuAction}
              mode='view'
            />
            <InpageActions>
              <DocumentDownloadMenu atbd={atbd.data} />
              <VerticalDivider variation='light' />
              <DocumentActionsMenu
                // In the case of a single ATBD the selected version data is
                // merged with the ATBD meta and that's why both variables are
                // the same.
                atbd={atbd.data}
                atbdVersion={atbd.data}
                variation='achromic-plain'
                onSelect={onDocumentMenuAction}
                origin='single-view'
              />
            </InpageActions>
          </InpageHeaderSticky>
          <ScrollAnchorProvider>
            <DocumentCanvas>
              <DocumentOutline atbd={atbd.data} />
              <ContentBlock>
                <DocumentContent>
                  <DocumentProse>
                    <DocumentHeader>
                      <DocumentTitle>{atbd.data.title}</DocumentTitle>
                      <DocumentMetaDetails>
                        <dt>Version</dt>
                        <dd>{atbd.data.version}</dd>
                        <ReleaseDate date={atbd.data.citation?.release_date} />
                        <dt>Keywords</dt>
                        <dd>coming soon</dd>
                        <dt>Creators</dt>
                        <dd>
                          {atbd.data.citation?.creators || 'None provided'}
                        </dd>
                        <dt>Editors</dt>
                        <dd>
                          {atbd.data.citation?.editors || 'None provided'}
                        </dd>
                        <DOIAddress value={atbd.data.doi} />
                      </DocumentMetaDetails>
                    </DocumentHeader>
                    <DocumentBody atbd={atbd.data} />
                  </DocumentProse>
                </DocumentContent>
              </ContentBlock>
            </DocumentCanvas>
          </ScrollAnchorProvider>
        </Inpage>
      )}
    </App>
  );
}

export default DocumentView;

const ReleaseDate = ({ date }) => {
  if (!date) {
    return (
      <React.Fragment>
        <dt>Release date</dt>
        <dd>None provided</dd>
      </React.Fragment>
    );
  }

  const dateObj = new Date(date);
  // Not parsable. Print as provided.
  if (isNaN(dateObj.getTime())) {
    return (
      <React.Fragment>
        <dt>Release date</dt>
        <dd>{date}</dd>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <dt>Release date</dt>
      <dd>
        <Datetime date={dateObj} />
      </dd>
    </React.Fragment>
  );
};

ReleaseDate.propTypes = {
  date: T.string
};

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
