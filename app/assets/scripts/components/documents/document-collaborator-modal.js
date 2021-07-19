import React, { useEffect, useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Formik, Form as FormikForm, useFormikContext, Field } from 'formik';
import { Form } from '@devseed-ui/form';
import { Modal, ModalFooter } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { glsp, visuallyHidden } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';

import { TabContent, TabItem, TabsManager, TabsNav } from '../common/tabs';
import UserIdentity from '../common/user-identity';
import Tip from '../common/tooltip';

import { useContextualAbility } from '../../a11n';

const TabsNavModal = styled(TabsNav)`
  margin: ${glsp(0, -2, 1, -2)};
  padding: ${glsp(0, 2)};
`;

const CollaboratorsList = styled.ul`
  display: grid;
  grid-gap: ${glsp()};
`;

const CollaboratorOption = styled.label`
  display: block;
  cursor: pointer;

  input {
    ${visuallyHidden()}
  }

  input:checked ~ ${UserIdentity} {
    grid-template-columns: min-content min-content 1fr;

    &::after {
      ${collecticon('tick')}
      justify-self: flex-end;
    }
  }
`;

const coll = [
  {
    email: 'author1@example.com',
    preferred_username: 'AuthorUser1',
    sub: 'a7cb6b7c-3312-4282-ba17-4d21a5dcd94e',
    username: 'author1@example.com'
  },
  {
    email: 'author2@example.com',
    preferred_username: 'AuthorUser2',
    sub: 'f506eee7-58f1-4651-83ac-886d5174710d',
    username: 'author2@example.com'
  },
  {
    email: 'tom@example.com',
    preferred_username: 'Tom Ripley',
    sub: 'f506eee7-58f2-4651-83ac-000000000000',
    username: 'tom@example.com'
  },
  {
    email: 'dick@example.com',
    preferred_username: 'Richard Greenleaf',
    sub: 'f506eee7-58f2-4651-83ac-000000000111',
    username: 'dick@example.com'
  }
];

// Reset the formik state when the modal is hidden.
const RevealFormikReset = ({ revealed }) => {
  const { resetForm } = useFormikContext();
  useEffect(() => {
    if (!revealed) {
      resetForm();
    }
  }, [resetForm, revealed]);
  return null;
};

export default function DocumentCollaboratorModal(props) {
  const { atbd, revealed, onClose, onSubmit } = props;
  const ability = useContextualAbility();

  const canManageAuthors = ability.can('manage-authors', atbd);
  const canManageReviewers = ability.can('manage-reviewers', atbd);

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

  const initialTab =
    canManageReviewers && !canManageAuthors ? 'reviewers' : 'authors';

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <React.Fragment>
        <RevealFormikReset revealed={revealed} />
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
                    <CollaboratorsSelectableList
                      users={coll}
                      fieldName='authors'
                    />
                  </TabContent>
                )}
                {canManageReviewers && (
                  <TabContent tabId='reviewers'>
                    <CollaboratorsSelectableList
                      users={coll}
                      fieldName='reviewers'
                    />
                  </TabContent>
                )}
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

// Moving the save button to a component of its own to use Formik context.
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

function CollaboratorsSelectableList(props) {
  const { users = [], fieldName } = props;

  return (
    <CollaboratorsList>
      {users.map((u) => (
        <li key={u.sub}>
          <CollaboratorOption>
            <Field type='checkbox' name={fieldName} value={u.sub} />
            <UserIdentity name={u.preferred_username} email={u.email} />
          </CollaboratorOption>
        </li>
      ))}
    </CollaboratorsList>
  );
}

CollaboratorsSelectableList.propTypes = {
  fieldName: T.string,
  users: T.array
};
