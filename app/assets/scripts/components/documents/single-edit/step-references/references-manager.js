import React, { useState } from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import { FieldArray, useField } from 'formik';
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
import ReferencesFieldset from './reference-fieldset';
import ReferencesCreationActions from './reference-creation-actions';
import ReferencesManagerMenu from './references-manager-menu';

import { readBibtexFile } from './references-import';
import SelectionList from '../../../../utils/selection-list';
import {
  formatReference,
  getReferenceEmptyValue
} from '../../../../utils/references';

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

export default function ReferencesManager(props) {
  const { referenceIndex } = props;

  const [refsSelected, setRefsSelected] = useState([]);
  const [refsEditing, setRefsEditing] = useState([]);
  const [field, , helpers] = useField('document.publication_references');

  const onFileSelect = async (file) => {
    const refs = await readBibtexFile(file);
    const preparedRefs = refs.valid.map((r) => getReferenceEmptyValue(r));
    helpers.setValue(field.value.concat(preparedRefs));
  };

  const onMenuAction = ({ push }, menuId, data) => {
    switch (menuId) {
      case 'add':
        {
          const newRef = getReferenceEmptyValue();
          push(newRef);
          setRefsEditing([newRef]);
        }
        break;
      case 'import':
        onFileSelect(data.file);
        break;
      case 'delete':
        {
          // Create a list of ids to facilitate searching.
          const selectedIds = refsSelected.map((r) => r.id);
          helpers.setValue(
            field.value.filter((f) => !selectedIds.includes(f.id))
          );
          setRefsSelected([]);
        }
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

        const unusedRef = values.filter((r) => !referenceIndex[r.id]);

        return (
          <FormFieldset>
            <FormFieldsetHeader>
              <FormLegend>References</FormLegend>
              <Toolbar size='small'>
                <ToolbarLabel>Select</ToolbarLabel>
                <ToolbarButton
                  disabled={!values.length}
                  onClick={() => setRefsSelected(values)}
                >
                  All
                </ToolbarButton>
                <ToolbarButton
                  disabled={!values.length}
                  onClick={() => setRefsSelected([])}
                >
                  None
                </ToolbarButton>
                <ToolbarButton
                  disabled={!unusedRef.length}
                  onClick={() => setRefsSelected(unusedRef)}
                >
                  Unused
                </ToolbarButton>

                <VerticalDivider />

                <ReferencesManagerMenu
                  arrayHelpers={arrayHelpers}
                  onSelect={onMenuAction}
                  refSelectedCount={refsSelected.length}
                />
              </Toolbar>
            </FormFieldsetHeader>
            <FormFieldsetBody>
              {values?.length ? (
                <React.Fragment>
                  {values.map((field, index) => (
                    <ReferencesFieldset
                      index={index}
                      label={`Ref #${index + 1}: ${formatReference(field)}`}
                      id={`${name}-${index}`}
                      name={`${name}.${index}`}
                      key={field.id}
                      referenceUsage={referenceIndex[field.id]}
                      isEditing={editingReferencesList.isSelected(field)}
                      onEditClick={(e) => {
                        const newSelection = editingReferencesList.toggle(
                          field,
                          { meta: e.metaKey || e.ctrlKey, shift: e.shiftKey }
                        );
                        setRefsEditing(newSelection);
                      }}
                      onDeleteClick={() => {
                        const newSelection = selectedReferencesList.deselect(
                          field
                        );
                        setRefsSelected(newSelection);
                        remove(index);
                      }}
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
                      onAddClick={() => {
                        const newRef = getReferenceEmptyValue();
                        push(newRef);
                        setRefsEditing([newRef]);
                      }}
                      onFileSelect={onFileSelect}
                    />
                  </div>
                </React.Fragment>
              ) : (
                <MultiItemEmpty>
                  <p>There are no references. You can start by adding one.</p>
                  <ReferencesCreationActions
                    onAddClick={() => {
                      const newRef = getReferenceEmptyValue();
                      push(newRef);
                      setRefsEditing([newRef]);
                    }}
                    onFileSelect={onFileSelect}
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

ReferencesManager.propTypes = {
  referenceIndex: T.object
};
