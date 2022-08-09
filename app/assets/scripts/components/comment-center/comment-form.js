import React, { useCallback, useMemo, useRef } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Formik } from 'formik';
import isHotkey from 'is-hotkey';
import Select from 'react-select';
import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Form } from '@devseed-ui/form';

import DropdownMenu from '../common/dropdown-menu';
import { FormikInputTextarea } from '../common/forms/input-textarea';
import FormGroupStructure from '../common/forms/form-group-structure';
import Tip from '../common/tooltip';

import { DOCUMENT_SECTIONS } from '../documents/single-edit/sections';
import { modKey } from '../slate/plugins/common/utils';
import { THREAD_SECTION_ALL } from './common';
import { useUser } from '../../context/user';

const SectionsDropdownMenu = styled(DropdownMenu)`
  max-width: 18rem;
`;

const SectionTrigger = styled(Button).attrs({ as: 'a' })`
  max-width: 100%;
  display: flex;

  span {
    ${truncated()}
  }
`;

export const CommentFormWrapper = styled.div`
  height: min-content;
  background: ${themeVal('color.baseAlphaB')};
  box-shadow: 0 -${themeVal('layout.border')} 0 0 ${themeVal('color.baseAlphaC')};
  z-index: 9999;
  padding: ${glsp(1, 2)};

  label {
    font-size: 0.875rem;
  }

  textarea {
    min-height: 4rem;

    &:focus {
      min-height: 20rem;
    }
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${glsp(0.5)};
`;

const sectionMenu = {
  id: 'section',
  selectable: true,
  items: DOCUMENT_SECTIONS.map((s) => ({
    ...s,
    title: `Write comment for section ${s.label}`
  }))
};

const sectionMenuTriggerProps = {
  size: 'small',
  forwardedAs: SectionTrigger,
  href: '#comment-field'
};

const sectionMenuLabel = (selectedItems) => {
  return `Comment under ${selectedItems[0]?.label}`;
};

const contributorToSelectOption = ({ preferred_username, sub }) => ({
  label: preferred_username,
  value: sub
});

const getTextareaLabel = ({ type, values, setFieldValue }) => {
  switch (type) {
    case 'new':
      return (
        <SectionsDropdownMenu
          menu={sectionMenu}
          triggerProps={sectionMenuTriggerProps}
          triggerLabel={sectionMenuLabel}
          activeItem={values.section}
          alignment='left'
          direction='up'
          withChevron
          dropTitle='Options'
          onSelect={(id) => setFieldValue('section', id)}
        />
      );
    case 'reply':
      return 'Write a reply';

    default:
      return null;
  }
};

const getInitialValues = ({
  type,
  section,
  comment,
  threadId,
  commentId,
  notify = []
}) => {
  switch (type) {
    case 'new':
      return {
        section:
          !section || section === THREAD_SECTION_ALL ? 'general' : section,
        comment: '',
        notify
      };
    case 'reply':
      return {
        threadId,
        comment: '',
        notify
      };
    case 'edit':
      return {
        threadId,
        commentId,
        comment,
        notify
      };

    default:
      return null;
  }
};

const CommentForm = (props) => {
  const {
    type,
    comment,
    initialSection,
    threadId,
    contributors,
    defaultNotify,
    commentId,
    onSubmit,
    onCancel
  } = props;

  const formRef = useRef(null);

  const onSubmitWithBlur = useCallback(
    async (...args) => {
      const result = await onSubmit(...args);
      result && formRef.current.querySelector('textarea')?.blur();
    },
    [onSubmit]
  );

  const initial = useMemo(
    () =>
      getInitialValues({
        type,
        comment,
        threadId,
        commentId,
        section: initialSection,
        notify: defaultNotify
      }),
    [type, comment, threadId, commentId, initialSection, defaultNotify]
  );

  const { user } = useUser();
  const contributorsSelectOptions = contributors
    .filter(({ sub }) => sub !== user.id) // Removes active user from select options
    .map(contributorToSelectOption);

  return (
    <Formik
      enableReinitialize
      initialValues={initial}
      onSubmit={onSubmitWithBlur}
    >
      {({ handleSubmit, values, setFieldValue, isSubmitting }) => {
        const onKeyDown = (e) => {
          if (isSubmitting || !values.comment.trim()) return;

          if (isHotkey('mod+enter', e)) {
            e.preventDefault();
            handleSubmit();
          }
        };

        const notify = values.notify || [];
        const notifyValue = contributorsSelectOptions.filter(({ value }) =>
          notify.includes(value)
        );

        const handleNotifyChange = (values) => {
          const notifyIds = values.map(({ value }) => value);
          setFieldValue('notify', notifyIds);
        };

        return (
          <Form onSubmit={handleSubmit} ref={formRef}>
            <FormikInputTextarea
              id='comment-field'
              name='comment'
              label={getTextareaLabel({ type, values, setFieldValue })}
              onKeyDown={onKeyDown}
            />
            {contributors.length > 0 && (
              <FormGroupStructure
                id='notify'
                label='Notify users'
                helper='If left blank, all contributors to this ATBD will be notified.'
              >
                <Select
                  isMulti
                  inputId='notify'
                  options={contributorsSelectOptions}
                  value={notifyValue}
                  onChange={handleNotifyChange}
                  menuPlacement='top'
                />
              </FormGroupStructure>
            )}
            <FormActions>
              <Tip title={modKey('mod+↵')}>
                <Button
                  onClick={handleSubmit}
                  title={type === 'edit' ? 'Update comment' : 'Post comment'}
                  variation='primary-raised-dark'
                  size='small'
                  disabled={isSubmitting || !values.comment.trim()}
                >
                  {type === 'edit' ? 'Update' : 'Post'}
                </Button>
              </Tip>
              {type === 'edit' ? (
                <Button
                  onClick={onCancel}
                  title='Cancel comment edition'
                  variation='base-plain'
                  size='small'
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              ) : null}
            </FormActions>
          </Form>
        );
      }}
    </Formik>
  );
};

CommentForm.propTypes = {
  type: T.oneOf(['new', 'reply', 'edit']),
  threadId: T.number,
  contributors: T.array,
  defaultNotify: T.arrayOf(T.string),
  commentId: T.number,
  comment: T.string,
  initialSection: T.string,
  onSubmit: T.func,
  onCancel: T.func
};

CommentForm.defaultProps = {
  contributors: []
};

export default CommentForm;
