import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button } from '@devseed-ui/button';
import { GlobalLoading } from '@devseed-ui/global-loading';

import App from '../../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';
import { HubList, HubListItem } from '../../../styles/hub';
import { ContentBlock } from '../../../styles/content-block';

import { useAtbds } from '../../../context/atbds-list';
import { atbdEdit } from '../../../utils/url-creator';
import { createProcessToast } from '../../common/toasts';
import AtbdHubEntry from './atbd-hub-entry';

function Documents() {
  const { fetchAtbds, createAtbd, atbds } = useAtbds();
  const history = useHistory();

  useEffect(() => {
    fetchAtbds();
  }, []);

  if (atbds.error) {
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

  return (
    <App pageTitle='Documents'>
      {atbds.status === 'loading' && <GlobalLoading />}
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Documents</InpageTitle>
          </InpageHeadline>
          <InpageActions>
            <Button
              variation='achromic-plain'
              title='Create new ATBD'
              onClick={onCreateClick}
            >
              Create new
            </Button>
          </InpageActions>
        </InpageHeader>
        <InpageBody>
          <ContentBlock>
            {atbds.status === 'succeeded' && !atbds.data?.length && (
              <div>
                There are no documents. You can start by creating one.
                <Button
                  to='/'
                  variation='primary-raised-dark'
                  title='Create new'
                >
                  Create new
                </Button>
              </div>
            )}
            {atbds.status === 'succeeded' && atbds.data?.length && (
              <HubList>
                {atbds.data.map((atbd) => (
                  <HubListItem key={atbd.id}>
                    <AtbdHubEntry atbd={atbd} />
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
