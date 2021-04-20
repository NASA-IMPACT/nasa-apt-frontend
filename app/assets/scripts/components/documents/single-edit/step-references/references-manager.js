import React, { useMemo } from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import { FieldArray } from 'formik';
import {
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody,
  FormLegend
} from '@devseed-ui/form';
import {
  Toolbar,
  ToolbarButton,
  VerticalDivider,
  ToolbarLabel
} from '@devseed-ui/toolbar';

import { MultiItemEmpty } from '../../../common/forms/field-multi-item';
import DropdownMenu from '../../../common/dropdown-menu';
import ReferencesFieldset from './reference-fieldset';
import ReferencesCreationActions from './reference-creation-actions';

import { readBibtexFile } from './references-import';

const getReferenceEmptyValue = () => {
  return {
    // Random 16 hex id.
    id: Math.random().toString(16).slice(2, 10)
  };
};

const dropdownMenuTriggerProps = {
  size: 'small',
  useIcon: ['chevron-down--small', 'after']
};

export default function ReferencesManager(props) {
  const fileChange = async (e) => {
    const file = e.target.files[0];
    // Reset file input.
    e.target.value = '';
    const refs = await readBibtexFile(file);
  };

  const referencesMenu = useMemo(
    () => [
      {
        id: 'actions',
        items: [
          {
            id: 'add',
            label: 'Add new',
            title: 'Add new reference'
          },
          {
            id: 'import',
            label: 'Import from BibTeX file...',
            title: 'Import from file'
          }
        ]
      },
      {
        id: 'actions2',
        items: [
          {
            id: 'delete',
            label: 'Delete selected...',
            title: 'Delete selected references'
          }
        ]
      }
    ],
    []
  );

  const onMenuAction = ({ push }, menuId) => {
    switch (menuId) {
      case 'add':
        push(getReferenceEmptyValue());
        break;
    }
  };

  return (
    <FieldArray
      name='document.publication_references'
      render={(arrayHelpers) => {
        const { remove, push, form, name } = arrayHelpers;
        const values = get(form.values, name);

        return (
          <FormFieldset>
            <FormFieldsetHeader>
              <FormLegend>References</FormLegend>
              <Toolbar size='small'>
                <ToolbarLabel>Select</ToolbarLabel>
                <ToolbarButton>All</ToolbarButton>
                <ToolbarButton>None</ToolbarButton>
                <ToolbarButton>Unused</ToolbarButton>

                <VerticalDivider />

                <DropdownMenu
                  menu={referencesMenu}
                  triggerProps={dropdownMenuTriggerProps}
                  triggerLabel='Actions'
                  dropTitle='Options'
                  onSelect={(...args) => onMenuAction(arrayHelpers, ...args)}
                />
              </Toolbar>
            </FormFieldsetHeader>
            <FormFieldsetBody>
              {values?.length ? (
                <React.Fragment>
                  {values.map((field, index) => (
                    <ReferencesFieldset
                      key={field.id}
                      onEditClick={() => {}}
                      onDeleteClick={() => remove(index)}
                      onSelect={() => {}}
                    />
                  ))}
                  <div>
                    <ReferencesCreationActions
                      onAddClick={() => push(getReferenceEmptyValue())}
                      onUploadClick={() => {}}
                    />
                  </div>
                </React.Fragment>
              ) : (
                <MultiItemEmpty>
                  <p>There are no references. You can start by adding one.</p>
                  <ReferencesCreationActions
                    onAddClick={() => push(getReferenceEmptyValue())}
                    onUploadClick={() => {}}
                  />
                </MultiItemEmpty>
              )}
            </FormFieldsetBody>
          </FormFieldset>
        );
      }}
    />
  );
}

ReferencesManager.propTypes = {};
