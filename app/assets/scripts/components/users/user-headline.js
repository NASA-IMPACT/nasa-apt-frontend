import React, { useMemo } from 'react';
import T from 'prop-types';

import {
  InpageHeadline,
  InpageHeadHgroup,
  TruncatedInpageTitle,
  InpageHeadNav,
  BreadcrumbMenu
} from '../../styles/inpage';
import { Link } from '../../styles/clean/link';
import DropdownMenu from '../common/dropdown-menu';

// Component with the Breadcrumb navigation header for a single contact.
export default function UserHeadline({ name, mode }) {
  const userModesMenu = useMemo(() => {
    return {
      id: 'mode',
      selectable: true,
      items: [
        {
          id: 'view',
          label: 'Viewing',
          title: `Switch to profile`,
          as: Link,
          to: '/account'
        },
        {
          id: 'edit',
          label: 'Editing',
          title: `Switch to editing mode`,
          as: Link,
          to: '/account/edit'
        }
      ]
    };
  }, []);

  const dropdownMenuTriggerProps = useMemo(
    () => ({
      variation: 'achromic-plain'
    }),
    []
  );

  return (
    <React.Fragment>
      <InpageHeadline>
        <InpageHeadHgroup>
          <TruncatedInpageTitle>
            <Link to='/account' title='View contact'>
              {name}
            </Link>
          </TruncatedInpageTitle>
          <InpageHeadNav role='navigation'>
            <BreadcrumbMenu>
              <li>
                <DropdownMenu
                  alignment='left'
                  direction='down'
                  menu={userModesMenu}
                  activeItem={mode}
                  triggerProps={dropdownMenuTriggerProps}
                  withChevron
                  dropTitle='Mode'
                />
              </li>
            </BreadcrumbMenu>
          </InpageHeadNav>
        </InpageHeadHgroup>
      </InpageHeadline>
    </React.Fragment>
  );
}

UserHeadline.propTypes = {
  name: T.string,
  mode: T.string
};
