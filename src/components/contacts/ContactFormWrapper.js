/* eslint camelcase: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import styled from 'styled-components';

import Dropdown from '../common/Dropdown';
import FormLegend from '../../styles/form/legend';
import FormLabel from '../../styles/form/label';
import {
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody
} from '../../styles/form/fieldset';
import {
  FormGroup,
  FormGroupBody,
  FormGroupHeader
} from '../../styles/form/group';
import { FormCheckable, FormCheckableGroup } from '../../styles/form/checkable';
import RemoveButton from '../../styles/button/remove';
import ContactForm from './ContactForm';
import Button from '../../styles/button/button';
import collecticon from '../../styles/collecticons';
import AddBtn from '../../styles/button/add';

const PERSON = 'person';
const GROUP = 'group';

const AddContactDropBtn = styled(Button)`
  display: flex;

  ::after {
    ${collecticon('chevron-down--small')}
    margin-left: auto;
  }
`;

const ContactSelectDropdown = styled(Dropdown)`
  min-width: 20rem;
`;

const MagnifierIcon = styled.i`
  padding: 0 0.5rem;

  ::after {
    ${collecticon('magnifier-right')}
  }
`;

const selectStyles = {
  menu: () => ({}) // Remove all styles
};

class ContactFormWrapper extends Component {
  constructor(props) {
    super(props);

    this.onSelectChange = this.onSelectChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onCreateClick = this.onCreateClick.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
  }

  onFormSubmit(action, payload) {
    const { contactIndex, onFormSubmit } = this.props;
    onFormSubmit(action, contactIndex, payload);
  }

  renderTypePicker() {
    const {
      id, contact, contactIndex, onTypeChange
    } = this.props;

    return (
      <FormGroup>
        <FormGroupHeader>
          <FormLabel>Type</FormLabel>
        </FormGroupHeader>
        <FormGroupBody>
          <FormCheckableGroup>
            <FormCheckable
              checked={!contact.isGroup}
              type="radio"
              name={`${id}-radio`}
              id={`${id}-type-person`}
              onChange={() => onTypeChange(contactIndex, PERSON)}
            >
              Person
            </FormCheckable>
            <FormCheckable
              checked={contact.isGroup}
              type="radio"
              name={`${id}-radio`}
              id={`${id}-type-group`}
              onChange={() => onTypeChange(contactIndex, GROUP)}
            >
              Group
            </FormCheckable>
          </FormCheckableGroup>
        </FormGroupBody>
      </FormGroup>
    );
  }

  renderForm() {
    const { contact, id } = this.props;

    switch (contact.__action) {
      case 'selecting':
        return null;
      case 'creating':
        return (
          <React.Fragment>
            {this.renderTypePicker()}
            <ContactForm
              contact={contact}
              id={id}
              isGroup={contact.isGroup}
              onSubmit={this.onFormSubmit}
            />
          </React.Fragment>
        );
      default:
        return (
          <ContactForm
            contact={contact}
            id={id}
            isGroup={contact.isGroup}
            onSubmit={this.onFormSubmit}
          />
        );
    }
  }

  onCreateClick() {
    const { contactIndex, onCreateSelect } = this.props;

    onCreateSelect(contactIndex);
  }

  onSelectChange(...args) {
    const { contactIndex, onSelectChange } = this.props;

    onSelectChange(contactIndex, ...args);
  }

  onRemoveClick() {
    const { contactIndex, onRemoveClick } = this.props;

    onRemoveClick(contactIndex);
  }

  getDropLabel() {
    const { contact } = this.props;

    if (contact.__action === 'creating') {
      return 'Creating new contact';
    }

    if (contact.__action === 'editing') {
      return `Editing: ${contact.displayName}`;
    }

    return 'Select or create contact';
  }

  renderContactSelectDropdown() {
    const { availableContacts, contact } = this.props;

    return (
      <ContactSelectDropdown
        alignment="left"
        direction="down"
        triggerElement={(
          <AddContactDropBtn
            size="large"
            variation="base-raised-light"
            disabled={!!contact.atbd_id}
          >
            {this.getDropLabel()}
          </AddContactDropBtn>
        )}
      >
        <ReactSelect
          autoFocus
          styles={selectStyles}
          components={{ DropdownIndicator, IndicatorSeparator: null }}
          getOptionLabel={opt => opt.displayName}
          getOptionValue={opt => opt.id}
          backspaceRemovesValue={false}
          controlShouldRenderValue={false}
          hideSelectedOptions={false}
          isClearable={false}
          menuIsOpen
          maxMenuHeight={200}
          options={availableContacts}
          placeholder="Search contact..."
          tabSelectsValue={false}
          onChange={this.onSelectChange}
          value={contact.id}
        />
        <AddBtn onClick={this.onCreateClick} data-hook="dropdown:close">
          Create new contact
        </AddBtn>
      </ContactSelectDropdown>
    );
  }

  render() {
    const { title } = this.props;

    return (
      <FormFieldset>
        <FormFieldsetHeader>
          <FormLegend>{title}</FormLegend>
          <RemoveButton
            variation="base-plain"
            size="small"
            hideText
            onClick={this.onRemoveClick}
          >
            Remove
          </RemoveButton>
        </FormFieldsetHeader>
        <FormFieldsetBody>
          {this.renderContactSelectDropdown()}
          {this.renderForm()}
        </FormFieldsetBody>
      </FormFieldset>
    );
  }
}

ContactFormWrapper.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  availableContacts: PropTypes.array,
  contact: PropTypes.object,
  contactIndex: PropTypes.number,
  onRemoveClick: PropTypes.func,
  onFormSubmit: PropTypes.func,
  onTypeChange: PropTypes.func,
  onCreateSelect: PropTypes.func,
  onSelectChange: PropTypes.func
};

export default ContactFormWrapper;

const DropdownIndicator = () => <MagnifierIcon />;
