import React, { useCallback, useEffect, useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Form } from '@devseed-ui/form';
import { Modal, ModalFooter } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';
import ShadowScrollbar from '@devseed-ui/shadow-scrollbar';

import { TabContent, TabItem, TabsManager, TabsNav } from '../common/tabs';
import Tip from '../common/tooltip';
import { FormikResetReveal } from '../common/forms/formik-reset-reveal';
import {
  CollaboratorUserIdentity,
  UserSelectableList,
  UserSelectableListLoadingSkeleton
} from '../common/user-selectable-list';

import { useContextualAbility } from '../../a11n';
import { showConfirmationPrompt } from '../common/confirmation-prompt';
import { useCollaborators } from '../../context/collaborators-list';
import { isDraftEquivalent, isReviewDone } from './status';

const TabsNavModal = styled(TabsNav)`
  margin: ${glsp(0, -2, 1, -2)};
  padding: ${glsp(0, 2)};
`;

const CollaboratorLead = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${glsp(0.5)};
  padding: ${glsp(0, 2)};

  ${Button} {
    margin-left: auto;
  }
`;

const ShadowScrollbarPadded = styled(ShadowScrollbar).attrs({
  scrollbarsProps: {
    autoHeight: true,
    autoHeightMax: 320
  }
})`
  margin: ${glsp(-1, -2)};
