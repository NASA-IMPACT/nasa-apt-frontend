import React, { useMemo } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import Select, { createFilter, components } from 'react-select';
import { DropMenu } from '@devseed-ui/dropdown';
import { glsp, themeVal, rgba } from '@devseed-ui/theme-provider';
import { controlSkin } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';

import { DropMenuItemEnhanced } from '../dropdown-menu';

// Note:
// The select combo is a highly specialized and customized version on
// react-select. It is used to display a create new option alongside the input
// options. The create new option is sticky and will always be present at the
// top of the dropdown menu.

export const SELECT_COMBO_NEW = { value: 'new', label: 'Create new' };

const groupedOptions = [
  {
    label: 'actions',
    options: [SELECT_COMBO_NEW]
  }
];

const DropContentMenu = styled.div`
  background: #fff;
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaC')},
    0 0 32px 2px ${themeVal('color.baseAlphaC')},
    0 16px 48px -16px ${rgba(themeVal('color.base'), 0.16)};
  position: absolute;
  width: 100%;
  z-index: 1000;
  padding: ${glsp()};
  margin-top: ${glsp(0.5)};
  text-align: left;
  color: ${themeVal('type.base.color')};
  font-size: 1rem;
  line-height: 1.5;
  max-height: 20rem;
  overflow-y: auto;
`;

const DropMenuList = styled(DropMenu)`
  ${({ isActions }) =>
    isActions &&
    css`
      position: sticky;
      top: ${glsp(-1)};
      background: ${themeVal('color.surface')};
      z-index: 10;
    `}
`;

const SelectInput = styled.div`
  ${controlSkin()}

  ${({ isFocused }) =>
    isFocused &&
    css`
      && {
        border-color: ${rgba(themeVal('color.base'), 0.64)};
      }
    `}

  .react-select__value-container {
    cursor: text;
    padding: ${glsp(0, 0.5)};
  }
`;

export const SelectIconButton = styled(Button).attrs({
  variation: 'base-plain',
  hideText: true,
  size: 'small'
})`
  /* styled-component */
`;

// Components to override the react-select
/* eslint-disable react/prop-types */
const Menu = (props) => {
  const { children, className, innerRef, innerProps } = props;
  return (
    <div className={className} ref={innerRef} {...innerProps}>
      {children}
    </div>
  );
};

const MenuList = (props) => {
  const { children, className, innerRef, innerProps } = props;
  return (
    <DropContentMenu className={className} ref={innerRef} {...innerProps}>
      {children}
    </DropContentMenu>
  );
};

const Group = (props) => {
  const { children, className, innerProps, data } = props;
  return (
    <DropMenuList
      className={className}
      {...innerProps}
      selectable
      isActions={data.label === 'actions'}
    >
      {children}
    </DropMenuList>
  );
};

const Option = (props) => {
  const {
    children,
    className,
    innerRef,
    innerProps,
    isSelected,
    isFocused,
    isDisabled
  } = props;
  return (
    <li className={className} ref={innerRef} {...innerProps}>
      <DropMenuItemEnhanced
        active={isSelected}
        focused={isFocused}
        disabled={isDisabled}
      >
        {children}
      </DropMenuItemEnhanced>
    </li>
  );
};

const Control = (props) => {
  const { children, className, innerRef, innerProps, isFocused } = props;
  return (
    <SelectInput
      className={className}
      ref={innerRef}
      {...innerProps}
      isFocused={isFocused}
      useIcon={['chevron-down--small', 'after']}
    >
      {children}
    </SelectInput>
  );
};

const IndicatorsContainerStyled = styled(components.IndicatorsContainer)`
  margin-right: ${glsp(0.5)};
  gap: ${glsp(0.25)};
`;

const IndicatorsContainer = (props) => {
  // Remove the react-select theme from props so it doesn't conflict with the
  // theme from styled-components.
  /* eslint-disable-next-line no-unused-vars */
  const { theme, ...rest } = props;
  return <IndicatorsContainerStyled {...rest} />;
};

const IndicatorSeparator = () => null;

const DropdownIndicator = (props) => {
  const { className } = props;
  return (
    <SelectIconButton className={className} useIcon='chevron-down--small'>
      <span>Open</span>
    </SelectIconButton>
  );
};

export const selectComponents = {
  Menu,
  MenuList,
  Group,
  Option,
  Control,
  IndicatorsContainer,
  IndicatorSeparator,
  DropdownIndicator
};
/* eslint-enable react/prop-types */

const filterOptions = (candidate, input) => {
  return candidate.value === 'new' || createFilter()(candidate, input);
};

export default function SelectCombo(props) {
  const { options, ...rest } = props;

  const selectOptions = useMemo(() => {
    return options?.length
      ? [
          ...groupedOptions,
          {
            label: 'options',
            options
          }
        ]
      : groupedOptions;
  }, [options]);

  return (
    <Select
      className='react-select-container'
      classNamePrefix='react-select'
      options={selectOptions}
      filterOption={filterOptions}
      components={selectComponents}
      {...rest}
    />
  );
}

SelectCombo.propTypes = {
  options: T.array
};
