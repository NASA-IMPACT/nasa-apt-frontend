import React, { useCallback } from 'react';
import T from 'prop-types';
import axios from 'axios';
import styled from 'styled-components';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Form } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { visuallyHidden } from '@devseed-ui/theme-provider';

import { useSubmitForVersionData } from './use-submit';
import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';

import { useSingleAtbd } from '../../../context/atbds-list';
import { getDocumentSectionLabel } from './sections';
import { LocalStore } from './local-store';
import { FormikUnloadPrompt } from '../../common/unload-prompt';
import { useAuthToken } from '../../../context/user';
import { axiosAPI } from '../../../utils/axios';
import { atbdPdfUpload } from '../../../utils/url-creator';

const HiddenFileInput = styled.input`
  ${visuallyHidden()}
`;

function PDFUploadButton(props) {
  const { atbd } = props;
  const fileInputRef = React.useRef();
  const { token } = useAuthToken();
  const { setFieldValue } = useFormikContext();

  const handleChange = React.useCallback(
    (e) => {
      if (e.target.files) {
        // eslint-disable-next-line no-inner-declarations
        async function uploadToS3() {
          try {
            const headers = {
              Authorization: `Bearer ${token}`
            };
            const s3UrlResponse = await axiosAPI({
              url: atbdPdfUpload(atbd),
              method: 'POST',
              headers
            });

            const { upload_id, upload_url } = s3UrlResponse.data;

            const pdfFile = e.target.files[0];
            await axios.put(upload_url, pdfFile);
            setFieldValue('pdf_id', upload_id);
          } catch (error) {
            // TODO: show message to user
            // eslint-disable-next-line no-console
            console.error(error);
          }
        }

        uploadToS3();
      }
    },
    [token, atbd, setFieldValue]
  );

  const handleUploadClick = React.useCallback(() => {
    fileInputRef.current.click();
  }, []);

  return (
    <>
      <Button
        variation='primary-raised-dark'
        onClick={handleUploadClick}
        useIcon='upload'
      >
        Choose a file to Upload
      </Button>
      <HiddenFileInput
        ref={fileInputRef}
        type='file'
        onChange={handleChange}
        accept='.pdf'
      />
    </>
  );
}

PDFUploadButton.propTypes = {
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};

function StepAttachement(props) {
  const {
    atbd,
    id,
    version,
    step,
    renderInpageHeader,
    renderFormFooter
  } = props;
  const { updateAtbd } = useSingleAtbd({ id, version });
  const initialValues = step.getInitialValues(atbd);

  const onSubmit = useSubmitForVersionData(updateAtbd, atbd);

  const validate = useCallback((values) => {
    let errors = {};
    if (values.pdf_id === undefined || values.pdf_id === null) {
      errors.pdf_id = 'This field is required';
    }

    return errors;
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      <Inpage>
        <LocalStore atbd={atbd} />
        <FormikUnloadPrompt />
        {renderInpageHeader()}
        <InpageBody>
          <FormBlock>
            <FormBlockHeading>{step.label}</FormBlockHeading>
            <Form as={FormikForm}>
              <FormikSectionFieldset
                label={getDocumentSectionLabel('attachment')}
                sectionName='sections_completed.attachment'
                commentSection='attachment'
              >
                <div>
                  <PDFUploadButton atbd={atbd} />
                </div>
              </FormikSectionFieldset>
              {renderFormFooter()}
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepAttachement.propTypes = {
  renderInpageHeader: T.func,
  renderFormFooter: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};

export default StepAttachement;
