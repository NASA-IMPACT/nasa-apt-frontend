import React from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { toast } from 'react-toastify';
import { Form } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikInputEditor } from '../../common/forms/input-editor';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useSubmitForVersionData } from './use-submit';
import { formString } from '../../../utils/strings';
import { bibtexItemsToRefs, parseBibtexFile } from '../../../utils/references';
import { showConfirmationPrompt } from '../../common/confirmation-prompt';

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
              <input type='file' onChange={fileChange} />
              Hello
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
