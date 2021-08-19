import React, { useCallback, useEffect, useMemo } from 'react';
import T from 'prop-types';
import qs from 'qs';
import ReactGA from 'react-ga';
import styled, { css } from 'styled-components';
import { useLocation } from 'react-router';
import { Modal, ModalFooter } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Accordion, AccordionFold } from '@devseed-ui/accordion';
import collecticon from '@devseed-ui/collecticons';

import {
  Tracker,
  TrackerItem,
  TrackerEntry,
  TrackerEntryTitle,
  SubTracker,
  SubTrackerEntryTitle,
  TrackerTrigger
} from '../../styles/progress-tracker';
import Prose from '../../styles/typography/prose';

import {
  CLOSED_REVIEW,
  CLOSED_REVIEW_REQUESTED,
  DRAFT,
  getDocumentStatusLabel,
  isClosedReview,
  isDraft,
  isDraftEquivalent,
  isOpenReview,
  isPublication,
  isPublicationRequested,
  isPublished,
  isStatusAfter,
  OPEN_REVIEW,
  PUBLICATION,
  PUBLICATION_REQUESTED,
  PUBLISHED,
  REVIEW_DONE
} from './status';
import { useStatusColors } from '../../utils/use-status-colors';
import { calculateDocumentCompleteness } from './completeness';
import { journalStatusIcons } from '../common/status-pill';

const ModalInnerContent = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${glsp(themeVal('layout.gap.medium'))};
`;

const TrackerEntryTitleIconified = styled(TrackerEntryTitle)`
  ${({ useIcon }) =>
    useIcon &&
    css`
      &::after {
        ${collecticon(useIcon)}
      }
    `}
