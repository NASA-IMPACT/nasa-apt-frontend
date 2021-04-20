import React, { useMemo, useState } from 'react';
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
import SelectionList from '../../../../utils/selection-list';

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

// The selection of the refs is managed by SelectionList. This utility only
// handles the selection part (multi selects, toggle, etc), we still store the
// selected items in a react state variable.
// The workflow is the following:
// - Before using the list, set the elements that make up the list and the
//   elements that are already selected.
// - Do operations on the list (like toggle), and store the result.
//
// Although the list keeps an internal state of what's happening it gets reset
// on every render with the .setList(values).setSelected(refsSelected) methods.
const selectedReferencesList = new SelectionList();
const editingReferencesList = new SelectionList();

export default function ReferencesManager() {
  const [refsSelected, setRefsSelected] = useState([]);
  const [refsEditing, setRefsEditing] = useState([]);

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

  const fileChange = async (e) => {
    const file = e.target.files[0];
    // Reset file input.
    e.target.value = '';
    const refs = await readBibtexFile(file);
  };

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

        // Update the refs list. See note above
        selectedReferencesList.setList(values).setSelected(refsSelected);
        editingReferencesList.setList(values).setSelected(refsEditing);

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
                      id={`${name}-${index}`}
                      name={`${name}.${index}`}
                      key={field.id}
                      isEditing={editingReferencesList.isSelected(field)}
                      onEditClick={(e) => {
                        const newSelection = editingReferencesList.toggle(
                          field,
                          { meta: e.metaKey || e.ctrlKey, shift: e.shiftKey }
                        );
                        setRefsEditing(newSelection);
                      }}
                      onDeleteClick={() => remove(index)}
                      isSelected={selectedReferencesList.isSelected(field)}
                      onSelectClick={(e) => {
                        const newSelection = selectedReferencesList.toggle(
                          field,
                          { meta: true, shift: e.shiftKey }
                        );
                        setRefsSelected(newSelection);
                      }}
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
