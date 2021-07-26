import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { glsp, media, themeVal } from '@devseed-ui/theme-provider';

import { Button } from '@devseed-ui/button';
import { GlobalLoading } from '@devseed-ui/global-loading';

import App from '../../common/app';
import {
  Inpage,
  InpageHeaderSticky,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';
import { ContentBlock } from '../../../styles/content-block';
import ButtonSecondary from '../../../styles/button-secondary';
import DocumentHubEntry from './document-hub-entry';
import { EmptyHub } from '../../common/empty-states';
import { useAtbds } from '../../../context/atbds-list';
import { documentView } from '../../../utils/url-creator';
import { documentDeleteFullConfirmAndToast } from '../document-delete-process';
import { Can } from '../../../a11n';
import { Link } from '../../../styles/clean/link';
import { useDocumentCreate } from '../single-edit/use-document-create';

export const DocList = styled.ol`
  grid-column: content-start / content-end;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};

  ${media.smallUp`
    grid-template-columns: repeat(2, 1fr);
    grid-gap: ${glsp(themeVal('layout.gap.small'))};
  `}

  ${media.mediumUp`
    grid-template-columns: repeat(2, 1fr);
    grid-gap: ${glsp(themeVal('layout.gap.medium'))};
  `}

  ${media.largeUp`
    grid-gap: ${glsp(themeVal('layout.gap.large'))};
  `}
`;

export const DocListItem = styled.li`
  > * {
    height: 100%;
  }
`;

function Documents() {
  const { fetchAtbds, deleteFullAtbd, atbds } = useAtbds();
  const history = useHistory();

  useEffect(() => {
    fetchAtbds();
  }, [fetchAtbds]);

  // We only want to handle errors when the atbd request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (atbds.status === 'failed' && atbds.error) {
    // This is a serious server error. By throwing it will be caught by the
    // error boundary. There's no recovery from this error.
    throw atbds.error;
  }

  const onCreateClick = useDocumentCreate();

  const onDocumentAction = useCallback(
    async (menuId, { atbd }) => {
      switch (menuId) {
        case 'delete':
          await documentDeleteFullConfirmAndToast({
            atbd,
            deleteFullAtbd
          });
          break;
        case 'update-minor':
        case 'draft-major':
        case 'publish':
        case 'view-info':
          // To trigger the modals to open from other pages, we use the history
          // state as the user is sent from one page to another. See explanation
          // on
          // app/assets/scripts/components/documents/use-document-modals.js
          history.push(documentView(atbd), { menuAction: menuId });
          break;
      }
    },
    [deleteFullAtbd, history]
  );

  return (
    <App pageTitle='Documents'>
      {atbds.status === 'loading' && <GlobalLoading />}
      <Inpage>
        <InpageHeaderSticky>
          <InpageHeadline>
            <InpageTitle>Documents</InpageTitle>
          </InpageHeadline>
          <InpageActions>
            <Button
              as={Link}
              to='/documents/search'
              variation='achromic-plain'
              title='Search documents'
              useIcon='magnifier-right'
            >
              Search
            </Button>
            <Can do='create' on='documents'>
              <ButtonSecondary
                title='Create new document'
                useIcon='plus--small'
                onClick={onCreateClick}
              >
                Create
              </ButtonSecondary>
            </Can>
          </InpageActions>
        </InpageHeaderSticky>
        <InpageBody>
          {atbds.status === 'succeeded' && !atbds.data?.length && (
            <ContentBlock style={{ height: '100%' }}>
              <EmptyHub>
                <Can do='create' on='document'>
                  <p>
                    APT is a repository for scientific documents, but none
                    exist. Start by creating one.
                  </p>
                  <Button
                    variation='primary-raised-dark'
                    title='Create new document'
                    useIcon='plus--small'
                    onClick={onCreateClick}
                  >
                    Create document
                  </Button>
                </Can>
                <Can not do='create' on='document'>
                  <p>
                    APT is a repository for scientific documents, but none
                    exist.
                  </p>
                  <p>
                    <Link to='/signin' title='Sign in now'>
                      Sign in
                    </Link>{' '}
                    in to create one.
                  </p>
                </Can>
              </EmptyHub>
            </ContentBlock>
          )}
          {atbds.status === 'succeeded' && atbds.data?.length && (
            <ContentBlock>
              <DocList>
                {atbds.data.map((atbd) => (
                  <DocListItem key={atbd.id}>
                    <DocumentHubEntry
                      atbd={atbd}
                      onDocumentAction={onDocumentAction}
                    />
                  </DocListItem>
                ))}
              </DocList>
            </ContentBlock>
          )}
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Documents;
