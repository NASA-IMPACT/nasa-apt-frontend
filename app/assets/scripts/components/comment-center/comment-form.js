import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Formik } from 'formik';
import { truncated } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Form } from '@devseed-ui/form';

import DropdownMenu from '../common/dropdown-menu';
import { FormikInputTextarea } from '../common/forms/input-textarea';
import { DOCUMENT_SECTIONS } from '../documents/single-edit/sections';

const SectionsDropdownMenu = styled(DropdownMenu)`
  max-width: 18rem;
`;

const SectionTrigger = styled(Button).attrs({ as: 'a' })`
  max-width: calc(100%);

  span {
    ${truncated()}
    max-width: calc(100% - 1.5rem);
  }
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
  forwardedAs: SectionTrigger,
  href: '#comment-field'
};

const sectionMenuLabel = (selectedItems) => {
  return `Comment under ${selectedItems[0]?.label}`;
};

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

const getInitialValues = ({ type, comment }) => {
  switch (type) {
    case 'new':
      return {
        section: 'general',
        comment: ''
      };
    case 'reply':
      return {
        comment: ''
      };
    case 'edit':
      return {
        comment
      };

    default:
      return null;
  }
};

const CommentForm = (props) => {
  const { type, comment, onSubmit } = props;

  const initial = useMemo(() => getInitialValues({ type, comment }), [
    type,
    comment
  ]);

  const validate = useCallback((values) => {
    let errors = {};
    if (!values.comment.trim()) {
      errors.comment = 'The comment cannot be empty.';
    }
    return errors;
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={initial}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, values, setFieldValue, isSubmitting }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <FormikInputTextarea
              id='comment-field'
              name='comment'
              label={getTextareaLabel({ type, values, setFieldValue })}
            />
            <div>
              <Button
                onClick={handleSubmit}
                variation='primary-raised-dark'
                disabled={isSubmitting || !values.comment.trim()}
              >
                Post
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

CommentForm.propTypes = {
  type: T.oneOf(['new', 'reply', 'edit']),
  comment: T.string,
  onSubmit: T.func
};

export default CommentForm;
