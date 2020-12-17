import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  updateAtbdVersion,
  createAlgorithmInputVariable,
  createAlgorithmOutputVariable,
  deleteAlgorithmInputVariable,
  deleteAlgorithmOutputVariable
} from '../actions/actions';
import FreeEditor from './FreeEditor';
import AlgorithmVariables from './AlgorithmVariables';
import AlgorithmVariableForm from './AlgorithmVariableForm';
import { Inpage } from './common/Inpage';
import EditPage, { getAtbdStep } from './common/EditPage';
import InfoButton from './common/InfoButton';
import Form from '../styles/form/form';
import FormToolbar from '../styles/form/toolbar';
import {
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody
} from '../styles/form/fieldset';
import {
  FormGroup,
  FormGroupBody,
  FormGroupHeader
} from '../styles/form/group';
import FormLabel from '../styles/form/label';
import FormLegend from '../styles/form/legend';

export const AlgorithmDescription = (props) => {
  const {
    atbdVersion,
    updateAtbdVersion: update,
    createAlgorithmInputVariable: createInputVariable,
    createAlgorithmOutputVariable: createOutputVariable,
    deleteAlgorithmInputVariable: deleteInputVariable,
    deleteAlgorithmOutputVariable: deleteOutputVariable,
    t
  } = props;

  if (atbdVersion) {
    const {
      atbd,
      atbd_id,
      atbd_version,
      algorithm_input_variables = [],
      algorithm_output_variables = []
    } = atbdVersion;

    const {
      scientific_theory,
      scientific_theory_assumptions,
      mathematical_theory,
      mathematical_theory_assumptions
    } = atbdVersion;
    const title = atbd && atbd.title;

    const { step, stepNum } = getAtbdStep('algorithm_description');
    return (
      <Inpage>
        <EditPage
          title={title || ''}
          id={atbd_id}
          alias={atbd.alias}
          step={stepNum}
        >
          <h2>{step.display}</h2>
          <Form>
            <FormFieldset>
              <FormFieldsetHeader>
                <FormLegend>Scientific theory</FormLegend>
              </FormFieldsetHeader>
              <FormFieldsetBody>
                <FormGroup>
                  <FormGroupHeader>
                    <FormLabel>Describe the scientific theory</FormLabel>
                    <FormToolbar>
                      <InfoButton text={t.scientific_theory} />
                    </FormToolbar>
                  </FormGroupHeader>
                  <FormGroupBody>
                    <FreeEditor
                      initialValue={scientific_theory}
                      save={(document) => {
                        update(atbd_id, atbd_version, {
                          scientific_theory: document
                        });
                      }}
                    />
                  </FormGroupBody>
                </FormGroup>

                <FormGroup>
                  <FormGroupHeader>
                    <FormLabel>Scientific theory assumptions</FormLabel>
                    <FormToolbar>
                      <InfoButton text={t.scientific_theory_assumptions} />
                    </FormToolbar>
                  </FormGroupHeader>
                  <FormGroupBody>
                    <FreeEditor
                      initialValue={scientific_theory_assumptions}
                      save={(document) => {
                        update(atbd_id, atbd_version, {
                          scientific_theory_assumptions: document
                        });
                      }}
                    />
                  </FormGroupBody>
                </FormGroup>
              </FormFieldsetBody>
            </FormFieldset>

            <FormFieldset>
              <FormFieldsetHeader>
                <FormLegend>Mathematical theory</FormLegend>
              </FormFieldsetHeader>
              <FormFieldsetBody>
                <FormGroup>
                  <FormGroupHeader>
                    <FormLabel>Describe the mathematical theory</FormLabel>
                    <FormToolbar>
                      <InfoButton text={t.mathematical_theory} />
                    </FormToolbar>
                  </FormGroupHeader>
                  <FormGroupBody>
                    <FreeEditor
                      initialValue={mathematical_theory}
                      save={(document) => {
                        update(atbd_id, atbd_version, {
                          mathematical_theory: document
                        });
                      }}
                    />
                  </FormGroupBody>
                </FormGroup>

                <FormGroup>
                  <FormGroupHeader>
                    <FormLabel>Mathematical theory assumptions</FormLabel>
                    <FormToolbar>
                      <InfoButton text={t.mathematical_theory_assumptions} />
                    </FormToolbar>
                  </FormGroupHeader>
                  <FormGroupBody>
                    <FreeEditor
                      initialValue={mathematical_theory_assumptions}
                      save={(document) => {
                        update(atbd_id, atbd_version, {
                          mathematical_theory_assumptions: document
                        });
                      }}
                    />
                  </FormGroupBody>
                </FormGroup>
              </FormFieldsetBody>
            </FormFieldset>
          </Form>

          <FormFieldset>
            <FormFieldsetHeader>
              <FormLegend>Input Variables</FormLegend>
            </FormFieldsetHeader>
            <FormFieldsetBody>
              <FormGroupHeader>
                <FormLabel>Existing input variables</FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <AlgorithmVariables
                  schemaKey="algorithm_input_variable"
                  variables={algorithm_input_variables}
                  deleteVariable={deleteInputVariable}
                />
              </FormGroupBody>

              <FormGroupHeader>
                <FormLabel>Add an input variable</FormLabel>
              </FormGroupHeader>

              <FormGroupBody>
                <FormFieldset>
                  <FormFieldsetHeader>
                    <FormLegend>New input variable</FormLegend>
                  </FormFieldsetHeader>
                  <FormFieldsetBody>
                    <AlgorithmVariableForm
                      schemaKey="algorithm_input_variable"
                      atbd_id={atbd_id}
                      atbd_version={atbd_version}
                      create={(data) => { createInputVariable(data); }}
                      t={{
                        name: t.input_variable_name,
                        long_name: t.input_variable_long_name,
                        unit: t.input_variable_unit
                      }}
                    />
                  </FormFieldsetBody>
                </FormFieldset>
              </FormGroupBody>

            </FormFieldsetBody>
          </FormFieldset>

          <FormFieldset>
            <FormFieldsetHeader>
              <FormLegend>Output variables</FormLegend>
            </FormFieldsetHeader>
            <FormFieldsetBody>
              <FormGroupHeader>
                <FormLabel>Existing output variables</FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <AlgorithmVariables
                  schemaKey="algorithm_output_variable"
                  variables={algorithm_output_variables}
                  deleteVariable={deleteOutputVariable}
                />
              </FormGroupBody>
              <FormGroupHeader>
                <FormLabel>Add an output variable</FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <FormFieldset>
                  <FormFieldsetHeader>
                    <FormLegend>New output variable</FormLegend>
                  </FormFieldsetHeader>
                  <FormFieldsetBody>
                    <FormGroupHeader>
                      <FormLabel>Add an output variable</FormLabel>
                    </FormGroupHeader>
                    <AlgorithmVariableForm
                      schemaKey="algorithm_output_variable"
                      atbd_id={atbd_id}
                      atbd_version={atbd_version}
                      create={(data) => { createOutputVariable(data); }}
                      t={{
                        name: t.output_variable_name,
                        long_name: t.output_variable_long_name,
                        unit: t.output_variable_unit
                      }}
                    />
                  </FormFieldsetBody>
                </FormFieldset>
              </FormGroupBody>
            </FormFieldsetBody>
          </FormFieldset>

        </EditPage>
      </Inpage>
    );
  }
  return null;
};

AlgorithmDescription.propTypes = {
  atbdVersion: PropTypes.object,
  updateAtbdVersion: PropTypes.func.isRequired,
  createAlgorithmInputVariable: PropTypes.func.isRequired,
  createAlgorithmOutputVariable: PropTypes.func.isRequired,
  deleteAlgorithmInputVariable: PropTypes.func.isRequired,
  deleteAlgorithmOutputVariable: PropTypes.func.isRequired,
  t: PropTypes.object
};

const mapStateToProps = (state) => {
  const { atbdVersion, t } = state.application;
  return {
    atbdVersion,
    t: t ? t.algorithm_description : {}
  };
};

const mapDispatchToProps = {
  updateAtbdVersion,
  createAlgorithmInputVariable,
  createAlgorithmOutputVariable,
  deleteAlgorithmInputVariable,
  deleteAlgorithmOutputVariable
};

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmDescription);
