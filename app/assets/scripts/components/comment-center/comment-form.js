import React, { useMemo } from 'react';
import T from 'prop-types';
import { Formik } from 'formik';
import { Button } from '@devseed-ui/button';
import { Form } from '@devseed-ui/form';

import DropdownMenu from '../common/dropdown-menu';
import { FormikInputTextarea } from '../common/forms/input-textarea';
import { DOCUMENT_SECTIONS } from '../documents/single-edit/sections';
import styled from 'styled-components';

const SectionsDropdownMenu = styled(DropdownMenu)`
  max-width: 18rem;
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
  forwardedAs: 'a',
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
  const { type, comment } = props;

  const initial = useMemo(() => getInitialValues({ type, comment }), [
    type,
    comment
  ]);

  return (
    <Formik
      enableReinitialize
      initialValues={initial}
      validate={console.log}
      onSubmit={console.log}
    >
      {({ handleSubmit, values, setFieldValue, isSubmitting, dirty }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <FormikInputTextarea
              id='comment-field'
              name='comment'
              label={getTextareaLabel({ type, values, setFieldValue })}
              onBlur={console.log}
            />
            <div>
              <Button
                variation='primary-raised-dark'
                disabled={isSubmitting || !dirty}
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
  comment: T.string
};

export default CommentForm;
