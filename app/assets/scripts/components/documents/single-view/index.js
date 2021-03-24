import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
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
import Constrainer from '../../../styles/constrainer';
import Prose from '../../../styles/typography/prose';
import { useSingleAtbd } from '../../../context/atbds-list';
import DocumentNavHeader from '../document-nav-header';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
  }
`;

function DocumentView() {
  const { id, version } = useParams();
  const { atbd, fetchSingleAtbd } = useSingleAtbd({ id, version });

  useEffect(() => {
    fetchSingleAtbd();
  }, [id, version]);

  const errCode = atbd.error?.response.status;

  if (errCode === 400 || errCode === 404) {
    return <UhOh />;
  } else if (errCode) {
    // This is a serious server error. By throwing it will be caught by the
    // error boundary. There's no recovery from this error.
    throw atbd.error;
  }

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
              currentVersion={version}
              versions={atbd.data.versions}
              mode='view'
            />
            <InpageActions>
              <Button to='/' variation='achromic-plain' title='Create new'>
                Button
              </Button>
            </InpageActions>
          </InpageHeader>
          <InpageBodyScroll>
            <Constrainer>
              <Prose>
                <p>Hello world!</p>
              </Prose>
            </Constrainer>
          </InpageBodyScroll>
        </Inpage>
      )}
    </App>
  );
}

export default DocumentView;
