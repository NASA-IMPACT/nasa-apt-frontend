import React, { useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import {
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody,
  FormLegend
} from '@devseed-ui/form';
import { headingAlt } from '@devseed-ui/typography';
import { glsp } from '@devseed-ui/theme-provider';

import DropdownMenu from '../dropdown-menu';
import { useField } from 'formik';

const StatusAction = styled.div`
  display: flex;
  align-items: center;
`;

const StatusLabel = styled.p`
  ${headingAlt()}
  width: max-content;
  margin-right: ${glsp(0.5)};
`;

const SECTION_STATUS_MENU = {
  id: 'status',
  selectable: true,
  items: [
    {
      id: 'incomplete',
      label: 'Incomplete'
    },
    {
      id: 'complete',
      label: 'Complete'
    }
  ]
};

export const SECTION_STATUS_DEFAULT = SECTION_STATUS_MENU.items[0].id;

/**
 * Fieldset section with status dropdown
 *
 * @prop {string} label Label for the fieldset section
 * @prop {mixed} status Current section status
 * @prop {function} onStatusChange On change event handler for the status dropdown
 */
export function SectionFieldset(props) {
  const { children, label, status, onStatusChange } = props;

  const triggerProps = useMemo(() => ({ size: 'small' }), []);

  return (
    <FormFieldset>
      <FormFieldsetHeader>
        <FormLegend>{label}</FormLegend>
        {status && (
          <StatusAction>
            <StatusLabel>Marked as</StatusLabel>
            <DropdownMenu
              menu={SECTION_STATUS_MENU}
              activeItem={status}
              dropTitle='Section status'
              withChevron
              triggerProps={triggerProps}
              onSelect={onStatusChange}
            />
          </StatusAction>
        )}
      </FormFieldsetHeader>
      <FormFieldsetBody>{children}</FormFieldsetBody>
    </FormFieldset>
  );
}

SectionFieldset.propTypes = {
  children: T.node,
  label: T.string,
  status: T.string,
  onStatusChange: T.func
};

export function FormikSectionFieldset(props) {
  const { sectionName } = props;

  const [{ value }, , { setValue }] = useField(sectionName);

  return (
    <SectionFieldset
      {...props}
      status={value}
      onStatusChange={(val) => setValue(val)}
    />
  );
}

FormikSectionFieldset.propTypes = {
  children: T.node,
  label: T.string,
  sectionName: T.string
};
