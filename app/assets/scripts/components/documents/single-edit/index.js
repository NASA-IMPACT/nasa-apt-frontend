import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
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

  return (
    <App pageTitle='Document Edit'>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && (
        <Inpage>
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
          <InpageBodyScroll>
            <Constrainer>
              <StepComponent />
            </Constrainer>
          </InpageBodyScroll>
        </Inpage>
      )}
    </App>
  );
}

export default DocumentEdit;

// Moving the save button to a component of its own to use Formik context.
const SaveButton = () => {
  return (
    <Button variation='primary-raised-light' title='Save current changes'>
      Save
    </Button>
  );
};
