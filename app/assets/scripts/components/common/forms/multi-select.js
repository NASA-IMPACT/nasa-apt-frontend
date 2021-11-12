import React, { useMemo } from 'react';
import T from 'prop-types';
import debounce from 'lodash.debounce';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';

import { selectComponents, SelectIconButton } from './select-combo';

// Components to override the react-select
/* eslint-disable react/prop-types */
const ClearIndicator = (props) => {
  const { className, innerProps } = props;
  return (
    <SelectIconButton
      useIcon='xmark--small'
      className={className}
      {...innerProps}
    >
      <span>Clear value</span>
    </SelectIconButton>
  );
};

const asyncSelectComponents = {
  ...selectComponents,
  ClearIndicator,
  IndicatorSeparator: components.IndicatorSeparator
};
/* eslint-enable react/prop-types */

const noOptionsMessage = ({ inputValue }) =>
  inputValue ? 'No options found.' : 'Start typing to search.';

export default function MultiSelect(props) {
  const { loadOptions, ...rest } = props;

  // Wraps the return of the option's loader in a option's group. This is needed
  // for the styles to be correctly applied, otherwise no wrapper would be
  // returned for the <li>.
  const optionsLoader = useMemo(() => {
    // To support debounce we need to use a callback style function
    const requester = (value, cb) => {
      loadOptions(value).then((options) =>
        cb([
          {
            label: 'options',
            options
          }
        ])
      );
    };
    return debounce(requester, 500);
  }, [loadOptions]);

  return (
    <AsyncSelect
      isMulti
      noOptionsMessage={noOptionsMessage}
      loadOptions={optionsLoader}
      components={asyncSelectComponents}
      {...rest}
    />
  );
}

MultiSelect.propTypes = {
  loadOptions: T.func
};
