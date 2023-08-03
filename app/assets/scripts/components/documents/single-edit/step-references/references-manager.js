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
import { FormSectionNotes } from '../../../../styles/form-block';

import { readBibtexFile } from './references-import';
import SelectionList from '../../../../utils/selection-list';
import {
  formatCitation,
  getReferenceEmptyValue,
  removeReferencesFromDocument
} from '../../../../utils/references';
import { confirmRemoveReferences } from './references-remove-confirm';

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

  const onMenuAction = async ({ push, form }, menuId, data) => {
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

          const { result } = await confirmRemoveReferences(
            true,
            selectedIds.length
          );
          if (!result) return;

          // Remove the deleted references from all the editor
          // fields.
          const newDocument = removeReferencesFromDocument(
            form.values.document,
            selectedIds
          );
          form.setFieldValue('document', newDocument);

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
        const { remove, push, form, name, move } = arrayHelpers;
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
              <FormSectionNotes>
                <p>
                  <em>
                    You can skip this reference for now if you have no
                    references to enter. This section can be filled out whenever
                    you want to add a reference. References can also be inserted
                    when adding content to the document.
                  </em>
                </p>
              </FormSectionNotes>
              {values?.length ? (
                <React.Fragment>
                  {values.map((field, index) => (
                    <ReferencesFieldset
                      index={index}
                      label={`Ref #${index + 1}: ${formatCitation(field)}`}
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

                        // This is a hack to force the field to re-render
                        move(index, index);
                      }}
                      onDeleteClick={async () => {
                        // If the reference is in use prompt the user for
                        // confirmation before removing it.
                        if (referenceIndex[field.id]?.count) {
                          const { result } = await confirmRemoveReferences(
                            false,
                            referenceIndex[field.id].count
                          );
                          if (!result) return;
                        }

                        const newSelection =
                          selectedReferencesList.deselect(field);

                        // Remove the deleted references from all the editor
                        // fields.
                        const newDocument = removeReferencesFromDocument(
                          form.values.document,
                          field.id
                        );
                        form.setFieldValue('document', newDocument);

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

                        // This is a hack to force the field to re-render
                        move(index, index);
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
