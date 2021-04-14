import React from 'react';
import styled from 'styled-components';
import { Form, FormHelperMessage } from '@devseed-ui/form';

import App from '../../common/app';

import { Link } from '../../../styles/clean/link';

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
import { InputText } from '../../common/forms/input-text';
import { SectionFieldset } from '../../common/forms/section-fieldset';
import { DeletableFieldset } from '../../common/forms/deletable-fieldset';
import { FieldMultiItem } from '../../common/forms/field-multi-item';

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
            <InpageSubtitle as='dd'>
              <Link to='/sandbox' title='Visit Sandbox hub'>
                Sandbox
              </Link>
            </InpageSubtitle>
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

              <SectionFieldset
                label='Multi item fields'
                status='incomplete' // Should be from state
                // onStatusChange={}
              >
                <FieldMultiItem
                  label='Field Array'
                  description='Description for the array fields popover'
                >
                  <DeletableFieldset
                    label='Array Fieldset'
                    disableDelete
                    deleteDescription='At least one field is needed'
                  >
                    <InputText label='Field title' description='Something' />
                  </DeletableFieldset>
                </FieldMultiItem>

                <FieldMultiItem
                  label='Field Array Empty'
                  emptyMessage='There is nothing here. You can start by adding something.'
                >
                  {/* Nothing here */}
                </FieldMultiItem>
              </SectionFieldset>
            </Form>
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default SandboxForms;
