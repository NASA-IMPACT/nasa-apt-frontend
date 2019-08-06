import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ContactFormWrapper from './ContactFormWrapper';
import { Inpage } from '../common/Inpage';
import EditPage from '../common/EditPage';
import AddBtn from '../../styles/button/add';

import {
  createAtbdContact,
  createContact,
  updateContact,
  createAtbdContactGroup,
  createContactGroup,
  updateContactGroup,
  deleteAtbdContact,
  deleteAtbdContactGroup
} from '../../actions/actions';
import { confirmRemoveContact } from '../common/ConfirmationPrompt';

const initStateContact = (atbd_id, arr) => arr.map(v => ({ ...v, __action: 'editing', atbd_id }));

class Contacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: null
    };

    this.addContact = this.addContact.bind(this);

    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onCreateSelect = this.onCreateSelect.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Dev notes:
    // The order in which the contacts are displayed in the form may not reflect
    // their order in the ATBD and there's no way to enforce it.
    // The order will persist while the contacts are being added, but a new data
    // fetch will result in the contacts being displayed in the order they
    // come from the api.
    // The form allows users to add person contacts and group contacts through
    // the same interface, but they're stored in different lists, so whenever
    // there's a fresh render the groups are always displayed last.
    // The checking of `stateContacts === null` is also related to the contact
    // order. The contacts get added and removed from the `selectedAtbd` through
    // the reducer when a corresponding action gets fired. Because of it, the
    // `selectedAtbd` value would change and the display order with it making
    // the experience confusing for the user. By checking if the contact state
    // was initialized we ensure that this code only fires once, as soon as
    // there's data.
    const { selectedAtbd } = this.props;
    const { contacts: stateContacts } = this.state;
    if (stateContacts === null && selectedAtbd !== nextProps.selectedAtbd && nextProps.selectedAtbd) {
      const { atbd_id, contacts, contact_groups } = nextProps.selectedAtbd;
      this.setState({
        contacts: [
          ...initStateContact(atbd_id, contacts),
          ...initStateContact(atbd_id, contact_groups)
        ]
      });
    }
  }

  addContact() {
    const { contacts } = this.state;
    const next = contacts.concat([
      {
        __action: 'selecting'
      }
    ]);
    this.setState({ contacts: next });
  }

  // Triggered when the create new contact option is selected from the dropdown.
  onCreateSelect(idx) {
    const { contacts } = this.state;
    const next = [...contacts];
    next.splice(idx, 1);
    this.setState({
      contacts: Object.assign([], contacts, {
        [idx]: {
          __action: 'creating',
          isGroup: false
        }
      })
    });
  }

  async detachContact(contact) {
    const {
      deleteAtbdContact: deleteContact,
      deleteAtbdContactGroup: deleteContactGroup
    } = this.props;
    const {
      isGroup,
      displayName,
      atbd_id,
      contact_group_id,
      contact_id
    } = contact;
    const { result } = await confirmRemoveContact(
      displayName || 'New Contact',
      isGroup
    );

    if (!result) return false;
    if (atbd_id) {
      // Contact is attached. Detach.
      const deleteFn = isGroup ? deleteContactGroup : deleteContact;
      const id = isGroup ? contact_group_id : contact_id;
      const removeRes = await deleteFn(atbd_id, id);
      // Safety check. Toast is displayed through middleware.
      if (removeRes.type.endsWith('_FAIL')) return false;
    }
    return true;
  }

  async onRemoveClick(idx) {
    const { contacts } = this.state;
    const success = await this.detachContact(contacts[idx]);
    if (success) {
      const next = contacts.filter((d, i) => i !== idx);
      this.setState({ contacts: next });
    }
  }

  // Triggered when the option selected from the dropdown changes.
  // Used to select an existing contact from the list.
  async onSelectChange(idx, selectedContact) {
    const { contacts } = this.state;
    const { atbd_id } = contacts[idx];

    // If the current contact is attached to an ATBD we need to detach it
    // before continuing.
    if (atbd_id) {
      const success = await this.detachContact(contacts[idx]);
      if (!success) return;
    }

    this.setState({
      contacts: Object.assign([], contacts, {
        [idx]: {
          ...selectedContact,
          __action: 'editing'
        }
      })
    });
  }

  onTypeChange(idx, type) {
    const { contacts } = this.state;
    this.setState({
      contacts: Object.assign([], contacts, {
        [idx]: {
          ...contacts[idx],
          isGroup: type === 'group'
        }
      })
    });
  }

  async onFormSubmit(action, contactIdx, payload) {
    const {
      selectedAtbd,
      createContactGroup, // eslint-disable-line no-shadow
      createContact, // eslint-disable-line no-shadow
      updateContactGroup, // eslint-disable-line no-shadow
      updateContact, // eslint-disable-line no-shadow
      createAtbdContact: attachContact,
      createAtbdContactGroup: attachContactGroup
    } = this.props;

    const { contacts } = this.state;
    const { isGroup, contact_group_id, contact_id } = contacts[contactIdx];
    const isAttached = !!contacts[contactIdx].atbd_id;

    const getContactFromList = (res) => {
      const { allContactGroups, allContacts } = this.props;
      const contactList = isGroup ? allContactGroups : allContacts;
      const searchId = isGroup
        ? `g${res.payload.contact_group_id}`
        : `c${res.payload.contact_id}`;

      return contactList.find(o => o.id === searchId);
    };

    let createUpdateRes;
    if (action === 'creating') {
      // Create a wholly new contact or contact group.
      const saveFn = isGroup ? createContactGroup : createContact;
      createUpdateRes = await saveFn(payload);
    } else {
      // Patch the existing contact or contact group.
      const updateFn = isGroup ? updateContactGroup : updateContact;
      const id = isGroup ? contact_group_id : contact_id;
      createUpdateRes = await updateFn(id, payload);
    }

    // Safety check. Toast is displayed through middleware.
    if (createUpdateRes.type.endsWith('_FAIL')) return;
    const updatedContact = getContactFromList(createUpdateRes);
    // Get the newly created contact and update the state.
    // Get it from the props since it was normalized when going through
    // the reducer.
    this.setState(state => ({
      contacts: Object.assign([], state.contacts, {
        [contactIdx]: {
          ...state.contacts[contactIdx],
          ...updatedContact,
          __action: 'editing'
        }
      })
    }));

    // Only act if the contact was not attached.
    if (!isAttached) {
      // Attach it to the ATBD.
      const attachFn = updatedContact.isGroup
        ? attachContactGroup
        : attachContact;
      const { atbd_id } = selectedAtbd;
      const id = updatedContact.isGroup
        ? updatedContact.contact_group_id
        : updatedContact.contact_id;
      const attachRes = await attachFn({
        [updatedContact.isGroup ? 'contact_group_id' : 'contact_id']: id,
        atbd_id
      });

      // Safety check. Toast is displayed through middleware.
      if (attachRes.type.endsWith('_FAIL')) return;
      // Add atbd to contact so it is considered attached.
      this.setState(state => ({
        contacts: Object.assign([], state.contacts, {
          [contactIdx]: {
            ...state.contacts[contactIdx],
            atbd_id
          }
        })
      }));
    }
  }

  render() {
    const { allContacts, allContactGroups, selectedAtbd } = this.props;
    if (!selectedAtbd) return null;

    const { atbd_id, title } = selectedAtbd;
    const { contacts } = this.state;

    const availableContacts = [
      {
        label: 'Person',
        options: allContacts.filter(
          o => !contacts.find(c => c.id === o.id)
        )
      },
      {
        label: 'Group',
        options: allContactGroups.filter(
          o => !contacts.find(c => c.id === o.id)
        )
      }
    ];

    return (
      <Inpage>
        <EditPage title={title || ''} id={atbd_id} step={2}>
          <h2>Contacts</h2>
          {contacts.map((d, i) => (
            <ContactFormWrapper
              key={d.id || `new-${i}`}
              id={d.id}
              title={`Contact #${i + 1}`}
              contact={d}
              contactIndex={i}
              availableContacts={availableContacts}
              onRemoveClick={this.onRemoveClick}
              onCreateSelect={this.onCreateSelect}
              onSelectChange={this.onSelectChange}
              onTypeChange={this.onTypeChange}
              onFormSubmit={this.onFormSubmit}
            />
          ))}

          <AddBtn variation="base-plain" onClick={this.addContact}>
            Add a contact
          </AddBtn>
        </EditPage>
      </Inpage>
    );
  }
}

const contactShape = PropTypes.shape({
  contact_id: PropTypes.number.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired
});

Contacts.propTypes = {
  allContacts: PropTypes.arrayOf(contactShape),
  allContactGroups: PropTypes.array,
  selectedAtbd: PropTypes.shape({
    atbd_id: PropTypes.number.isRequired,
    contacts: PropTypes.array,
    contact_groups: PropTypes.array
  }),
  deleteAtbdContact: PropTypes.func,
  deleteAtbdContactGroup: PropTypes.func,
  createContactGroup: PropTypes.func,
  createContact: PropTypes.func,
  updateContactGroup: PropTypes.func,
  updateContact: PropTypes.func,
  createAtbdContact: PropTypes.func,
  createAtbdContactGroup: PropTypes.func
};

const mapStateToProps = state => ({
  allContacts: state.application.contacts || [],
  allContactGroups: state.application.contact_groups || [],
  selectedAtbd: state.application.selectedAtbd
});

const mapDispatch = {
  createAtbdContact,
  createContact,
  updateContact,
  createAtbdContactGroup,
  createContactGroup,
  updateContactGroup,
  deleteAtbdContact,
  deleteAtbdContactGroup
};

export default connect(
  mapStateToProps,
  mapDispatch
)(Contacts);
