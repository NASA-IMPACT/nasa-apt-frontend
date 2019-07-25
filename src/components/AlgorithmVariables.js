import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { Value } from 'slate';
import Html from 'slate-html-serializer';

import {
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody
} from '../styles/form/fieldset';
import {
  FormHelper,
  FormHelperMessage
} from '../styles/form/helper';
import FormLegend from '../styles/form/legend';
import RemoveButton from '../styles/button/remove';
import { InputFormGroup } from './common/Input';

// Convert the slate JSON value to html to be displayed.
// Only configured for the variables only only sub/sup is needed.
const rules = [
  {
    serialize(obj, children) {
      if (obj.object === 'block') {
        // This should be a one line editor. Any block will be a span.
        return <span>{children}</span>;
      }

      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'superscript':
            return <sup>{children}</sup>;
          case 'subscript':
            return <sub>{children}</sub>;
          default:
            return children;
        }
      }
    }
  }
];
const htmlSerializer = new Html({ rules });

const VariableList = styled.ul`
  list-style: none;
  margin: 1rem 0;
`;

const VariableListItem = styled.li`
  margin-bottom: 1rem;
  &&:last-child {
    margin-bottom: 0;
  }
`;

const InputProperty = styled.div`
  display: flex;
  
  strong {
    margin-right: 1rem;
  }
`;

const slateJSON2Html = (val) => {
  // Check if is JSON.
  try {
    const jsonVal = JSON.parse(val);
    if (jsonVal.document) {
      const slateVal = Value.fromJSON(jsonVal);
      return htmlSerializer.serialize(slateVal);
    }
  } catch (error) {
    // Not a json value.
  }
  return <span>{val}</span>;
};

const AlgorithmVariables = (props) => {
  const {
    schemaKey,
    variables,
    deleteVariable
  } = props;

  if (!variables.length) {
    return (
      <FormFieldset>
        <FormFieldsetBody>
          <FormHelper>
            <FormHelperMessage>No variables. Add one below.</FormHelperMessage>
          </FormHelper>
        </FormFieldsetBody>
      </FormFieldset>
    );
  }

  const variableItems = variables.map((variable, i) => {
    const {
      [`${schemaKey}_id`]: id,
      name,
      long_name,
      unit
    } = variable;

    return (
      <VariableListItem key={id}>
        <FormFieldset>
          <FormFieldsetHeader>
            <FormLegend>Variable #{i + 1}</FormLegend>
            <RemoveButton
              variation="base-plain"
              size="small"
              hideText
              onClick={() => deleteVariable(id)}
            >
              Remove
            </RemoveButton>
          </FormFieldsetHeader>
          <FormFieldsetBody>
            <InputFormGroup>
              <InputProperty>
                <strong>Name:</strong>
                <div dangerouslySetInnerHTML={{ __html: slateJSON2Html(name) }} />
              </InputProperty>
              <InputProperty>
                <strong>Long Name:</strong>
                <div dangerouslySetInnerHTML={{ __html: slateJSON2Html(long_name) }} />
              </InputProperty>
              <InputProperty>
                <strong>Unit:</strong>
                <div dangerouslySetInnerHTML={{ __html: slateJSON2Html(unit) }} />
              </InputProperty>
            </InputFormGroup>
          </FormFieldsetBody>
        </FormFieldset>
      </VariableListItem>
    );
  });

  return (
    <VariableList>
      {variableItems}
    </VariableList>
  );
};

AlgorithmVariables.propTypes = {
  schemaKey: PropTypes.string.isRequired,
  variables: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    long_name: PropTypes.string,
    unit: PropTypes.string
  })),
  deleteVariable: PropTypes.func.isRequired
};

export default AlgorithmVariables;
