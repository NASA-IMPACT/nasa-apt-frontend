import React, { useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { truncated } from '@devseed-ui/theme-provider';

import DropdownMenu from '../common/dropdown-menu';

import { DOCUMENT_SECTIONS } from '../documents/single-edit/sections';
import { THREAD_SECTION_ALL, THREAD_STATUSES } from './common';

const SectionsDropdownMenu = styled(DropdownMenu)`
  max-width: 18rem;
`;

const SectionTrigger = styled(Button)`
  max-width: 100%;
  display: flex;

  span {
    ${truncated()}
  }
`;

const commentSectionMenu = [
  {
    id: 'status',
    selectable: true,
    items: THREAD_STATUSES.map((s) => ({
      ...s,
      title: `View ${s.label} comments`,
      keepOpen: true
    }))
  },
  {
    id: 'section',
    selectable: true,
    items: [
      {
        id: THREAD_SECTION_ALL,
        label: 'All',
        title: 'View all threads',
        keepOpen: true
      },
      ...DOCUMENT_SECTIONS.map((s) => ({
        ...s,
        title: `View comment threads for section ${s.label}`,
        keepOpen: true
      }))
    ]
  }
];

function CommentSectionsMenu(props) {
  const { activeItem, onSelect } = props;

  const triggerProps = useMemo(
    () => ({ size: 'small', as: SectionTrigger }),
    []
  );

  return (
    <SectionsDropdownMenu
      menu={commentSectionMenu}
      activeItem={activeItem}
      alignment='left'
      direction='down'
      triggerProps={triggerProps}
      withChevron
      dropTitle='Options'
      onSelect={onSelect}
    />
  );
}

CommentSectionsMenu.propTypes = {
  activeItem: T.array,
  onSelect: T.func
};

export default CommentSectionsMenu;
