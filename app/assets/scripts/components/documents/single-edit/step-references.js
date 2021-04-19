import React, { useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import get from 'lodash.get';
import { Formik, Form as FormikForm, FieldArray } from 'formik';
import { toast } from 'react-toastify';
import {
  Form,
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody,
  FormLegend,
  FormCheckable
} from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import {
  Toolbar,
  ToolbarButton,
  ToolbarIconButton,
  VerticalDivider,
  ToolbarLabel
} from '@devseed-ui/toolbar';
import { glsp } from '@devseed-ui/theme-provider';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikInputEditor } from '../../common/forms/input-editor';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';
import { MultiItemEmpty } from '../../common/forms/field-multi-item';
import DropdownMenu from '../../common/dropdown-menu';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useSubmitForVersionData } from './use-submit';
import { formString } from '../../../utils/strings';
import { bibtexItemsToRefs, parseBibtexFile } from '../../../utils/references';
import { showConfirmationPrompt } from '../../common/confirmation-prompt';

const ReferenceFormCheckable = styled(FormCheckable)`
  margin-right: ${glsp(0.5)};
`;

const confirmImportReferences = async (referenceCount) => {
  const txt =
    referenceCount > 1
      ? `There are ${referenceCount} references`
      : `There is 1 reference`;

  return showConfirmationPrompt({
    title: 'Import references',
    content: (
      <p>
        {txt} in the selected file. Do you want to import them into the form?
      </p>
    ),
    /* eslint-disable-next-line react/display-name, react/prop-types */
    renderControls: ({ confirm, cancel }) => (
      <React.Fragment>
        <Button
          variation='base-plain'
          title='Cancel references import'
          useIcon='xmark--small'
          onClick={cancel}
        >
          Cancel
        </Button>
        <Button
          variation='primary-raised-dark'
          title='Import into form'
          useIcon='tick--small'
          onClick={confirm}
        >
          Import
        </Button>
      </React.Fragment>
    )
  });
};

const readBibtexFile = async (file) => {
  try {
    const fileData = await parseBibtexFile(file);
    const refs = bibtexItemsToRefs(fileData);

    if (refs.total) {
      const { result } = await confirmImportReferences(refs.total);
      if (result) {
        const refText = refs.total > 1 ? 'references were' : 'reference was';
        toast.info(
          `${refs.total} ${refText} imported. Review and save the form.`
        );
        return refs;
      }
    } else {
      toast.error("The selected file doesn't have any references.");
    }
  } catch (error) {
    toast.error('The selected file is not a valid BibTex file.');
  }
};

const getReferenceEmptyValue = () => {
  return {
    // Random 16 hex id.
    id: Math.random().toString(16).slice(2, 10)
  };
};

export default function StepReferences(props) {
  const { renderInpageHeader, atbd, id, version, step } = props;

  const { updateAtbd } = useSingleAtbd({ id, version });
  const initialValues = step.getInitialValues(atbd);

  const onSubmit = useSubmitForVersionData(updateAtbd);

  const fileChange = async (e) => {
    const file = e.target.files[0];
    // Reset file input.
    e.target.value = '';
    const refs = await readBibtexFile(file);
  };

  const dropdownMenuTriggerProps = useMemo(
    () => ({
      size: 'small',
      useIcon: ['chevron-down--small', 'after']
    }),
    []
  );

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

  return (
    <Formik
      initialValues={initialValues}
      // There's no need to validate this page since the editor already ensures
      // a valid structure
      //validate={validate}
      onSubmit={onSubmit}
    >
      <Inpage>
        {renderInpageHeader()}
        <InpageBody>
          <FormBlock>
            <FormBlockHeading>{step.label}</FormBlockHeading>
            <Form as={FormikForm}>
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
                      onSelect={() => {}}
                    />
                  </Toolbar>
                </FormFieldsetHeader>
                <FormFieldsetBody>
                  <FieldArray
                    name='document.publication_references'
                    render={({ remove, push, form, name }) => {
                      const values = get(form.values, name);

                      if (!values?.length) {
                        return (
                          <MultiItemEmpty>
                            <p>
                              There are no references. You can start by adding
                              one.
                            </p>
                            <Button
                              useIcon='plus--small'
                              onClick={() => push(getReferenceEmptyValue())}
                            >
                              Add new
                            </Button>
                            <Button useIcon='upload-2' onClick={() => {}}>
                              Import from BibTeX file
                            </Button>
                          </MultiItemEmpty>
                        );
                      }

                      return (
                        <React.Fragment>
                          {values.map((field, index) => (
                            <FormFieldset key={field.id}>
                              <FormFieldsetHeader>
                                <ReferenceFormCheckable
                                  textPlacement='left'
                                  type='checkbox'
                                  hideText
                                >
                                  Select reference
                                </ReferenceFormCheckable>
                                <FormLegend>Reference 1</FormLegend>
                                <Toolbar size='small'>
                                  <ToolbarIconButton
                                    useIcon='pencil'
                                    onClick={() => {}}
                                  >
                                    Edit reference
                                  </ToolbarIconButton>
                                  <VerticalDivider />
                                  <ToolbarIconButton
                                    useIcon='trash-bin'
                                    onClick={() => remove(index)}
                                  >
                                    Delete
                                  </ToolbarIconButton>
                                </Toolbar>
                              </FormFieldsetHeader>
                              <FormFieldsetBody>
                                reference fields
                              </FormFieldsetBody>
                            </FormFieldset>
                          ))}
                          <div>
                            <Button
                              useIcon='plus--small'
                              onClick={() => push(getReferenceEmptyValue())}
                            >
                              Add new
                            </Button>
                            <Button useIcon='upload-2' onClick={() => {}}>
                              Import from BibTeX file
                            </Button>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  />
                </FormFieldsetBody>
              </FormFieldset>
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepReferences.propTypes = {
  renderInpageHeader: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};
