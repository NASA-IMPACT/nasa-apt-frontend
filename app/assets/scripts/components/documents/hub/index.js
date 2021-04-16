import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button } from '@devseed-ui/button';
import { GlobalLoading } from '@devseed-ui/global-loading';

import App from '../../../common/app';
import {
  Inpage,
  InpageHeaderSticky,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../../../styles/inpage';
import { HubList, HubListItem } from '../../../../styles/hub';
import { ContentBlock } from '../../../../styles/content-block';
import ButtonSecondary from '../../../../styles/button-secondary';
import AtbdHubEntry from './atbd-hub-entry';

import { useAtbds } from '../../../../context/atbds-list';
import { atbdEdit } from '../../../../utils/url-creator';
import toasts, { createProcessToast } from '../../../common/toasts';
import { confirmDeleteAtbd } from '../../../common/confirmation-prompt';

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
      if (menuId === 'delete') {
        const { result: confirmed } = await confirmDeleteAtbd(atbd.title);
        if (confirmed) {
          const result = await deleteFullAtbd({ id: atbd.id });
          if (result.error) {
            toasts.error(`An error occurred: ${result.error.message}`);
          } else {
            toasts.success('ATBD successfully deleted');
          }
        }
      }
    },
    [deleteFullAtbd]
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
            <ButtonSecondary
              title='Create new document'
              useIcon='plus--small'
              onClick={onCreateClick}
            >
              Create
            </ButtonSecondary>
          </InpageActions>
        </InpageHeaderSticky>
        <InpageBody>
          <ContentBlock>
            {atbds.status === 'succeeded' && !atbds.data?.length && (
              <div>
                There are no documents. You can start by creating one.
                <Button
                  variation='primary-raised-dark'
                  title='Create new document'
                  useIcon='plus--small'
                  onClick={onCreateClick}
                >
                  Create
                </Button>
              </div>
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
