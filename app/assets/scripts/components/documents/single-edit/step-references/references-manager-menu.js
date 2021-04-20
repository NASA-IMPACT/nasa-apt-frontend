import React, { useCallback, useMemo, useRef } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { DropMenuItem } from '@devseed-ui/dropdown';

import DropdownMenu from '../../../common/dropdown-menu';
import { FileInputElement } from './reference-creation-actions';
import Pill from '../../../common/pill';

const DeleteActionLabel = styled.span`
  width: 100%;
  display: flex;
  align-items: center;

  ${Pill} {
    margin-left: auto;
  }
`;

const dropdownMenuTriggerProps = {
  size: 'small',
  useIcon: ['chevron-down--small', 'after']
};

export default function ReferencesManagerMenu(props) {
  const { arrayHelpers, onSelect, refSelectedCount } = props;

  const dropdownRef = useRef(null);

  const referencesMenu = useMemo(
    () => [
      {
        id: 'actions',
        items: [
          {
            id: 'add',
            label: 'Add new',
            title: 'Add new reference',
            keepOpen: false
          },
          {
            id: 'import',
            keepOpen: true,
            render: ImportBibTeXMenuItem
          }
        ]
      },
      {
        id: 'actions2',
        items: [
          {
            id: 'delete',
            disabled: refSelectedCount === 0,
            label: (
              <DeleteActionLabel>
                Delete selected... <Pill>{refSelectedCount}</Pill>
              </DeleteActionLabel>
            ),
            title: 'Delete selected references',
            keepOpen: false
          }
        ]
      }
    ],
    [refSelectedCount]
  );

  const onMenuSelect = useCallback(
    (id, ...args) => {
      onSelect(arrayHelpers, id, ...args);
      // With the import action we have to close the dropdown programmatically
      // because if it gets closed before the user selects a file, the file
      // onChange event will not fire, since the input field will have been
      // unmounted.
      if (id === 'import') {
        dropdownRef.current.close();
      }
    },
    [onSelect, arrayHelpers]
  );

  return (
    <DropdownMenu
      ref={dropdownRef}
      menu={referencesMenu}
      triggerProps={dropdownMenuTriggerProps}
      triggerLabel='Actions'
      dropTitle='Options'
      onSelect={onMenuSelect}
    />
  );
}

ReferencesManagerMenu.propTypes = {
  arrayHelpers: T.object,
  onSelect: T.func,
  refSelectedCount: T.number
};

const ImportBibTeXMenuItem = ({ onSelect, menuItem, ...props }) => {
  return (
    <FileInputElement
      name='bibtex-file'
      onFileSelect={(f) => onSelect(menuItem.id, { ...menuItem, file: f })}
    >
      {(fieProps) => (
        <DropMenuItem {...props} {...fieProps} title='Import from file'>
          Import from BibTeX file...
        </DropMenuItem>
      )}
    </FileInputElement>
  );
};

ImportBibTeXMenuItem.propTypes = {
  onSelect: T.func,
  menuItem: T.object
};
