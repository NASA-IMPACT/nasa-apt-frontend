import React, { useCallback } from 'react';
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

// Re-organize the header to ensure the Legend only takes up the needed space,
// otherwise the click event would span the whole header.
const ReferencesFormFieldsetHeader = styled(FormFieldsetHeader)`
  justify-content: flex-start;

  ${FormLegend} {
    width: max-content;
  }

  ${Toolbar} {
    margin-left: auto;
  }
`;

export default function ReferencesFieldset(props) {
  const {
    name,
    id,
    isEditing,
    onEditClick,
    onDeleteClick,
    isSelected,
    onSelectClick
  } = props;

  const onSelectFiltered = useCallback(
    (e) => {
      // Because of the checkbox label the event is firing twice. This filters
      // out unneeded events. We're targeting the SPAN, because this is a custom
      // checkbox.
      if (e.target.tagName === 'LEGEND' || e.target.tagName === 'SPAN') {
        onSelectClick(e);
      }
    },
    [onSelectClick]
  );

  return (
    <FormFieldset>
      <ReferencesFormFieldsetHeader>
        <ReferenceFormCheckable
          name={name}
          id={id}
          textPlacement='left'
          type='checkbox'
          hideText
          // Using a click event instead of onChange to allow modifier keys like
          // control and meta to work
          onClick={onSelectFiltered}
          // noop onChange so React doesn't complain.
          onChange={() => {}}
          checked={isSelected}
        >
          Select reference
        </ReferenceFormCheckable>
        <FormLegend onClick={onSelectFiltered}>Reference 1</FormLegend>
        <Toolbar size='small'>
          <ToolbarIconButton
            useIcon='pencil'
            onClick={onEditClick}
            active={isEditing}
          >
            Edit reference
          </ToolbarIconButton>
          <VerticalDivider />
          <ToolbarIconButton useIcon='trash-bin' onClick={onDeleteClick}>
            Delete
          </ToolbarIconButton>
        </Toolbar>
      </ReferencesFormFieldsetHeader>
      {isEditing && <FormFieldsetBody>reference fields</FormFieldsetBody>}
    </FormFieldset>
  );
}

ReferencesFieldset.propTypes = {
  name: T.string,
  id: T.string,
  isEditing: T.bool,
  onEditClick: T.func,
  onDeleteClick: T.func,
  isSelected: T.bool,
  onSelectClick: T.func
};
