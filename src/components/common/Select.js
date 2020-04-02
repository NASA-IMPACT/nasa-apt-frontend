import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import ReactSelect from 'react-select';
import { rgba } from 'polished';

import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../styles/form/group';
import FormToolbar from '../../styles/form/toolbar';
import FormLabel from '../../styles/form/label';
import {
  FormHelper,
  FormHelperMessage
} from '../../styles/form/helper';
import InfoButton from './InfoButton';
import theme from '../../styles/theme/theme';
import { themeVal, stylizeFunction } from '../../styles/utils/general';
import collecticon from '../../styles/collecticons';

const _rgba = stylizeFunction(rgba);

const ReactSelectStyled = styled(ReactSelect)`
  .react-select__control {
    height: 3rem;
  }

  .react-select__option {
    display: flex;
  }

  .react-select__option--is-selected {
    color: inherit;
    background: none;

    ::after {
      ${collecticon('tick--small')};
      margin-left: auto;
    }
  }

  .react-select__option--is-focused {
    background-color: ${_rgba(themeVal('color.link'), 0.12)};
  }
`;

const reactSelectContextStyles = (props) => {
  const { error, touched } = props;

  return {
    control: (provided, state) => {
      if (!!error && touched) {
        return {
          ...provided,
          borderColor: theme.main.color.danger,
          borderWidth: '2px'
        };
      }
      if (state.isFocused) {
        return {
          ...provided,
          borderColor: theme.main.color.primary
        };
      }
      return provided;
    }
  };
};

const Select = (props) => {
  const {
    error,
    touched,
    label,
    name,
    options,
    value,
    onChange,
    onBlur,
    info,
    id,
    readonly,
    optional
  } = props;

  let feedback = null;
  if (Boolean(error) && touched) {
    feedback = error;
  }
  const activeValue = options.find(d => d.value === value);

  return (
    <FormGroup>
      <FormGroupHeader>
        <FormLabel htmlFor={id} optional={optional}>{label}</FormLabel>
        {info && (
          <FormToolbar>
            <InfoButton text={info} />
          </FormToolbar>
        )}
      </FormGroupHeader>
      <FormGroupBody>
        <ReactSelectStyled
          classNamePrefix="react-select"
          styles={reactSelectContextStyles({ error, touched })}
          options={options}
          name={name}
          value={activeValue}
          onChange={onChange}
          onBlur={() => onBlur && onBlur(({ target: { name } }))}
          id={id}
          isDisabled={readonly}
        />
        {feedback && (
          <FormHelper>
            <FormHelperMessage>
              {feedback}
            </FormHelperMessage>
          </FormHelper>
        )}
      </FormGroupBody>
    </FormGroup>
  );
};

Select.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onBlur: PropTypes.func,
  info: PropTypes.string,
  id: PropTypes.string,
  readonly: PropTypes.bool,
  optional: PropTypes.bool
};
export default Select;
