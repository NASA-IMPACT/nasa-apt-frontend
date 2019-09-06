import React from 'react';
import PropTypes from 'prop-types';

import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody
} from '../../styles/form/group';
import FormToolbar from '../../styles/form/toolbar';
import InfoButton from './InfoButton';
import FormLabel from '../../styles/form/label';
import {
  FormHelper,
  FormHelperMessage
} from '../../styles/form/helper';
import InlineFreeEditor from '../InlineFreeEditor';


const InputEditor = (props) => {
  const {
    error,
    touched,
    label,
    info,
    id,
    optional,
    value,
    onChange
  } = props;

  let feedback = null;
  if (Boolean(error) && touched) {
    feedback = error;
  }
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
        <InlineFreeEditor
          id={id}
          value={value}
          onChange={onChange}
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

InputEditor.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func,
  error: PropTypes.string,
  touched: PropTypes.bool,
  info: PropTypes.string,
  id: PropTypes.string,
  optional: PropTypes.bool
};

export default InputEditor;
