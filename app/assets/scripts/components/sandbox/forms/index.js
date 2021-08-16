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
  InpageBody,
  InpageHeadHgroup
} from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import { InputText } from '../../common/forms/input-text';
import { SectionFieldset } from '../../common/forms/section-fieldset';
import { DeletableFieldset } from '../../common/forms/deletable-fieldset';
import { FieldMultiItem } from '../../common/forms/field-multi-item';
import SelectCombo from '../../common/forms/select-combo';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

const selectOptions = [
  {
    value: 'v5hu54hw',
    label: 'Isaac Cantera'
  },
  {
    value: 'wllxcw4t',
    label: 'Franciska Fabbri'
  },
  {
    value: 'qv0cfr80',
    label: 'Karen Sample'
  },
  {
    value: 'ale13yvg',
    label: 'Daryn Bice'
  },
  {
    value: 'kvdjaang',
    label:
      'Purus sit amet nulla quisque arcu libero rutrum ac lobortis vel dapibus at diam nam'
  },
  {
    value: '7gduphf1',
    label:
      'Ornare imperdiet sapien urna pretium nisl ut volutpat sapien arcu sed augue aliquam erat volutpat'
  },
  {
    value: '4zwg4wkc',
    label:
      'Blandit lacinia erat vestibulum sed magna at nunc commodo placerat praesent blandit'
  },
  {
    value: 'zkph7puf',
    label:
      'Parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa sed magna at nunc dapibus'
  },
  {
    value: 'vq79mcjv',
    label: 'Sapien cursus vestibulum proin eu mi nulla ac enim in tempor'
  },
  {
    value: '5oyl8dup',
    label:
      'Erat eros viverra eget congue eget semper rutrum nulla nunc purus phasellus in felis donec semper sapien a libero nam'
  }
];

function SandboxForms() {
  return (
    <App pageTitle='Sandbox/Structure'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageHeadHgroup>
              <InpageTitle>Forms</InpageTitle>
            </InpageHeadHgroup>
            <InpageSubtitle>
              <Link to='/sandbox' title='Visit Sandbox hub'>
                Sandbox
              </Link>
            </InpageSubtitle>
          </InpageHeadline>
        </InpageHeader>
        <InpageBodyScroll>
          <Constrainer>
            <Form>
              <SelectCombo options={selectOptions} />

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
