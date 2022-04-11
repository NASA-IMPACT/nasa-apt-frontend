import React, { useCallback, useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import {
  glsp,
  media,
  multiply,
  themeVal,
  listReset
} from '@devseed-ui/theme-provider';
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
import Forbidden from '../../../a11n/forbidden';
import Prose, { proseSpacing } from '../../../styles/typography/prose';
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
import DocumentGovernanceAction from '../document-governance-action';

import {
  useSingleAtbd,
  useSingleAtbdEvents
} from '../../../context/atbds-list';
import { documentDeleteVersionConfirmAndToast } from '../document-delete-process';
import { useDocumentModals, DocumentModals } from '../use-document-modals';
import { useUser } from '../../../context/user';
import {
  useCommentCenter,
  useCommentCenterHistoryHandler
} from '../../../context/comment-center';
import { useThreadStats } from '../../../context/threads-list';
import { useEffectPrevious } from '../../../utils/use-effect-previous';
import { getCitationPublicationDate } from '../citation';

const DocumentCanvas = styled(InpageBody)`
  padding: 0;
  display: grid;
  grid-template-columns: min-content 1fr;
  height: 100%;

  > * {
    grid-row: 1;
  }
`;

const InpageViewActions = styled(InpageActions)`
  ${VerticalDivider}:first-child {
    display: none;
  }
`;

const DocumentProse = styled(Prose)`
  > * {
    position: relative;
    padding-bottom: ${multiply(proseSpacing, 2)};
    margin-bottom: ${multiply(proseSpacing, 2)};

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
  max-width: 52rem;
  padding: ${glsp(themeVal('layout.gap.xsmall'))};

  ${media.smallUp`
    padding: ${glsp(themeVal('layout.gap.small'))};
  `}

  ${media.mediumUp`
    padding: ${glsp(themeVal('layout.gap.medium'))};
  `}

  ${media.largeUp`
    padding: ${glsp(themeVal('layout.gap.large'))};
  `}

  ${media.xlargeUp`
    padding: ${glsp(themeVal('layout.gap.xlarge'))};
  `}
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

const KeywordUnder = styled.small`
  display: block;
  opacity: 0.48;
`;

function DocumentView() {
  const { id, version } = useParams();
  const history = useHistory();
  const { isAuthReady } = useUser();
  const {
    atbd,
    updateAtbd,
    fetchSingleAtbd,
    deleteAtbdVersion,
    createAtbdVersion
  } = useSingleAtbd({ id, version });
  // Get all fire event actions.
  const atbdFevActions = useSingleAtbdEvents({ id, version });
  // Thread stats - function for initial fetching which stores the document for
  // which stats are being fetched. Calls to the the refresh (exported by
  // useThreadStats) function will use the same stored document.
  const { fetchThreadsStatsForAtbds } = useThreadStats();

  const { isPanelOpen, setPanelOpen, openPanelOn } = useCommentCenter({ atbd });

  // Se function definition for explanation.
  useCommentCenterHistoryHandler({ atbd });

  // Fetch the thread stats list to show in the button when the document loads.
  useEffectPrevious(
    (prev) => {
      const prevStatus = prev?.[0]?.status;
      // This hook is called when the "atbd" changes, which happens also when
      // there's a mutation, but we don't want to fetch stats on mutations, only
      // when the atbd is fetched (tracked by a .status change.)
      if (prevStatus !== atbd.status && atbd.status === 'succeeded') {
        fetchThreadsStatsForAtbds(atbd.data);
      }
    },
    [atbd, fetchThreadsStatsForAtbds]
  );

  useEffect(() => {
    isAuthReady && fetchSingleAtbd();
  }, [isAuthReady, id, version, fetchSingleAtbd]);

  const { menuHandler, documentModalProps } = useDocumentModals({
    atbd: atbd.data,
    createAtbdVersion,
    updateAtbd,
    ...atbdFevActions
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
        case 'toggle-comments':
          if (isPanelOpen) {
            setPanelOpen(false);
          } else {
            openPanelOn({
              // The atbdId must be numeric. The alias does not work.
              atbdId: atbd.data.id,
              atbdVersion: atbd.data.version
            });
          }
      }
    },
    [
      atbd.data,
      deleteAtbdVersion,
      history,
      menuHandler,
      isPanelOpen,
      setPanelOpen,
      openPanelOn
    ]
  );

  // We only want to handle errors when the atbd request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (atbd.status === 'failed') {
    const errCode = atbd.error?.response.status;

    if (errCode === 400 || errCode === 404) {
      return <UhOh />;
    } else if (errCode === 403) {
      return <Forbidden />;
    } else if (atbd.error) {
      // This is a serious server error. By throwing it will be caught by the
      // error boundary. There's no recovery from this error.
      throw atbd.error;
    }
  }

  const pageTitle = atbd.data?.title
    ? `Viewing ${atbd.data.title}`
    : 'ATBD view';

  return (
    <App pageTitle={pageTitle}>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && (
        <Inpage>
          <DocumentModals {...documentModalProps} />
          <InpageHeaderSticky data-element='inpage-header'>
            <DocumentHeadline
              atbd={atbd.data}
              onAction={onDocumentMenuAction}
              mode='view'
            />
            <InpageViewActions>
              <DocumentGovernanceAction
                atbdId={id}
                version={version}
                atbd={atbd.data}
                origin='single-view'
                onAction={onDocumentMenuAction}
              />
              <VerticalDivider variation='light' />
              <DocumentDownloadMenu
                atbd={atbd.data}
                variation='achromic-plain'
              />
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
            </InpageViewActions>
          </InpageHeaderSticky>
          <ScrollAnchorProvider>
            <DocumentCanvas>
              <DocumentOutline atbd={atbd.data} />
              <DocumentContent>
                <DocumentProse>
                  <DocumentHeader>
                    <DocumentTitle id='doc-header' data-scroll='target'>
                      {atbd.data.title}
                    </DocumentTitle>
                    <DocumentMetaDetails>
                      <dt>Version</dt>
                      <dd>{atbd.data.version}</dd>
                      <ReleaseDate
                        date={getCitationPublicationDate(atbd.data).date}
                      />
                      <DocumentKeywords keywords={atbd.data.keywords} />
                      <dt>Creators</dt>
                      <dd>{atbd.data.citation?.creators || 'None provided'}</dd>
                      <dt>Editors</dt>
                      <dd>{atbd.data.citation?.editors || 'None provided'}</dd>
                      <DOIAddress value={atbd.data.doi} />
                    </DocumentMetaDetails>
                  </DocumentHeader>
                  <DocumentBody atbd={atbd.data} />
                </DocumentProse>
              </DocumentContent>
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
