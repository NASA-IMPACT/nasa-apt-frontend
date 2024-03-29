import React, { useCallback, useEffect, useMemo } from 'react';
import T from 'prop-types';
import qs from 'qs';
import ReactGA from 'react-ga4';
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
  isPublicationRequested,
  isPublished,
  isStatusAfter,
  OPEN_REVIEW,
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
  const { isFoldExpanded, setFoldExpanded, swatchColor, useIcon, children } =
    props;

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
      ReactGA.send({
        hitType: 'modalview',
        page: '/modal/document-progress-tracker'
      });
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
      // Fold index 4:
      isPublished(atbd)
    ],
    [atbd]
  );

  const pdfMode = atbd?.document_type === 'PDF';

  const infoText = pdfMode ? (
    <Prose>
      <p>
        The form on this page is divided into several steps and contains all the
        fields needed to create a document. You can move freely between steps
        and add content in any order. Invite other users to help with the
        writing process using the collaborator options. Only you, APT curators,
        and invited users will have access to this document.
      </p>
      <p>
        A document goes through different stages, each with different required
        actions. The progress tracker below offers an overview of all the
        stages, as well as the current progress.
      </p>
    </Prose>
  ) : (
    <Prose>
      <p>
        The form on this page is divided into several steps and contains all the
        fields needed to create a document. You can freely move between steps
        and add content in any order you like. Invite other users to help with
        the writing process using the collaborator options. Only you, the APT
        Curators, and invited users will have access to this document.
      </p>
      <p>
        A document goes through different stages, each one with different
        actions required. The progress tracker below offers an overview of all
        the stages as well as the current progress.
      </p>
    </Prose>
  );

  const draftText = pdfMode ? (
    <p>
      The Draft stage is where the majority of document creation work occurs.
      The author can download an ATBD template and upload the completed document
      as a PDF. Authors can complete different document steps in any order and
      add metadata content to the ATBD. Once completed, the Lead Author can
      submit the document for review.
    </p>
  ) : (
    <p>
      The Draft stage is where most of the document creation work happens.
      Authors will be able to go through the different document steps in any
      order they please and add content to the ATBD. Once done the Lead Author
      will submit the document for review.
    </p>
  );

  const closedReviewText = pdfMode ? (
    <Prose>
      <p>
        During the closed review stage, the reviewers assigned to the document
        review it and leave comments with notes. Authors can read and reply to
        the comments. Once the reviewers complete their review, the document
        will be transitioned to Open Review.
      </p>

      <p>
        If the ATBD is reviewed externally, the author can email the curator to
        alert them that the document has been reviewed outside the APT
        interface. The curator will contact the reviewers to confirm that the
        reviewers have reviewed and approved the ATBD. The curator will then
        review the ATBD for completeness. If the ATBD is incomplete, the curator
        will contact the lead author for changes. If all required elements are
        there, the curator will close the review. The Lead Author can submit the
        document for publication.
      </p>
    </Prose>
  ) : (
    <p>
      During the closed review stage, the edition of the document is blocked.
      The reviewers that the curator assigned to the document are going through
      it and leaving comments with their notes. The authors can read and reply
      the comments but can make no changes to the document.
    </p>
  );

  const inReviewText = pdfMode ? (
    <p>
      In Open Review, reviewers and authors work together iteratively to address
      any issues. Authors must make the necessary edits and re-upload their
      ATBD. When all the comments are marked as resolved, the Lead Author can
      submit the document for publication.
    </p>
  ) : (
    <p>
      With the Open Review the document is editable again and reviewers and
      authors work together iteratively to address any issues. When all the
      comments are marked as resolved the Lead Author can submit the document
      for publication (curation).
    </p>
  );

  const publishedText = pdfMode ? (
    <p>
      At this point, the document is published in APT and publicly available to
      all users. An icon will be displayed if the document is also published to
      the journal.
    </p>
  ) : (
    <p>
      At this point, the document is published in APT and publicly available to
      all users. If the document is also published to the journal, an icon is
      displayed to convey this information.
    </p>
  );

  return (
    <Modal
      id='modal'
      size='medium'
      revealed={revealed}
      onCloseClick={onClose}
      title={isWelcome ? 'Welcome to your new document' : 'Document status'}
      data-cy='document-tracker-modal'
      content={
        <ModalInnerContent>
          {isWelcome && infoText}
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
                    content={draftText}
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
                    content={closedReviewText}
                  />
                </TrackerItem>
                <TrackerItem status={checkStatusProgress(OPEN_REVIEW)}>
                  <TrackerEntryFold
                    index={2}
                    checkExpanded={checkExpanded}
                    setExpanded={setExpanded}
                    swatchColor={statusMapping[OPEN_REVIEW]}
                    title={getDocumentStatusLabel(OPEN_REVIEW)}
                    content={inReviewText}
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
                    content={publishedText}
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
          <a
            href='https://drive.google.com/file/d/1CmWvfC7JeUO-SGCvf7iOR6H4cMvS3vZX/view'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button variation='primary-raised-light' useIcon='expand-top-right'>
              Learn More About Document Stages
            </Button>
          </a>
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
