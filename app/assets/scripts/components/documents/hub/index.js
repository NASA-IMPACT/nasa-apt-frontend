import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
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
import { HubList, HubListItem } from '../../../styles/hub';
import { ContentBlock } from '../../../styles/content-block';
import ButtonSecondary from '../../../styles/button-secondary';
import AtbdHubEntry from './atbd-hub-entry';
import { EmptyHub } from '../../common/empty-states';

import { useAtbds } from '../../../context/atbds-list';
import { atbdEdit, atbdView } from '../../../utils/url-creator';
import { createProcessToast } from '../../common/toasts';
import { atbdDeleteFullConfirmAndToast } from '../atbd-delete-process';
import { Can } from '../../../a11n';
import { Link } from '../../../styles/clean/link';

function Documents() {
  const { fetchAtbds, createAtbd, deleteFullAtbd, atbds } = useAtbds();
  const history = useHistory();

  useEffect(() => {
    fetchAtbds();
  }, []);

  // We only want to handle errors when the atbd request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (atbds.status === 'failed' && atbds.error) {
    // This is a serious server error. By throwing it will be caught by the
    // error boundary. There's no recovery from this error.
    throw atbds.error;
  }

  const onCreateClick = async () => {
    const processToast = createProcessToast('Creating new ATBD');
    const result = await createAtbd();

    if (result.error) {
      processToast.error(`An error occurred: ${result.error.message}`);
    } else {
      processToast.success('ATBD successfully created');
      history.push(atbdEdit(result.data));
    }
  };

  const onDocumentAction = useCallback(
    async (atbd, menuId) => {
      switch (menuId) {
        case 'delete':
          await atbdDeleteFullConfirmAndToast({
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
          // app/assets/scripts/components/documents/document-publishing-actions.js
          history.push(atbdView(atbd), { menuAction: menuId });
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
          <ContentBlock>
            {atbds.status === 'succeeded' && !atbds.data?.length && (
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
            )}
            {atbds.status === 'succeeded' && atbds.data?.length && (
              <HubList>
                {atbds.data.map((atbd) => (
                  <HubListItem key={atbd.id}>
                    <AtbdHubEntry
                      atbd={atbd}
                      onDocumentAction={onDocumentAction}
                    />
                  </HubListItem>
                ))}
              </HubList>
            )}
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Documents;