`;

const TriggeringTitle = (props) => {
  const {
    isFoldExpanded,
    setFoldExpanded,
    swatchColor,
    useIcon,
    children
  } = props;

  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      setFoldExpanded(!isFoldExpanded);
    },
    [isFoldExpanded, setFoldExpanded]
  );

  return (
    <TrackerTrigger
      href='#'
      isExpanded={isFoldExpanded}
      onClick={onClick}
      title={isFoldExpanded ? 'Contract' : 'Expand'}
    >
      <TrackerEntryTitleIconified swatchColor={swatchColor} useIcon={useIcon}>
        {children}
      </TrackerEntryTitleIconified>
    </TrackerTrigger>
  );
};

TriggeringTitle.propTypes = {
  isFoldExpanded: T.bool,
  setFoldExpanded: T.func,
  swatchColor: T.string,
  useIcon: T.string,
  children: T.node
};

const TrackerEntryFold = (props) => {
  const {
    index,
    checkExpanded,
    setExpanded,
    swatchColor,
    titleIcon,
    title,
    content
  } = props;

  return (
    <AccordionFold
      forwardedAs={TrackerEntry}
      isFoldExpanded={checkExpanded(index)}
      setFoldExpanded={(v) => setExpanded(index, v)}
      renderHeader={({ isFoldExpanded, setFoldExpanded }) => (
        <TriggeringTitle
          isFoldExpanded={isFoldExpanded}
          setFoldExpanded={setFoldExpanded}
          swatchColor={swatchColor}
          useIcon={titleIcon}
        >
          {title}
        </TriggeringTitle>
      )}
      renderBody={() => content}
    />
  );
};

TrackerEntryFold.propTypes = {
  index: T.number,
  checkExpanded: T.func,
  setExpanded: T.func,
  swatchColor: T.string,
  titleIcon: T.string,
  title: T.string,
  content: T.node
};

export default function DocumentTrackerModal(props) {
  const { atbd, revealed, onClose } = props;
  const { statusMapping } = useStatusColors();
  const location = useLocation();

  useEffect(() => {
    if (revealed) {
      ReactGA.modalview('document-progress-tracker');
    }
  }, [revealed]);

  const isWelcome = useMemo(
    () =>
      typeof qs.parse(location.search, { ignoreQueryPrefix: true }).welcome !==
      'undefined',
    [location.search]
  );

  const checkStatusProgress = useCallback(
    (status) => {
      // Special handling for items with a sub tracker.
      if (status === DRAFT) {
        if (isStatusAfter(atbd, CLOSED_REVIEW_REQUESTED)) {
          return 'complete';
        } else if (isStatusAfter(atbd, DRAFT)) {
          return 'progress-child';
        } else {
          return 'progress';
        }
      }
      if (status === OPEN_REVIEW) {
        if (isStatusAfter(atbd, PUBLICATION_REQUESTED)) {
          return 'complete';
        } else if (isStatusAfter(atbd, OPEN_REVIEW)) {
          return 'progress-child';
        }
      }
      // Since Published is the last status it must be marked as completed
      // because Published can never be in progress.
      if (isPublished(atbd)) return 'complete';
      if (atbd.status === status) return 'progress';
      if (isStatusAfter(atbd, status)) return 'complete';
      // Or undefined.
    },
    [atbd]
  );

  const percentDraft = useMemo(() => {
    const { percent = 0 } = calculateDocumentCompleteness(atbd);
    return percent;
  }, [atbd]);

  const { revTotal, revCompleted } = useMemo(() => {
    const { reviewers = [] } = atbd;
    return {
      revTotal: reviewers.length,
      revCompleted: reviewers.filter((r) => r.review_status === REVIEW_DONE)
        .length
    };
  }, [atbd]);

  const initialAccordionState = useMemo(
    () => [
      // The accordion initial status is an array with a boolean value for each
      // of the folds.
      // Fold index 0:
      isDraftEquivalent(atbd),
      // Fold index 1:
      isClosedReview(atbd),
      // Fold index 2:
      isOpenReview(atbd) || isPublicationRequested(atbd),
      // Fold index 3:
      isPublication(atbd),
      // Fold index 4:
      isPublished(atbd)
    ],
    [atbd]
  );

  return (
    <Modal
      id='modal'
      size='medium'
      revealed={revealed}
      onCloseClick={onClose}
      title={isWelcome ? 'Welcome to your new document' : 'Document status'}
      content={
        <ModalInnerContent>
          {isWelcome && (
            <Prose>
              <p>
                The form on this page is divided into several steps and contains
                all the fields needed to create a document. You can freely move
                between steps and add content in any order you like. Invite
                other users to help with the writing process using the
                collaborator options. Only you and invited users will have
                access to this document.
              </p>
              <p>
                A document goes through different stages, each one with
                different actions required. The progress tracker below offers an
                overview of all the stages as well as the current progress.
              </p>
            </Prose>
          )}

          <Accordion initialState={initialAccordionState}>
            {({ checkExpanded, setExpanded }) => (
              <Tracker>
                <TrackerItem status={checkStatusProgress(DRAFT)}>
                  <TrackerEntryFold
                    index={0}
                    checkExpanded={checkExpanded}
                    setExpanded={setExpanded}
                    swatchColor={statusMapping[DRAFT]}
                    title={`${getDocumentStatusLabel(DRAFT)}${
                      isDraft(atbd) ? `: ${percentDraft}%` : ''
                    }`}
                    content={
                      <p>
                        The Draft stage is where most of the document creation
                        work happens. Authors will be able to go through the
                        different document steps in any order they please and
                        add content to the ATBD. Once done the Lead Author will
                        submit the document for review.
                      </p>
                    }
                  />
                  <SubTracker>
                    <TrackerItem
                      status={checkStatusProgress(CLOSED_REVIEW_REQUESTED)}
                    >
                      <TrackerEntry>
                        <SubTrackerEntryTitle>
                          Review requested
                        </SubTrackerEntryTitle>
                      </TrackerEntry>
                    </TrackerItem>
                  </SubTracker>
                </TrackerItem>
                <TrackerItem status={checkStatusProgress(CLOSED_REVIEW)}>
                  <TrackerEntryFold
                    index={1}
                    checkExpanded={checkExpanded}
                    setExpanded={setExpanded}
                    swatchColor={statusMapping[CLOSED_REVIEW]}
                    title={`${getDocumentStatusLabel(CLOSED_REVIEW)}${
                      isClosedReview(atbd)
                        ? `: ${revCompleted}/${revTotal}`
                        : ''
                    }`}
                    content={
                      <p>
                        During the closed review stage, the edition of the
                        document is blocked. The reviewers that the curator
                        assigned to the document are going through it and
                        leaving comments with their notes. The authors can read
                        and reply the comments but can make no changes to the
                        document.
                      </p>
                    }
                  />
                </TrackerItem>
                <TrackerItem status={checkStatusProgress(OPEN_REVIEW)}>
                  <TrackerEntryFold
                    index={2}
                    checkExpanded={checkExpanded}
                    setExpanded={setExpanded}
                    swatchColor={statusMapping[OPEN_REVIEW]}
                    title={getDocumentStatusLabel(OPEN_REVIEW)}
                    content={
                      <p>
                        With the Open Review the document is editable again and
                        reviewers and authors work together iteratively to
                        address any issues. When all the comments are marked as
                        resolved the Lead Author can submit the document for
                        publication (curation).
                      </p>
                    }
                  />
                  <SubTracker>
                    <TrackerItem
                      status={checkStatusProgress(PUBLICATION_REQUESTED)}
                    >
                      <TrackerEntry>
                        <SubTrackerEntryTitle>
                          Publication requested
                        </SubTrackerEntryTitle>
                      </TrackerEntry>
                    </TrackerItem>
                  </SubTracker>
                </TrackerItem>
                <TrackerItem status={checkStatusProgress(PUBLICATION)}>
                  <TrackerEntryFold
                    index={3}
                    checkExpanded={checkExpanded}
                    setExpanded={setExpanded}
                    swatchColor={statusMapping[PUBLICATION]}
                    title={getDocumentStatusLabel(PUBLICATION)}
                    titleIcon={
                      isPublication(atbd)
                        ? journalStatusIcons[atbd.journal_status]
                        : undefined
                    }
                    content={
                      <p>
                        If the document was scheduled to be published in the
                        Journal, it goes through the journal publication process
                        outside of APT, otherwise the the last actions are taken
                        to have the document published on the platform.
                      </p>
                    }
                  />
                </TrackerItem>
                <TrackerItem status={checkStatusProgress(PUBLISHED)}>
                  <TrackerEntryFold
                    index={4}
                    checkExpanded={checkExpanded}
                    setExpanded={setExpanded}
                    swatchColor={statusMapping[PUBLISHED]}
                    title={getDocumentStatusLabel(PUBLISHED)}
                    titleIcon={
                      isPublished(atbd)
                        ? journalStatusIcons[atbd.journal_status]
                        : undefined
                    }
                    content={
                      <p>
                        At this point, the document is published in APT and
                        publicly available to all users. If the document is also
                        published to the journal, an icon is displayed to convey
                        this information.
                      </p>
                    }
                  />
                </TrackerItem>
              </Tracker>
            )}
          </Accordion>
        </ModalInnerContent>
      }
      renderFooter={(bag) => (
        <ModalFooter>
          <Button
            variation='primary-raised-dark'
            title='Close modal'
            useIcon='tick--small'
            onClick={bag.close}
          >
            {isWelcome ? 'Understood' : 'Dismiss'}
          </Button>
        </ModalFooter>
      )}
    />
  );
}

DocumentTrackerModal.propTypes = {
  atbd: T.object,
  revealed: T.bool,
  onClose: T.func
};
