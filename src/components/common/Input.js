import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import collecticon from '../../styles/collecticons';
import { themeVal } from '../../styles/utils/general';
import { multiply } from '../../styles/utils/math';

import FormGroup from '../../styles/molecules/form/group';
import FormToolbar from '../../styles/molecules/form/toolbar';
import FormLabel from '../../styles/atoms/form/label';
import FormHelp from '../../styles/atoms/form/help';
import Button from '../../styles/atoms/button';

export const InputLabelFeedback = styled.span`
  color: ${themeVal('color.danger')};
  font-weight: normal;
  margin-left: ${multiply(themeVal('layout.space'), 0.25)};
`;

export const InputFormGroup = styled.form`
  display: grid;
  align-items: start;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${themeVal('layout.space')};
  justify-content: space-between;
`;

const InlineInput = styled.input`
  background: #FFF;
  border: 1px solid ${themeVal('color.gray')};
  border-radius: 4px;
  font-family: inherit;
  height: ${multiply(themeVal('layout.space'), 2.4)}
  padding: 0 ${multiply(themeVal('layout.space'), 0.5)};
  width: 100%;
`;

export const InputSubmit = styled(InlineInput)`
  box-shadow: ${themeVal('boxShadow.input')};
  font-weight: bold;
`;

export const SmallTextInput = styled(InlineInput)`
`;

const InfoButton = styled(Button)`
  ::before {
    ${collecticon('circle-information')}
  }
`;

const Input = (props) => {
  const {
    error,
    touched,
    label,
    name,
    ...inputProps
  } = props;

  let feedback = null;
  if (Boolean(error) && touched) {
    feedback = error;
  }
  return (
    <FormGroup>
      <FormLabel>{label}</FormLabel>
      <FormToolbar>
        <InfoButton
          variation="base-plain"
          size="small"
          hideText
          data-tip="Lorem ipsum dolor sit amet."
        >
          Learn more
        </InfoButton>
        <ReactTooltip effect="solid" className="type-primary" />
      </FormToolbar>
      <SmallTextInput
        id={name}
        name={name}
        {...inputProps}
      />
      <FormHelp>{feedback}</FormHelp>
    </FormGroup>
  );
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool
};

export default Input;
