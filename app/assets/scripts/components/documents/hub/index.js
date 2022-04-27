import React, { useEffect } from 'react';
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
import { Can } from '../../../a11n';
import { Link } from '../../../styles/clean/link';

import { useAtbds } from '../../../context/atbds-list';
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
  const { fetchAtbds, atbds } = useAtbds();

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

  return (
    <App pageTitle='ATBDs'>
      {atbds.status === 'loading' && <GlobalLoading />}
      <Inpage>
        <InpageHeaderSticky>
          <InpageHeadline>
            <InpageTitle>ATBDs</InpageTitle>
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
                    <DocumentHubEntry atbd={atbd} />
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
