import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useFormikContext } from 'formik';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { Button } from '@devseed-ui/button';

import App from '../../common/app';
import { InpageHeader, InpageActions } from '../../../styles/inpage';
import UhOh from '../../uhoh';
import DocumentNavHeader from '../document-nav-header';
import StepsMenu from './steps-menu';

import { getATBDEditStep } from './steps';
import { useSingleAtbd } from '../../../context/atbds-list';
import Tip from '../../common/tooltip';

function DocumentEdit() {
  const { id, version, step } = useParams();
  const { atbd, fetchSingleAtbd } = useSingleAtbd({ id, version });

  useEffect(() => {
    fetchSingleAtbd();
  }, [id, version]);

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

  const stepDefinition = getATBDEditStep(step);
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

  return (
    <App pageTitle='Document Edit'>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && (
        <StepComponent
          step={stepDefinition}
          id={id}
          version={version}
          atbd={atbd.data}
          renderInpageHeader={() => (
            <InpageHeader>
              <DocumentNavHeader
                atbdId={id}
                title={atbd.data.title}
                status={atbd.data.status}
                currentVersion={version}
                versions={atbd.data.versions}
                mode='edit'
              />
              <InpageActions>
                <StepsMenu
                  atbdId={id}
                  currentVersion={version}
                  activeStep={step}
                />
                <SaveButton />
              </InpageActions>
            </InpageHeader>
          )}
        />
      )}
    </App>
  );
}

export default DocumentEdit;

// Moving the save button to a component of its own to use Formik context.
const SaveButton = () => {
  const { dirty, isSubmitting, submitForm, status } = useFormikContext();
  // status?.working is used to disable form submission when something is going
  // on. An example is the alias existence checking.

  return (
    <Tip position='top-end' title='There are unsaved changes' open={dirty}>
      <Button
        variation='primary-raised-light'
        title='Save current changes'
        disabled={isSubmitting || !dirty || status?.working}
        onClick={submitForm}
      >
        Save
      </Button>
    </Tip>
  );
};
