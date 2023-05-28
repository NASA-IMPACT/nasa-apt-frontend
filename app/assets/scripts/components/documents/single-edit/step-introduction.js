import React from 'react';
import axios from 'axios';
import T from 'prop-types';
import styled from 'styled-components';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { FaFilePdf, FaFileAlt, FaFileWord } from 'react-icons/fa';
import { SiLatex } from 'react-icons/si';
import { Form } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { themeVal, glsp, visuallyHidden } from '@devseed-ui/theme-provider';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikInputEditor } from '../../common/forms/input-editor';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';
import RichTextContex2Formik from './rich-text-ctx-formik';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useAuthToken } from '../../../context/user';
import { FormikUnloadPrompt } from '../../common/unload-prompt';
import { useSubmitForVersionData } from './use-submit';
import { formString } from '../../../utils/strings';
import { useBooleanState } from '../../../utils/common';
import { axiosAPI } from '../../../utils/axios';
import { atbdPdfUpload } from '../../../utils/url-creator';
import { getDocumentSectionLabel } from './sections';
import { LocalStore } from './local-store';

const HiddenFileInput = styled.input`
  ${visuallyHidden()}
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TemplateContainer = styled.div`
  display: flex;
  gap: ${glsp()};
  padding: ${glsp()} 0;
`;

const TemplateLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${glsp(0.2)};

  > span {
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ModalDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
`;

const PDFIcon = styled(FaFilePdf)`
  font-size: 8rem;
`;

const ModalContent = styled.div`
  display: flex;
  gap: ${glsp(3)};
  padding: ${glsp(3)};
`;

function PDFUpload(props) {
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
            const s3UrlResponse = await axiosAPI({
              url: atbdPdfUpload(atbd),
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            const { upload_id, upload_url } = s3UrlResponse.data;

            const pdfFile = e.target.files[0];
            await axios.put(upload_url, pdfFile);
            setFieldValue('document_type', 'PDF');
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

PDFUpload.propTypes = {
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};

export default function StepIntroduction(props) {
  const {
    renderInpageHeader,
    renderFormFooter,
    atbd,
    id,
    version,
    step
  } = props;

  const [
    showPdfUploadModal,
    setShowPdfUploadModalTrue,
    setShowPdfUploadModalFalse
  ] = useBooleanState(false);
  const { updateAtbd } = useSingleAtbd({ id, version });
  const initialValues = step.getInitialValues(atbd);

  const onSubmit = useSubmitForVersionData(updateAtbd, atbd);

  return (
    <>
      <Formik
        initialValues={initialValues}
        // There's no need to validate this page since the editor already ensures
        // a valid structure
        //validate={validate}
        onSubmit={onSubmit}
      >
        <Inpage>
          <LocalStore atbd={atbd} />
          <FormikUnloadPrompt />
          {renderInpageHeader()}
          <InpageBody>
            <FormBlock>
              <FormHeader>
                <FormBlockHeading>{step.label}</FormBlockHeading>
                <div>
                  Have an existing ATBD?{' '}
                  <Button
                    useIcon='page'
                    variation='primary-raised-dark'
                    onClick={setShowPdfUploadModalTrue}
                  >
                    Upload PDF
                  </Button>
                </div>
              </FormHeader>
              <Form as={FormikForm}>
                <Modal
                  id='pdf-upload-modal'
                  revealed={showPdfUploadModal}
                  onCloseClick={setShowPdfUploadModalFalse}
                  title='Upload PDF'
                  footerContent={
                    <>
                      <PDFUpload atbd={atbd} />
                    </>
                  }
                  content={
                    <ModalContent>
                      <PDFIcon />
                      <ModalDescription>
                        <p>
                          Once you upload a PDF, document drafting sections of
                          the ATBD will be removed.
                        </p>
                        <p>
                          <p>
                            <strong>Need a Template?</strong>
                            <div>
                              Download a template to help you match your
                              document to APT standards
                            </div>
                            <TemplateContainer>
                              <TemplateLink
                                href='https://docs.google.com/document/d/1T4q56qZrRN5L6MGXA1UJLMgDgS-Fde9Fo4R4bwVQDF8/edit?usp=sharing'
                                target='_blank'
                                rel='noopener'
                              >
                                <span>
                                  <FaFileAlt />
                                </span>
                                <div>Google Docs</div>
                              </TemplateLink>
                              <TemplateLink
                                href='https://docs.google.com/document/d/1Jh3htOiivNIG_ZqhbN5nEK1TAVB6BjRY/edit?usp=share_link&ouid=102031143611308171378&rtpof=true&sd=true'
                                target='_blank'
                                rel='noopener'
                              >
                                <span>
                                  <FaFileWord />
                                </span>
                                <div>Microsoft Word</div>
                              </TemplateLink>
                              <TemplateLink
                                href='https://drive.google.com/file/d/1AusZOxIpkBiA0QJAB3AtSXSBUU5tWwlJ/view?usp=share_link'
                                target='_blank'
                                rel='noopener'
                              >
                                <span>
                                  <SiLatex />
                                </span>
                                <div>LaTeX</div>
                              </TemplateLink>
                            </TemplateContainer>
                          </p>
                        </p>
                      </ModalDescription>
                    </ModalContent>
                  }
                />
                <RichTextContex2Formik>
                  <FormikSectionFieldset
                    label={getDocumentSectionLabel('introduction')}
                    sectionName='sections_completed.introduction'
                    commentSection='introduction'
                  >
                    <FormikInputEditor
                      id='introduction'
                      name='document.introduction'
                      label='Introduce the algorithm'
                      description={formString('introduction.introduction')}
                    />
                  </FormikSectionFieldset>

                  <FormikSectionFieldset
                    label={getDocumentSectionLabel('context_background')}
                    sectionName='sections_completed.context_background'
                    commentSection='context_background'
                  >
                    <FormikInputEditor
                      id='historical_perspective'
                      name='document.historical_perspective'
                      label='Historical perspective'
                      description={formString(
                        'introduction.historical_perspective'
                      )}
                    />
                    <FormikInputEditor
                      id='additional_information'
                      name='document.additional_information'
                      label='Additional information'
                      description={formString(
                        'introduction.additional_information'
                      )}
                    />
                  </FormikSectionFieldset>
                </RichTextContex2Formik>
                {renderFormFooter()}
              </Form>
            </FormBlock>
          </InpageBody>
        </Inpage>
      </Formik>
    </>
  );
}

StepIntroduction.propTypes = {
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
