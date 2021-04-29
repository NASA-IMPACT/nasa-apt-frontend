import React, { useMemo } from 'react';
import T from 'prop-types';

import {
  InpageHeadline,
  TruncatedInpageTitle,
  InpageMeta,
  InpageHeadNav,
  BreadcrumbMenu,
  InpageSubtitle
} from '../../styles/inpage';
import { useContextualAbility } from '../../a11n';
import { Link } from '../../styles/clean/link';
import DropdownMenu from '../common/dropdown-menu';

import { contactEdit, contactView } from '../../utils/url-creator';
import { useUser } from '../../context/user';

// Component with the Breadcrumb navigation header for a single ATBD.
export default function ContactNavHeader({ name, id, mode }) {
  const { isLogged } = useUser();
  const ability = useContextualAbility();

  const canEditContact = ability.can('edit', 'contact');

  const contactModesMenu = useMemo(() => {
    const viewContact = {
      id: 'view',
      label: 'Viewing',
      title: `Switch to viewing mode`,
      as: Link,
      to: contactView(id)
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
              to: contactEdit(id)
            }
          ]
        : [viewContact]
    };
  }, [id, canEditContact]);

  const dropdownMenuTriggerProps = useMemo(
    () => ({
      variation: 'achromic-plain'
    }),
    []
  );

  return (
    <>
      <InpageHeadline>
        <TruncatedInpageTitle>
          <Link to={contactView(id)} title='View contact'>
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
    </>
  );
}

ContactNavHeader.propTypes = {
  name: T.string,
  id: T.oneOfType([T.string, T.number]),
  mode: T.string
};
