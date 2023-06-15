import React, { useCallback } from 'react';
import T from 'prop-types';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Formik, Form as FormikForm, useField, useFormikContext } from 'formik';
import { Form } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
// import { GlobalLoading } from '@devseed-ui/global-loading';
import { glsp, visuallyHidden } from '@devseed-ui/theme-provider';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useAuthToken } from '../../../context/user';
import { axiosAPI } from '../../../utils/axios';
import { atbdPdfUpload } from '../../../utils/url-creator';

import { FormikSectionFieldset } from '../../common/forms/section-fieldset';
import { createProcessToast } from '../../common/toasts';
import { FormikUnloadPrompt } from '../../common/unload-prompt';

import { useSubmitForVersionData } from './use-submit';
import { getDocumentSectionLabel } from './sections';
import { LocalStore } from './local-store';

const HiddenFileInput = styled.input`
  ${visuallyHidden()}
`;

const UploadButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${glsp()};
  align-items: flex-start;
`;

function PDFUploadButton(props) {
  const { atbd } = props;
  const fileInputRef = React.useRef();
  const { token } = useAuthToken();
  const [, , { setValue }] = useField('pdf_id');
  const { status, setStatus } = useFormikContext();

  const handleChange = React.useCallback(
    (e) => {
      if (e.target.files) {
        // eslint-disable-next-line no-inner-declarations
        async function uploadToS3() {
          const processToast = createProcessToast('Uploading file...');
          try {
            setStatus({ working: true });
            const headers = {
              Authorization: `Bearer ${token}`
            };
            const s3UrlResponse = await axiosAPI({
              url: atbdPdfUpload(atbd),
              method: 'POST',
              headers
            });

            const { upload_id, upload_url, upload_fields } = s3UrlResponse.data;

            await axios.post(
              upload_url,
              {
                ...upload_fields,
                file: e.target.files[0]
              },
              { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setValue(upload_id);
            setStatus({ working: false });
            processToast.success('File uploaded successfully!');
          } catch (error) {
            processToast.error('Failed to upload the file!');
            // eslint-disable-next-line no-console
            console.error(error);
            setStatus({ working: false });
          }
        }

        if (e.target.files[0]?.type !== 'application/pdf') {
          toast(
            'Unsupported file! Please select a valid PDF file for upload!',
            {
              closeOnClick: false,
              closeButton: true,
              autoClose: false,
              draggable: false,
              type: toast.TYPE.ERROR
            }
          );
          return;
        }

        uploadToS3();
      }
    },
    [token, atbd, setValue, setStatus]
  );

  const handleUploadClick = React.useCallback(() => {
    fileInputRef.current.click();
  }, []);

  return (
    <UploadButtonContainer>
      {atbd.pdf && (
        <a target='_blank' rel='noreferrer noopener' href={atbd.pdf.file_path}>
          View selected file
        </a>
      )}
      <Button
        disabled={status?.working}
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
    </UploadButtonContainer>
  );
}

PDFUploadButton.propTypes = {
  atbd: T.shape({
    id: T.number,
    document: T.object,
    pdf: T.object
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
