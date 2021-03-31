import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import { Button } from '@devseed-ui/button';
import { GlobalLoading } from '@devseed-ui/global-loading';

import App from '../../common/app';
import {
  Inpage,
  InpageHeader,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';
import UhOh from '../../uhoh';
import { ContentBlock } from '../../../styles/content-block';
import Prose from '../../../styles/typography/prose';
import DocumentNavHeader from '../document-nav-header';
import AtbdActionsMenu from '../atbd-actions-menu';

import { useSingleAtbd } from '../../../context/atbds-list';
import { calculateAtbdCompleteness } from '../completeness';
import { confirmDeleteAtbdVersion } from '../../common/confirmation-prompt';
import toasts from '../../common/toasts';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;
`;

function DocumentView() {
  const { id, version } = useParams();
  const history = useHistory();
  const { atbd, fetchSingleAtbd, deleteAtbdVersion } = useSingleAtbd({
    id,
    version
  });

  useEffect(() => {
    fetchSingleAtbd();
  }, [id, version]);

  const onDocumentMenuAction = useCallback(
    async (menuId) => {
      if (menuId === 'delete') {
        const { result: confirmed } = await confirmDeleteAtbdVersion(
          atbd.data?.title,
          atbd.data?.version
        );

        if (confirmed) {
          const result = await deleteAtbdVersion();
          if (result.error) {
            toasts.error(`An error occurred: ${result.error.message}`);
          } else {
            toasts.success('ATBD successfully deleted');
            history.push('/documents');
          }
        }
      }
    },
    [atbd.data?.title, atbd.data?.version, deleteAtbdVersion, history]
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

  const completeness = atbd.data
    ? calculateAtbdCompleteness(atbd.data).percent
    : 0;

  return (
    <App pageTitle='Document view'>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && (
        <Inpage>
          <InpageHeader>
            <DocumentNavHeader
              atbdId={id}
              title={atbd.data.title}
              status={atbd.data.status}
              version={version}
              versions={atbd.data.versions}
              completeness={completeness}
              mode='view'
            />
            <InpageActions>
              <Button to='/' variation='achromic-plain' title='Create new'>
                Button
              </Button>
              <AtbdActionsMenu
                // In the case of a single ATBD the selected version data is
                // merged with the ATBD meta and that's why both variables are
                // the same.
                atbd={atbd.data}
                atbdVersion={atbd.data}
                variation='achromic-plain'
                onSelect={onDocumentMenuAction}
              />
            </InpageActions>
          </InpageHeader>
          <InpageBodyScroll>
            <ContentBlock>
              <Prose>
                <p>Hello world!</p>
              </Prose>
            </ContentBlock>
          </InpageBodyScroll>
        </Inpage>
      )}
    </App>
  );
}

export default DocumentView;
