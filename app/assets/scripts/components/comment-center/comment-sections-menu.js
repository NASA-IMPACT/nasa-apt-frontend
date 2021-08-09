import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import DropdownMenu from '../common/dropdown-menu';

import { DOCUMENT_SECTIONS } from '../documents/single-edit/sections';
import { COMMENT_STATUSES } from './common';

const SectionsDropdownMenu = styled(DropdownMenu)`
  max-width: 18rem;
`;

const commentSectionMenu = [
  {
    id: 'status',
    selectable: true,
    items: COMMENT_STATUSES.map((s) => ({
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
        id: 'all-section',
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

  return (
    <SectionsDropdownMenu
      menu={commentSectionMenu}
      activeItem={activeItem}
      alignment='left'
      direction='down'
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
