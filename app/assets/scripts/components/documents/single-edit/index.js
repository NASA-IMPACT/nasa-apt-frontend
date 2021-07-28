import React, { useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useFormikContext } from 'formik';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { VerticalDivider } from '@devseed-ui/toolbar';

import App from '../../common/app';
import { InpageHeaderSticky, InpageActions } from '../../../styles/inpage';
import ButtonSecondary from '../../../styles/button-secondary';
import UhOh from '../../uhoh';
import DocumentHeadline from '../document-headline';
import DocumentActionsMenu from '../document-actions-menu';
import StepsMenu from './steps-menu';
import Tip from '../../common/tooltip';
import { DocumentModals, useDocumentModals } from '../use-document-modals';
import DocumentGovernanceAction from '../document-governance-action';

import { getDocumentEditStep } from './steps';
import {
  useSingleAtbd,
  useSingleAtbdEvents
} from '../../../context/atbds-list';
import { documentDeleteVersionConfirmAndToast } from '../document-delete-process';
import { documentUpdatedDate } from '../../../utils/date';

function DocumentEdit() {
  const { id, version, step } = useParams();
  const history = useHistory();
  const {
    atbd,
    fetchSingleAtbd,
    createAtbdVersion,
    updateAtbd,
    publishAtbdVersion,
    deleteAtbdVersion
  } = useSingleAtbd({ id, version });
  // Get all fire event actions.
  const atbdFevActions = useSingleAtbdEvents({ id, version });

  useEffect(() => {
    fetchSingleAtbd();
  }, [id, version, fetchSingleAtbd]);

  const { menuHandler, documentModalProps } = useDocumentModals({
    atbd: atbd.data,
    createAtbdVersion,
    updateAtbd,
    publishAtbdVersion,
    ...atbdFevActions
  });

  const onDocumentMenuAction = useCallback(
    async (menuId) => {
      // Handle actions that would trigger document modals.
      await menuHandler(menuId);

      switch (menuId) {
        case 'delete':
          await documentDeleteVersionConfirmAndToast({
            atbd: atbd.data,
            deleteAtbdVersion,
            history
          });
          break;
      }
    },
    [atbd.data, deleteAtbdVersion, history, menuHandler]
  );

  // We only want to handle errors when the atbd request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (atbd.status === 'failed') {
    const errCode = atbd.error?.response.status;

    if (errCode === 400 || errCode === 404) {
      return <UhOh />;
    } else if (atbd.error) {
      // This is a serious server error. By throwing it will be caught by the
      // error boundary. There's no recovery from this error.
      throw atbd.error;
    }
  }

  const stepDefinition = getDocumentEditStep(step);
  const { StepComponent } = stepDefinition;

  if (!StepComponent) {
    return <UhOh />;
  }

  // Explanation of step component structure.
  // To facilitate form management each step has its own formik instance and
  // manages the step specific data. This could be setup something like:
  // App
  //   Inpage
  //     InpageHeader
  //     InpageBody
  //       Formik
  //       -- Step form
  //
  // However we have a global save button that is in the header. Because of this
  // the formik instance must wrap the whole inpage or we don't have access to
  // the formContext for the save button.
  // This can be solved having each step component render Formik, the inpage
  // header and the step form. Instead of moving the InpageHeader to a separate
  // component and include it on every component, it gets passed as a render
  // prop.

  const pageTitle = atbd.data?.title
    ? `Editing ${atbd.data.title}`
    : 'Document view';

  // The updated at is the most recent between the version updated at and the
  // atbd updated at. In the case of a single ATBD the selected version data is
  // merged with the ATBD meta and that's why both variables are
  // the same.
  const updatedDate = atbd.data && documentUpdatedDate(atbd.data, atbd.data);

  return (
    <App pageTitle={pageTitle}>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && (
        <DocumentModals {...documentModalProps} />
      )}
      {atbd.status === 'succeeded' && (
        <StepComponent
          step={stepDefinition}
          id={id}
          version={version}
          atbd={atbd.data}
          renderInpageHeader={() => (
            <InpageHeaderSticky>
              <DocumentHeadline
                atbdId={id}
                title={atbd.data.title}
                version={version}
                versions={atbd.data.versions}
                updatedDate={updatedDate}
                onAction={onDocumentMenuAction}
                mode='edit'
              />
              <InpageActions>
                <DocumentGovernanceAction
                  atbd={atbd.data}
                  origin='single-edit'
                  onAction={onDocumentMenuAction}
                />
                <StepsMenu atbdId={id} atbd={atbd.data} activeStep={step} />
                <SaveButton />
                <VerticalDivider variation='light' />
                <DocumentActionsMenu
                  // In the case of a single ATBD the selected version data is
                  // merged with the ATBD meta and that's why both variables are
                  // the same.
                  atbd={atbd.data}
                  atbdVersion={atbd.data}
                  variation='achromic-plain'
                  onSelect={onDocumentMenuAction}
                  origin='single-edit'
                />
              </InpageActions>
            </InpageHeaderSticky>
          )}
        />
      )}
    </App>
  );
}

export default DocumentEdit;

// Moving the save button to a component of its own to use Formik context.
const SaveButton = () => {
  const {
    dirty,
    isSubmitting,
    submitForm,
    status,
    touched,
    isValid
  } = useFormikContext();
  // status?.working is used to disable form submission when something is going
  // on. An example is the alias existence checking.

  // We only want to show an error message when the global validations have run.
  // Just checking if it is valid results in the message to be too obtrusive. A
  // simple way to check this is to use the id field. Formik touches all fields
  // when running global validations, an the id can't be reached in any other
  // way.
  const tipMessage =
    !isValid && touched.id
      ? 'There are errors in the form'
      : 'There are unsaved changes';

  return (
    <Tip position='top-end' title={tipMessage} open={dirty}>
      <ButtonSecondary
        title='Save current changes'
        disabled={isSubmitting || !dirty || status?.working}
        onClick={submitForm}
        useIcon='tick--small'
      >
        Save
      </ButtonSecondary>
    </Tip>
  );
};
