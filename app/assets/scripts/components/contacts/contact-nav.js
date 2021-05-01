import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import { useHistory } from 'react-router';

import {
  InpageHeadline,
  TruncatedInpageTitle,
  InpageMeta,
  InpageHeadNav,
  InpageHeaderSticky,
  InpageActions,
  BreadcrumbMenu,
  InpageSubtitle
} from '../../styles/inpage';
import { useContextualAbility } from '../../a11n';
import { Link } from '../../styles/clean/link';
import DropdownMenu from '../common/dropdown-menu';
import { confirmDeleteContact } from '../common/confirmation-prompt';
import toasts from '../common/toasts';
import ContactActionsMenu from './contact-actions-menu';

import { contactEdit, contactView } from '../../utils/url-creator';
import { useUser } from '../../context/user';

// Component with the Breadcrumb navigation header for a single ATBD.
export default function ContactNav({ name, contactId, deleteContact, mode }) {
  const history = useHistory();

  const { isLogged } = useUser();
  const ability = useContextualAbility();

  const canEditContact = ability.can('edit', 'contact');

  const contactModesMenu = useMemo(() => {
    const viewContact = {
      id: 'view',
      label: 'Viewing',
      title: `Switch to viewing mode`,
      as: Link,
      to: contactView(contactId)
    };
    return {
      id: 'mode',
      selectable: true,
      items: canEditContact
        ? [
            viewContact,
            {
              id: 'edit',
              label: 'Editing',
              title: `Switch to editing mode`,
              as: Link,
              to: contactEdit(contactId)
            }
          ]
        : [viewContact]
    };
  }, [contactId, canEditContact]);

  const dropdownMenuTriggerProps = useMemo(
    () => ({
      variation: 'achromic-plain'
    }),
    []
  );

  const onContactMenuAction = useCallback(
    async (menuId) => {
      if (menuId === 'delete') {
        const { result: confirmed } = await confirmDeleteContact(
          `${contact.data?.first_name} ${contact.data?.last_name}`
        );

        if (confirmed) {
          const result = await deleteContact();
          if (result.error) {
            toasts.error(`An error occurred: ${result.error.message}`);
          } else {
            toasts.success('Contact successfully deleted');
            history.push('/contacts');
          }
        }
      }
    },
    [contactId, deleteContact, history]
  );

  return (
    <InpageHeaderSticky data-element='inpage-header'>
      <InpageHeadline>
        <TruncatedInpageTitle>
          <Link to={contactView(contactId)} title='View contact'>
            {name}
          </Link>
        </TruncatedInpageTitle>
        <InpageHeadNav role='navigation'>
          <BreadcrumbMenu>
            {isLogged && contactModesMenu.items.length > 1 && (
              <li>
                <DropdownMenu
                  alignment='left'
                  direction='down'
                  menu={contactModesMenu}
                  activeItem={mode}
                  triggerProps={dropdownMenuTriggerProps}
                  withChevron
                  dropTitle='Mode'
                />
              </li>
            )}
          </BreadcrumbMenu>
        </InpageHeadNav>
      </InpageHeadline>
      <InpageMeta>
        <dt>Under</dt>
        <InpageSubtitle as='dd'>
          <Link to='/contacts' title='View all Contacts'>
            Contact
          </Link>
        </InpageSubtitle>
      </InpageMeta>
      <InpageActions>
        <ContactActionsMenu
          contactId={contactId}
          variation='achromic-plain'
          onSelect={onContactMenuAction}
        />
      </InpageActions>
    </InpageHeaderSticky>
  );
}

ContactNav.propTypes = {
  name: T.string,
  contactId: T.oneOfType([T.string, T.number]),
  deleteContact: T.func,
  mode: T.string
};
