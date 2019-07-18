import React, { Component } from 'react';
import styled from 'styled-components/macro';
import ReactTooltip from 'react-tooltip';

import { themeVal } from '../../styles/utils/general';
import collecticon from '../../styles/collecticons';

import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner
} from '../common/Inpage';
import Prose from '../../styles/type/prose';
import { showGlobalLoading, hideGlobalLoading } from '../common/OverlayLoader';
import Button from '../../styles/button/button';
import Form from '../../styles/form/form';
import {
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody
} from '../../styles/form/fieldset';
import FormLegend from '../../styles/form/legend';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../styles/form/group';
import FormLabel from '../../styles/form/label';
import FormInput from '../../styles/form/input';
import { FormCheckable, FormCheckableGroup } from '../../styles/form/checkable';
import FormSelect from '../../styles/form/select';
import FormTextarea from '../../styles/form/textarea';
import FormToolbar from '../../styles/form/toolbar';
import ButtonGroup from '../../styles/button/group';
import {
  FormHelper,
  FormHelperMessage,
  FormHelperCounter
} from '../../styles/form/helper';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalCancelButton,
  ModalDeleteButton
} from '../common/Modal';
import { confirmDeleteDoc, showConfirmationPrompt } from '../common/ConfirmationPrompt';
import toasts from '../common/toasts';

// Create a ul component to include some styling.

const Ul = styled.ul`
  > li {
    margin-bottom: 1rem;
  }

  > li:last-child {
    margin-bottom: 0;
  }
`;

// Extend the component previously created to change the background
// This is needed to see the achromic buttons.

const DarkUl = styled(Ul)`
  background: ${themeVal('color.base')};
`;

// Extend a button to add an icon.

const ButtonIconBrand = styled(Button)`
  ::before {
    ${collecticon('plus')}
  }
`;

const RemoveButton = styled(Button)`
  ::before {
    ${collecticon('trash-bin')}
  }
`;

const InfoButton = styled(Button)`
  ::before {
    ${collecticon('circle-information')}
  }
`;

// Below the differente button variations and sizes to render all buttons.

const variations = [
  'base-raised-light',
  'base-raised-semidark',
  'base-raised-dark',
  'base-plain',
  'primary-raised-light',
  'primary-raised-semidark',
  'primary-raised-dark',
  'primary-plain',
  'danger-raised-light',
  'danger-raised-dark',
  'danger-plain'
];

const lightVariations = ['achromic-plain', 'achromic-glass'];

const sizes = ['small', 'default', 'large', 'xlarge'];

const showLoading = () => {
  showGlobalLoading();
  setTimeout(() => hideGlobalLoading(), 1024);
};

class Sandbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalRevealed: false
    };
  }

  render() {
    return (
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Sandbox</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>
            <Prose>
              <h2>Toasts</h2>
              <Button
                variation="base-raised-light"
                onClick={() => {
                  toasts.success('This is a success toast. Will auto-dismiss!');
                  toasts.info('This is a info toast. Will auto-dismiss!');
                  toasts.error('This is a error toast. Will NOT auto-dismiss!', { autoClose: false });
                  toasts.warn('This is a warn toast. Will auto-dismiss!');
                }}
              >
                Show Toasts
              </Button>

              <h2>Modal</h2>
              <Button
                variation="base-raised-light"
                onClick={() => this.setState({ modalRevealed: true })}
              >
                Show modal
              </Button>
              {' '}
              <Button
                variation="base-raised-light"
                onClick={async () => {
                  const res = await confirmDeleteDoc('Atmospheric Correction Method for ASTER Thermal Radiometry Over Land');
                  // eslint-disable-next-line
                  alert(res.result ? 'Document can be deleted' : 'Document can not be deleted');
                }}
              >
                Confirm delete
              </Button>
              {' '}
              <Button
                variation="base-raised-light"
                onClick={async () => {
                  const res = await showConfirmationPrompt();
                  // eslint-disable-next-line
                  alert(res.result ? 'User says yes' : 'User says no');
                }}
              >
                Show confirm
              </Button>
              {' '}
              <Button
                variation="base-raised-light"
                onClick={async () => {
                  const res = await showConfirmationPrompt({
                    title: 'Do you really think this is a good idea?',
                    content: 'This may lead to problems down the line',
                    renderControls: ({ confirm, cancel }) => (
                      <React.Fragment>
                        <Button
                          variation="base-raised-light"
                          title="Cancel this action"
                          onClick={cancel}
                        >
                          STOP
                        </Button>
                        <ModalDeleteButton
                          variation="base-raised-light"
                          title="Confirm this action"
                          onClick={confirm}
                        >
                          I know what I&apos;m doing
                        </ModalDeleteButton>
                      </React.Fragment>
                    ),
                    data: 'code-D92GKL1'
                  });
                  // eslint-disable-next-line
                  alert(res.result ? `Ok!\nExtra data: ${res.data}` : 'That was a close call');
                }}
              >
                Show confirm custom
              </Button>

              <Modal
                id="sandbox-modal"
                size="medium"
                // eslint-disable-next-line
                revealed={this.state.modalRevealed}
                onCloseClick={() => this.setState({ modalRevealed: false })}
                headerComponent={(
                  <ModalHeader>
                    <ModalTitle>This is a duckling</ModalTitle>
                  </ModalHeader>
                )}
                bodyComponent={(
                  <ModalBody>
                    <p>
                      This the modal content featuring an image of a yellow duck.
                    </p>
                    <img src="http://tiny.cc/ducky" alt="Yellow duckling" width="400px" />
                    <p>Source: google <br />The modal footer may be used to show more content like buttons but it is not required</p>
                  </ModalBody>
                )}
                footerComponent={(
                  <ModalFooter>
                    <ModalCancelButton
                      variation="base-raised-light"
                      title="Cancel action"
                    >
                      Cancel
                    </ModalCancelButton>
                    <ModalDeleteButton
                      variation="base-raised-light"
                      title="Cancel action"
                    >
                      Delete
                    </ModalDeleteButton>
                  </ModalFooter>
                )}
              />

              <h2>Loader</h2>
              <Button variation="base-raised-light" onClick={showLoading}>
                Show loader
              </Button>

              <h2>Form elements</h2>
              <Form>
                <FormFieldset>
                  <FormFieldsetHeader>
                    <FormLegend>Form legend</FormLegend>
                    <RemoveButton variation="base-plain" size="small" hideText>
                      Remove fieldset
                    </RemoveButton>
                  </FormFieldsetHeader>
                  <FormFieldsetBody>
                    <FormGroup>
                      <FormGroupHeader>
                        <FormLabel htmlFor="input-text-a">Form label</FormLabel>
                        <FormToolbar>
                          <InfoButton
                            variation="base-plain"
                            size="small"
                            hideText
                            data-tip="This is a very helpful tooltip."
                          >
                            Learn more
                          </InfoButton>
                          <ReactTooltip
                            effect="solid"
                            className="type-primary"
                          />
                        </FormToolbar>
                      </FormGroupHeader>
                      <FormGroupBody>
                        <FormInput
                          type="text"
                          size="large"
                          id="input-text-a"
                          placeholder="This is a text input"
                        />
                        <FormHelper>
                          <FormHelperMessage>
                            This is some help text.
                          </FormHelperMessage>
                          <FormHelperCounter>0 / 80</FormHelperCounter>
                        </FormHelper>
                      </FormGroupBody>
                    </FormGroup>

                    <FormGroup>
                      <FormGroupHeader>
                        <FormLabel>Form label</FormLabel>
                      </FormGroupHeader>
                      <FormGroupBody>
                        <FormCheckableGroup>
                          <FormCheckable
                            checked={undefined}
                            type="checkbox"
                            name="checkbox-a"
                            id="checkbox-a"
                          >
                            Checkbox A
                          </FormCheckable>
                          <FormCheckable
                            checked={undefined}
                            type="checkbox"
                            name="checkbox-b"
                            id="checkbox-b"
                          >
                            Checkbox B
                          </FormCheckable>
                        </FormCheckableGroup>
                      </FormGroupBody>
                    </FormGroup>

                    <FormGroup>
                      <FormGroupHeader>
                        <FormLabel>Form label</FormLabel>
                      </FormGroupHeader>
                      <FormGroupBody>
                        <FormCheckableGroup>
                          <FormCheckable
                            textPlacement="right"
                            checked={undefined}
                            type="radio"
                            name="radio-a"
                            id="radio-a1"
                          >
                            Radio A
                          </FormCheckable>
                          <FormCheckable
                            textPlacement="right"
                            checked={undefined}
                            type="radio"
                            name="radio-a"
                            id="radio-a2"
                          >
                            Radio B
                          </FormCheckable>
                          <FormCheckable
                            textPlacement="right"
                            checked={undefined}
                            type="radio"
                            name="radio-a"
                            id="radio-a3"
                          >
                            Radio C
                          </FormCheckable>
                          <FormCheckable
                            textPlacement="right"
                            checked={undefined}
                            type="radio"
                            name="radio-a"
                            id="radio-a4"
                          >
                            Radio D
                          </FormCheckable>
                        </FormCheckableGroup>
                      </FormGroupBody>
                    </FormGroup>

                    <FormFieldset>
                      <FormFieldsetHeader>
                        <FormLegend>Form legend</FormLegend>
                        <RemoveButton
                          variation="base-plain"
                          size="small"
                          hideText
                          data-tip="This is a super helpful tooltip."
                        >
                          Remove fieldset
                        </RemoveButton>
                      </FormFieldsetHeader>
                      <FormFieldsetBody>
                        <FormGroup>
                          <FormGroupHeader>
                            <FormLabel htmlFor="textarea-b">
                              Form label
                            </FormLabel>
                          </FormGroupHeader>
                          <FormGroupBody>
                            <FormTextarea
                              size="large"
                              id="textarea-b"
                              placeholder="This is a textarea"
                            />
                            <FormHelper>
                              <FormHelperMessage>
                                This is an error message.
                              </FormHelperMessage>
                            </FormHelper>
                          </FormGroupBody>
                        </FormGroup>
                      </FormFieldsetBody>
                    </FormFieldset>

                    <FormGroup>
                      <FormGroupHeader>
                        <FormLabel htmlFor="select-a" optional>
                          Form label
                        </FormLabel>
                      </FormGroupHeader>
                      <FormGroupBody>
                        <FormSelect size="large" id="select-a">
                          <option value="option-1">Option 1</option>
                          <option value="option-2">Option 2</option>
                          <option value="option-3">Option 3</option>
                          <option value="option-4">Option 4</option>
                        </FormSelect>
                        <FormHelper>
                          <FormHelperMessage>
                            This is some help text.
                          </FormHelperMessage>
                        </FormHelper>
                      </FormGroupBody>
                    </FormGroup>

                    <FormGroup>
                      <FormGroupHeader>
                        <FormLabel htmlFor="textarea-a">Form label</FormLabel>
                      </FormGroupHeader>
                      <FormGroupBody>
                        <FormTextarea
                          size="large"
                          id="textarea-a"
                          placeholder="This is a textarea"
                          invalid
                        />
                        <FormHelper>
                          <FormHelperMessage>
                            This is an error message.
                          </FormHelperMessage>
                        </FormHelper>
                      </FormGroupBody>
                    </FormGroup>
                  </FormFieldsetBody>
                </FormFieldset>
              </Form>

              <h2>Button Group</h2>
              <ButtonGroup orientation="horizontal">
                <Button variation="base-raised-light">First</Button>
                <Button variation="base-raised-light">Second</Button>
                <Button variation="base-raised-light">Third</Button>
                <Button variation="base-raised-light">Last</Button>
              </ButtonGroup>
              <ButtonGroup orientation="horizontal">
                <ButtonIconBrand variation="base-raised-light">
                  First
                </ButtonIconBrand>
                <ButtonIconBrand variation="base-raised-light">
                  Second
                </ButtonIconBrand>
                <ButtonIconBrand variation="base-raised-light">
                  Third
                </ButtonIconBrand>
              </ButtonGroup>
              <ButtonGroup orientation="vertical">
                <Button variation="base-raised-light">First</Button>
                <Button variation="base-raised-light">Second</Button>
                <Button variation="base-raised-light">Third</Button>
                <Button variation="base-raised-light">Last</Button>
              </ButtonGroup>

              <h2>Buttons</h2>
              <ButtonIconBrand variation="base-raised-light">
                I have an icon
              </ButtonIconBrand>
              <ButtonIconBrand variation="base-raised-light" hideText>
                this text is hidden
              </ButtonIconBrand>

              {variations.map(variation => (
                <Ul key={variation}>
                  {sizes.map(size => (
                    <li key={size}>
                      <Button variation={variation} size={size}>
                        {size} - {variation}
                      </Button>
                    </li>
                  ))}
                </Ul>
              ))}
              {lightVariations.map(variation => (
                <DarkUl key={variation}>
                  {sizes.map(size => (
                    <li key={size}>
                      <Button variation={variation} size={size}>
                        {size} - {variation}
                      </Button>
                    </li>
                  ))}
                </DarkUl>
              ))}
            </Prose>
          </InpageBodyInner>
        </InpageBody>


        {/* <ConfirmationPrompt /> is mounted at high level (App.js) */}
      </Inpage>
    );
  }
}

export default Sandbox;
