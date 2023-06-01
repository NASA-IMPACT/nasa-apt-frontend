import React, { useCallback, useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import { useFormikContext } from 'formik';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { VerticalDivider } from '@devseed-ui/toolbar';
import { Button } from '@devseed-ui/button';

import App from '../../common/app';
import { InpageHeaderSticky, InpageActions } from '../../../styles/inpage';
import ButtonSecondary from '../../../styles/button-secondary';
import UhOh from '../../uhoh';
import DocumentHeadline from '../document-headline';
import DocumentActionsMenu from '../document-actions-menu';
import StepsMenu from './steps-menu';
import Tip from '../../common/tooltip';
import { DocumentModals, useDocumentModals } from '../use-document-modals';
import ClosedReviewForbidden from './closed-review-forbidden';
import Forbidden from '../../../a11n/forbidden';

import { getDocumentEditStep, getNextDocumentEditStep } from './steps';
import {
  useSingleAtbd,
  useSingleAtbdEvents
} from '../../../context/atbds-list';
import { documentDeleteVersionConfirmAndToast } from '../document-delete-process';
import { isClosedReview } from '../status';
import { useUser } from '../../../context/user';
import {
  useCommentCenter,
  useCommentCenterHistoryHandler
} from '../../../context/comment-center';
import { useThreadStats } from '../../../context/threads-list';
import { useEffectPrevious } from '../../../utils/use-effect-previous';
import { useSaveTooltipPlacement } from '../../../utils/use-save-tooltip-placement';
import { documentEdit, documentView } from '../../../utils/url-creator';
import CheckLock from './check-lock';
import getDocumentIdKey from '../get-document-id-key';

const FormFooter = styled.div`
  display: flex;
  align-items: right;
  justify-content: right;
`;

function DocumentEdit() {
  const { id, version, step } = useParams();
  const history = useHistory();
  const { isLogged, user } = useUser();
  const {
    atbd,
    fetchSingleAtbd,
    createAtbdVersion,
    updateAtbd,
    deleteAtbdVersion
  } = useSingleAtbd({ id, version });

  const pdfMode = atbd.data.document_type === 'PDF';
  // Get all fire event actions.
  const atbdFevActions = useSingleAtbdEvents({ id, version });
  // Thread stats - function for initial fetching which stores the document for
  // which stats are being fetched. Calls to the the refresh (exported by
  // useThreadStats) function will use the same stored document.
  const { fetchThreadsStatsForAtbds } = useThreadStats();

  const { isPanelOpen, setPanelOpen, openPanelOn } = useCommentCenter({ atbd });

  // Se function definition for explanation.
  useCommentCenterHistoryHandler({ atbd });

  // Fetch the thread stats list to show in the button when the document loads.
  useEffectPrevious(
    (prev) => {
      const prevStatus = prev?.[0]?.status;
      // This hook is called when the "atbd" changes, which happens also when
      // there's a mutation, but we don't want to fetch stats on mutations, only
      // when the atbd is fetched (tracked by a .status change.)
      if (prevStatus !== atbd.status && atbd.status === 'succeeded') {
        fetchThreadsStatsForAtbds(atbd.data);
      }
    },
    [atbd, fetchThreadsStatsForAtbds]
  );

  useEffect(() => {
    if (isLogged) {
      fetchSingleAtbd();
    }
  }, [isLogged, id, version, fetchSingleAtbd]);

  const { menuHandler, documentModalProps } = useDocumentModals({
    atbd: atbd.data,
    createAtbdVersion,
    updateAtbd,
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
        case 'toggle-comments':
          if (isPanelOpen) {
            setPanelOpen(false);
          } else {
            openPanelOn({
              atbdId: atbd.data.id,
              atbdVersion: atbd.data.version
            });
          }
      }
    },
    [
      atbd.data,
      deleteAtbdVersion,
      history,
      menuHandler,
      isPanelOpen,
      setPanelOpen,
      openPanelOn
    ]
  );

  // We only want to handle errors when the atbd request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (atbd.status === 'failed') {
    const errCode = atbd.error?.response.status;

    if (errCode === 400 || errCode === 404) {
      return <UhOh />;
    } else if (errCode === 403) {
      return <Forbidden />;
    } else if (atbd.error) {
      // This is a serious server error. By throwing it will be caught by the
      // error boundary. There's no recovery from this error.
      throw atbd.error;
    }
  }

  const stepDefinition = getDocumentEditStep(step, pdfMode);
  const nextStepDefinition = getNextDocumentEditStep(step, pdfMode);

  // During the closed review process the document can't be edited.
  // Show a message instead of a step.
  const StepComponent = isClosedReview(atbd.data)
    ? ClosedReviewForbidden
    : stepDefinition.StepComponent;

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

  return (
    <App pageTitle={pageTitle}>
      <CheckLock id={id} version={version} user={user} />
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
                atbd={atbd.data}
                onAction={onDocumentMenuAction}
                mode='edit'
              />
              <InpageActions>
                <StepsMenu atbdId={id} atbd={atbd.data} activeStep={step} />
                {!isClosedReview(atbd.data) && <SaveButton />}
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
          renderFormFooter={() => {
            return (
              !isClosedReview(atbd.data) && (
                <FormFooter>
                  <SaveAndContinueButton nextStep={nextStepDefinition.id} />
                </FormFooter>
              )
            );
          }}
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

  // See hook definition file for explanation
  useSaveTooltipPlacement({ showing: dirty, tipMessage });

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

const SaveAndContinueButton = ({ nextStep }) => {
  const history = useHistory();
  const { dirty, isSubmitting, submitForm, status } = useFormikContext();
  const submitAndContinue = useCallback(
    async (e) => {
      const { error, data } = await submitForm(e);
      const idKey = getDocumentIdKey(data);
      if (!error) {
        if (nextStep) {
          history.replace(documentEdit(idKey, data.version, nextStep));
        } else {
          history.replace(documentView(idKey, data.version));
        }
      }
    },
    [submitForm, history, nextStep]
  );

  return (
    <Button
      variation='primary-raised-dark'
      title='Save current changes and continue to next step'
      disabled={isSubmitting || !dirty || status?.working}
      onClick={submitAndContinue}
      useIcon='tick--small'
    >
      Save &amp; {nextStep ? 'continue' : 'view'}
    </Button>
  );
};

SaveAndContinueButton.propTypes = {
  nextStep: T.string
};
