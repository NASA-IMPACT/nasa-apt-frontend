import React, { useCallback } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
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
import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';

import Pill from '../../../common/pill';
import ReferenceFormFields from './reference-form-fields';

const ReferenceFormLegend = styled(FormLegend)`
  ${truncated()}
  display: block;
  max-width: 15rem;
`;

const ReferenceFormCheckable = styled(FormCheckable)`
  margin-right: ${glsp(0.5)};
`;

const ReferencesFormFieldset = styled(FormFieldset)`
  ${({ isSelected }) =>
    isSelected &&
    css`
      border-color: ${themeVal('color.baseAlphaE')};
    `}
`;

// Re-organize the header to ensure the Legend only takes up the needed space,
// otherwise the click event would span the whole header.
const ReferencesFormFieldsetHeader = styled(FormFieldsetHeader)`
  justify-content: flex-start;
  align-items: center;
  ${({ isEditing }) =>
    !isEditing &&
    css`
      border-color: transparent;
    `}

  ${FormLegend} {
    width: max-content;
  }

  ${Pill} {
    margin-left: ${glsp(0.25)};
  }

  ${Toolbar} {
    margin-left: auto;
  }
`;

export default function ReferencesFieldset(props) {
  const {
    label,
    name,
    id,
    referenceUsage,
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
    <ReferencesFormFieldset isSelected={isSelected}>
      <ReferencesFormFieldsetHeader isEditing={isEditing}>
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
        <ReferenceFormLegend onClick={onSelectFiltered}>
          {label}
        </ReferenceFormLegend>
        {referenceUsage && <Pill>In use: {referenceUsage.count}x</Pill>}
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
      {isEditing && (
        <FormFieldsetBody>
          <ReferenceFormFields id={id} name={name} />
        </FormFieldsetBody>
      )}
    </ReferencesFormFieldset>
  );
}

ReferencesFieldset.propTypes = {
  label: T.string,
  name: T.string,
  id: T.string,
  referenceUsage: T.object,
  isEditing: T.bool,
  onEditClick: T.func,
  onDeleteClick: T.func,
  isSelected: T.bool,
  onSelectClick: T.func
};
