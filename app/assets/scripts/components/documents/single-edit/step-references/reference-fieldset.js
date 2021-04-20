import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import {
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody,
  FormLegend,
  FormCheckable
} from '@devseed-ui/form';
import {
  Toolbar,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';
import { glsp } from '@devseed-ui/theme-provider';

const ReferenceFormCheckable = styled(FormCheckable)`
  margin-right: ${glsp(0.5)};
`;

export default function ReferencesFieldset(props) {
  const { onEditClick, onDeleteClick, onSelect } = props;

  return (
    <FormFieldset>
      <FormFieldsetHeader>
        <ReferenceFormCheckable
          textPlacement='left'
          type='checkbox'
          hideText
          onChange={onSelect}
        >
          Select reference
        </ReferenceFormCheckable>
        <FormLegend>Reference 1</FormLegend>
        <Toolbar size='small'>
          <ToolbarIconButton useIcon='pencil' onClick={onEditClick}>
            Edit reference
          </ToolbarIconButton>
          <VerticalDivider />
          <ToolbarIconButton useIcon='trash-bin' onClick={onDeleteClick}>
            Delete
          </ToolbarIconButton>
        </Toolbar>
      </FormFieldsetHeader>
      <FormFieldsetBody>reference fields</FormFieldsetBody>
    </FormFieldset>
  );
}

ReferencesFieldset.propTypes = {
  onEditClick: T.func,
  onDeleteClick: T.func,
  onSelect: T.func
};
