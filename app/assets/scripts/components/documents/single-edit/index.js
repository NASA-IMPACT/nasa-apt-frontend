import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { useFormikContext } from 'formik';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { Button } from '@devseed-ui/button';

import App from '../../common/app';
import {
  Inpage,
  InpageHeader,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import UhOh from '../../uhoh';
import DocumentNavHeader from '../document-nav-header';
import StepsMenu from './steps-menu';

import { getATBDEditStep } from './steps';
import { useSingleAtbd } from '../../../context/atbds-list';
import Tip from '../../common/tooltip';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
  }
`;

function DocumentEdit() {
  const { id, version, step } = useParams();
  const { atbd, fetchSingleAtbd } = useSingleAtbd({ id, version });

  useEffect(() => {
    fetchSingleAtbd();
  }, [id, version]);

  const errCode = atbd.error?.response.status;

  if (errCode === 400 || errCode === 404) {
    return <UhOh />;
  } else if (errCode) {
    // This is a serious server error. By throwing it will be caught by the
    // error boundary. There's no recovery from this error.
    throw atbd.error;
  }

  const { StepComponent } = getATBDEditStep(step);

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
  const formik = useFormikContext();
  console.log('🚀 ~ file: index.js ~ line 110 ~ SaveButton ~ formik', formik);

  return (
    <Tip
      position='top-end'
      title='There are unsaved changes'
      open={formik.dirty}
    >
      <Button variation='primary-raised-light' title='Save current changes'>
        Save
      </Button>
    </Tip>
  );
};