`;

export function DocumentCollaboratorModal(props) {
  const { atbd, revealed, onClose, onSubmit } = props;
  const ability = useContextualAbility();
  const history = useHistory();

  const {
    collaborators: collabAuthors,
    fetchCollaborators: fetchCollabAuthors
  } = useCollaborators({
    atbdId: atbd.id,
    atbdVersion: atbd.version,
    userFilter: 'invite_authors'
  });
  const {
    collaborators: collabReviewers,
    fetchCollaborators: fetchCollabReviewers
  } = useCollaborators({
    atbdId: atbd.id,
    atbdVersion: atbd.version,
    userFilter: 'invite_reviewers'
  });

  const canManageAuthors = ability.can('manage-authors', atbd);
  const canManageReviewers = ability.can('manage-reviewers', atbd);
  const canChangeLead = ability.can('change-lead-author', atbd);

  const validStateToManageReviewers = !isDraftEquivalent(atbd);

  const onChangeLeadClick = useCallback(() => {
    if (!canChangeLead) return;
    onClose();
    // Use the history state to trigger the modal. See explanation on
    // app/assets/scripts/components/documents/use-document-modals.js
    // Using undefined keeps the same path.
    history.push(undefined, { menuAction: 'change-leading' });
  }, [canChangeLead, history, onClose]);

  // Get the ids of the reviewers that concluded the review.
  // Used to display the badge.
  const reviewersConcluded = useMemo(
    () => atbd.reviewers.filter(isReviewDone).map((u) => u.sub),
    [atbd]
  );

  const initialValues = useMemo(() => {
    const authors = atbd.authors.map((u) => u.sub);
    const reviewers = atbd.reviewers.map((u) => u.sub);
    return canManageReviewers
      ? {
          id: atbd.id,
          authors,
          reviewers
        }
      : { id: atbd.id, authors };
  }, [atbd, canManageReviewers]);

  useEffect(() => {
    if (revealed) {
      if (canManageAuthors) {
        fetchCollabAuthors();
      }
      if (canManageReviewers && validStateToManageReviewers) {
        fetchCollabReviewers();
      }
    }
  }, [
    canManageAuthors,
    fetchCollabAuthors,
    canManageReviewers,
    fetchCollabReviewers,
    revealed,
    validStateToManageReviewers
  ]);

  const initialTab =
    canManageReviewers && !canManageAuthors ? 'reviewers' : 'authors';

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <React.Fragment>
        <FormikResetReveal revealed={revealed} />
        <Modal
          id='modal'
          size='small'
          revealed={revealed}
          onCloseClick={onClose}
          title='Manage collaborators'
          content={
            <TabsManager initialActive={initialTab}>
              <Form as={FormikForm}>
                {canManageAuthors && canManageReviewers && (
                  <TabsNavModal>
                    <TabItem label='Authors' tabId='authors'>
                      Authors
                    </TabItem>
                    <TabItem label='Reviewers' tabId='reviewers'>
                      Reviewers
                    </TabItem>
                  </TabsNavModal>
                )}

                {canManageAuthors && (
                  <TabContent tabId='authors'>
                    {collabAuthors.status === 'loading' && (
                      <UserSelectableListLoadingSkeleton />
                    )}
                    {collabAuthors.status === 'succeeded' && (
                      <ShadowScrollbarPadded>
                        <CollaboratorLead>
                          <CollaboratorUserIdentity
                            name={atbd.owner.preferred_username}
                            email={atbd.owner.email}
                            isLead
                          />
                          <Button
                            size='small'
                            variation='base-plain'
                            onClick={onChangeLeadClick}
                            disabled={!canChangeLead}
                          >
                            Change
                          </Button>
                        </CollaboratorLead>
                        <UserSelectableList
                          users={collabAuthors.data}
                          fieldName='authors'
                        />
                      </ShadowScrollbarPadded>
                    )}
                    {collabAuthors.status === 'failed' && (
                      <p>An error occurred while getting the authors.</p>
                    )}
                  </TabContent>
                )}
                {canManageReviewers && validStateToManageReviewers ? (
                  <TabContent tabId='reviewers'>
                    {collabReviewers.status === 'loading' && (
                      <UserSelectableListLoadingSkeleton />
                    )}
                    {collabReviewers.status === 'succeeded' && (
                      <ShadowScrollbarPadded>
                        <UserSelectableList
                          users={collabReviewers.data}
                          reviewersConcluded={reviewersConcluded}
                          fieldName='reviewers'
                        />
                      </ShadowScrollbarPadded>
                    )}
                    {collabReviewers.status === 'failed' && (
                      <p>An error occurred while getting the reviewers.</p>
                    )}
                  </TabContent>
                ) : canManageReviewers ? (
                  <TabContent tabId='reviewers'>
                    <p>
                      Reviewers can only be managed once the document is no
                      longer in draft.
                    </p>
                  </TabContent>
                ) : null}
              </Form>
            </TabsManager>
          }
          renderFooter={(bag) => (
            <ModalFooter>
              <ModalControls modalHelpers={bag} />
            </ModalFooter>
          )}
        />
      </React.Fragment>
    </Formik>
  );
}

DocumentCollaboratorModal.propTypes = {
  atbd: T.object,
  revealed: T.bool,
  onClose: T.func,
  onSubmit: T.func
};

export function DocumentLeadAuthorModal(props) {
  const { atbd, revealed, onClose, onSubmit } = props;

  const {
    collaborators: collabLeadAuthor,
    fetchCollaborators: fetchCollabLeadAuthor
  } = useCollaborators({
    atbdId: atbd.id,
    atbdVersion: atbd.version,
    userFilter: 'transfer_ownership'
  });

  const initialValues = useMemo(() => {
    return {
      id: atbd.id,
      owner: atbd.owner.sub
    };
  }, [atbd]);

  const onSubmitConfirm = useCallback(
    async (values, helpers) => {
      const newLeadAuthor = collabLeadAuthor.data.find(
        (u) => u.sub === values.owner
      );
      // Hide the lead author modal, before showing the confirmation prompt.
      onClose();
      const { result: confirmed } = await confirmChangeLeadAuthor(
        atbd,
        newLeadAuthor?.preferred_username
      );
      if (!confirmed) return;

      return onSubmit(values, helpers);
    },
    [atbd, collabLeadAuthor.data, onClose, onSubmit]
  );

  useEffect(() => {
    if (revealed) {
      fetchCollabLeadAuthor();
    }
  }, [fetchCollabLeadAuthor, revealed]);

  const collabLeadSorted = useMemo(() => {
    if (collabLeadAuthor.status !== 'succeeded') return [];

    return [
      collabLeadAuthor.data.find((u) => u.sub === atbd.owner.sub),
      ...collabLeadAuthor.data.filter((u) => u.sub !== atbd.owner.sub)
    ];
  }, [collabLeadAuthor, atbd.owner.sub]);

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmitConfirm}>
      <React.Fragment>
        <FormikResetReveal revealed={revealed} />
        <Modal
          id='modal'
          size='small'
          revealed={revealed}
          onCloseClick={onClose}
          title='Document lead author'
          content={
            <Form as={FormikForm}>
              {collabLeadAuthor.status === 'loading' && (
                <UserSelectableListLoadingSkeleton />
              )}
              {collabLeadAuthor.status === 'succeeded' && (
                <ShadowScrollbarPadded>
                  <UserSelectableList
                    users={collabLeadSorted}
                    fieldName='owner'
                    selectOne
                  />
                </ShadowScrollbarPadded>
              )}
              {collabLeadAuthor.status === 'failed' && (
                <p>An error occurred while getting the reviewers.</p>
              )}
            </Form>
          }
          renderFooter={(bag) => (
            <ModalFooter>
              <ModalControls modalHelpers={bag} />
            </ModalFooter>
          )}
        />
      </React.Fragment>
    </Formik>
  );
}

DocumentLeadAuthorModal.propTypes = {
  atbd: T.object,
  revealed: T.bool,
  onClose: T.func,
  onSubmit: T.func
};

// Moving the controls to a component of their own to use Formik context.
const ModalControls = (props) => {
  const { modalHelpers } = props;
  const { dirty, isSubmitting, submitForm } = useFormikContext();

  return (
    <React.Fragment>
      <Button
        variation='base-raised-light'
        title='Cancel deletion'
        useIcon='xmark--small'
        onClick={modalHelpers.close}
      >
        Cancel
      </Button>
      <Tip position='right' title='There are unsaved changes' open={dirty}>
        <Button
          variation='primary-raised-dark'
          title='Save current changes'
          disabled={isSubmitting || !dirty}
          onClick={submitForm}
          useIcon='tick--small'
        >
          Save
        </Button>
      </Tip>
    </React.Fragment>
  );
};

ModalControls.propTypes = {
  modalHelpers: T.object
};

/**
 * Show a confirmation prompt to change the lead author of a document.
 *
 * @param {object} atbd Document for which the lead author is changing.
 * @param {string} newLeadAuthor Name of the new lead author.
 */
const confirmChangeLeadAuthor = async (atbd, newLeadAuthor) => {
  return showConfirmationPrompt({
    title: 'Change lead author',
    subtitle: `Current lead author is ${atbd.owner.preferred_username}`,
    content: (
      <p>
        This action will change the lead author of version{' '}
        <strong>{atbd.version}</strong> of <strong>{atbd.title}</strong> to{' '}
        <strong>{newLeadAuthor}</strong>.
        <br />
        The current lead author will still be a collaborator in the document.
      </p>
    ),
    /* eslint-disable-next-line react/display-name, react/prop-types */
    renderControls: ({ confirm, cancel }) => (
      <React.Fragment>
        <Button
          variation='base-raised-light'
          title='Cancel'
          useIcon='xmark--small'
          onClick={cancel}
        >
          Cancel
        </Button>
        <Button
          variation='primary-raised-dark'
          title='Change lead author'
          useIcon='tick--small'
          onClick={confirm}
        >
          Change lead author
        </Button>
      </React.Fragment>
    )
  });
};
