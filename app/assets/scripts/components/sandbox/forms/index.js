import React from 'react';
import styled from 'styled-components';
import { Form, FormHelperMessage } from '@devseed-ui/form';

import App from '../../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageSubtitle,
  InpageMeta,
  InpageBody
} from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import InputText from '../../common/forms/input-text';
import SectionFieldset from '../../common/forms/section-fieldset';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

function SandboxForms() {
  return (
    <App pageTitle='Sandbox/Structure'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Forms</InpageTitle>
          </InpageHeadline>
          <InpageMeta>
            <dt>Under</dt>
            <InpageSubtitle as='dd'>Sandbox</InpageSubtitle>
          </InpageMeta>
        </InpageHeader>
        <InpageBodyScroll>
          <Constrainer>
            <Form>
              <SectionFieldset
                label='Section name'
                status='incomplete' // Should be from state
                // onStatusChange={}
              >
                <InputText
                  id='title'
                  name='title'
                  label='Title'
                  description='This is the description that goes into the tooltip'
                  helper={
                    <FormHelperMessage>
                      This is some help text.
                    </FormHelperMessage>
                  }
                  // value=''
                  // onChange={}
                />
              </SectionFieldset>
            </Form>
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default SandboxForms;
