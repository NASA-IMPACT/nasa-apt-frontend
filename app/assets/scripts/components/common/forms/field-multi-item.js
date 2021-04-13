import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import FormGroupStructure from './form-group-structure';

const MultiItemEmpty = styled.div`
  background-color: ${themeVal('color.baseAlphaB')};
  border-radius: ${themeVal('shape.rounded')};
  border: ${themeVal('layout.border')} solid ${themeVal('color.baseAlphaC')};
  padding: ${glsp()};
  text-align: center;

  & > *:not(:last-child) {
    margin-bottom: ${glsp(0.5)};
  }
`;

/**
 * Fieldset for multi item fields with a trash icon
 *
 * @prop {string} label Label for the fieldset section
 * @prop {function} onDeleteClick Callback for delete click.
 * @prop {string} description Description for the info popover.
 * @prop {node} emptyMessage Content to display when there are no children.
 */
export function FieldMultiItem(props) {
  const { children, id, description, label, emptyMessage, onAddClick } = props;

  const hasChildren = !!React.Children.count(children);

  return (
    <FormGroupStructure
      label={label}
      id={id}
      description={description}
      footerContent={
        hasChildren && (
          <Button useIcon='plus--small' onClick={onAddClick}>
            Add new
          </Button>
        )
      }
    >
      {hasChildren ? (
        children
      ) : (
        <MultiItemEmpty>
          {typeof emptyMessage === 'string' ? (
            <p>{emptyMessage}</p>
          ) : (
            emptyMessage
          )}
          <Button useIcon='plus--small' onClick={onAddClick}>
            Add new
          </Button>
        </MultiItemEmpty>
      )}
    </FormGroupStructure>
  );
}

FieldMultiItem.propTypes = {
  children: T.node,
  emptyMessage: T.node,
  label: T.string,
  id: T.string,
  description: T.string,
  onAddClick: T.func
};

FieldMultiItem.defaultProps = {
  onAddClick: () => {}
};
