import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import deburr from 'lodash.deburr';
import debounce from 'lodash.debounce';

import { updateAtbd, fetchAtbdAliasCount } from '../actions/actions';

import CitationForm from './CitationForm';
import EditPage, { getAtbdStep } from './common/EditPage';
import { Inpage } from './common/Inpage';
import InfoButton from './common/InfoButton';
import Form from '../styles/form/form';
import FormToolbar from '../styles/form/toolbar';
import {
  FormGroup,
  FormGroupBody,
  FormGroupHeader
} from '../styles/form/group';
import {
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody
} from '../styles/form/fieldset';
import FormLegend from '../styles/form/legend';
import FormLabel from '../styles/form/label';
import FormInput from '../styles/form/input';
import { FormHelper, FormHelperMessage } from '../styles/form/helper';
import Button from '../styles/button/button';
import AddBtn from '../styles/button/add';
import SaveFormButton from '../styles/button/save-form';

const toAliasFormat = v => deburr(v).toLowerCase().replace(/[^a-z0-9-]/g, '-');

export class IdentifyingInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      alias: '',
      // Whether or not a request for the alias availability is happening.
      aliasAvailabilityCheck: false,

      // Hide the citation form by default,
      // as it's not required and also very long.
      showCitationForm: false
    };

    this.onTitleFieldChange = this.onTitleFieldChange.bind(this);
    this.onAliasFieldChange = this.onAliasFieldChange.bind(this);

    this.saveAtbd = this.saveAtbd.bind(this);
    this.toggleCitationForm = this.toggleCitationForm.bind(this);

    // Debounce the check for alias availability.
    this.checkAliasDebounced = debounce(this.checkAliasDebounced.bind(this), 1000);
  }

  componentWillReceiveProps(nextProps) {
    const { atbd } = nextProps;
    const { atbd: prevAtbd } = this.props;
    // New ATBD fetch
    if (atbd && atbd !== prevAtbd) {
      this.setState({
        title: atbd.title,
        alias: atbd.alias || ''
      });
    }
  }

  componentWillUnmount() {
    this.checkAliasDebounced.cancel();
  }

  async getValidAlias(alias) {
    const {
      fetchAtbdAliasCount: fetchCount,
      atbd: { atbd_id }
    } = this.props;
    // Check if the current url or similar exists.
    // If so append a number higher than the existent count.
    const { payload: { count } } = await fetchCount(atbd_id, alias);
    return count
      ? `${alias}-${count + 1}`
      : alias;
  }

  async checkAliasDebounced(alias) {
    this.setState({
      aliasAvailabilityCheck: true
    });
    const newAlias = await this.getValidAlias(alias);
    this.setState({
      alias: newAlias,
      aliasAvailabilityCheck: false
    });
  }

  onTitleFieldChange(e) {
    const { alias } = this.props.atbd;
    const { aliasTouched } = this.state;

    let updateState = {
      title: e.currentTarget.value,
      titleTouched: true
    };

    // If there's no alias defined, either by the atbd or by the user compute it
    // from the title.
    if (!alias && !aliasTouched) {
      const formattedAlias = toAliasFormat(e.currentTarget.value);
      updateState = {
        ...updateState,
        alias: formattedAlias
      };
      this.checkAliasDebounced(formattedAlias);
    }

    this.setState(updateState);
  }

  onAliasFieldChange(e) {
    const formattedAlias = toAliasFormat(e.currentTarget.value);
    this.setState({
      alias: formattedAlias,
      aliasTouched: true
    });
    this.checkAliasDebounced(formattedAlias);
  }

  async saveAtbd(e) {
    e.preventDefault();
    const {
      updateAtbd: update,
      atbd: { atbd_id }
    } = this.props;
    const { title, alias } = this.state;

    const newAlias = await this.getValidAlias(alias);
    this.setState({
      alias: newAlias,
      titleTouched: false,
      aliasTouched: false
    });
    const res = await update(atbd_id, { title, alias: newAlias });
    if (res.type.endsWith('_FAIL')) {
      this.setState({ titleTouched: true, aliasTouched: true });
    }
  }

  toggleCitationForm() {
    this.setState(state => ({
      showCitationForm: !state.showCitationForm
    }));
  }

  render() {
    const { atbd, hasCitation, t } = this.props;

    if (atbd) {
      const {
        title: atbdTitle,
        alias: atbdAlias,
        titleTouched,
        aliasTouched,
        aliasAvailabilityCheck,
        showCitationForm
      } = this.state;
      const { onTitleFieldChange, onAliasFieldChange, saveAtbd } = this;

      const { title, alias, atbd_id } = atbd;

      const { step, stepNum } = getAtbdStep('identifying_information');
      return (
        <Inpage>
          <EditPage
            title={title || ''}
            id={atbd_id}
            alias={alias}
            step={stepNum}
          >
            <h2>{step.display}</h2>

            <Form>
              <FormFieldset>
                <FormFieldsetHeader>
                  <FormLegend>General</FormLegend>
                </FormFieldsetHeader>
                <FormFieldsetBody>
                  <FormGroup>
                    <FormGroupHeader>
                      <FormLabel htmlFor="atbd-title">Title</FormLabel>
                      <FormToolbar>
                        <InfoButton text={t.title} />
                      </FormToolbar>
                    </FormGroupHeader>
                    <FormGroupBody>
                      <FormInput
                        type="text"
                        size="large"
                        id="atbd-title"
                        placeholder="Enter a title"
                        value={atbdTitle}
                        onChange={onTitleFieldChange}
                        onBlur={onTitleFieldChange}
                        invalid={titleTouched && atbdTitle === ''}
                      />
                      {titleTouched && atbdTitle === '' && (
                        <FormHelper>
                          <FormHelperMessage>
                            Please enter a title.
                          </FormHelperMessage>
                        </FormHelper>
                      )}
                    </FormGroupBody>
                  </FormGroup>

                  <FormGroup>
                    <FormGroupHeader>
                      <FormLabel htmlFor="atbd-alias">Alias</FormLabel>
                      <FormToolbar>
                        <InfoButton text={t.alias} />
                      </FormToolbar>
                    </FormGroupHeader>
                    <FormGroupBody>
                      <FormInput
                        type="text"
                        size="large"
                        id="atbd-alias"
                        placeholder="Enter an alias"
                        value={atbdAlias}
                        onChange={onAliasFieldChange}
                        onBlur={onAliasFieldChange}
                        invalid={aliasTouched && atbdAlias === ''}
                      />
                      <FormHelper>
                        <div>
                          {alias && (
                            <FormHelperMessage>
                              <strong>Changing the alias of an existing ATBD may result in broken links.</strong>
                            </FormHelperMessage>
                          )}
                          <FormHelperMessage>
                            Only alphanumeric characters and dashes are allowed.
                          </FormHelperMessage>
                          {aliasTouched && atbdAlias === '' && (
                            <FormHelperMessage>
                              Please enter an alias.
                            </FormHelperMessage>
                          )}
                        </div>
                        {aliasAvailabilityCheck && (
                          <FormHelperMessage>
                            Checking if alias is available.
                          </FormHelperMessage>
                        )}
                      </FormHelper>
                    </FormGroupBody>
                  </FormGroup>

                  <SaveFormButton
                    onClick={saveAtbd}
                    disabled={(!titleTouched || atbdTitle === '') && (!aliasTouched || atbdAlias === '')}
                  >
                    Save
                  </SaveFormButton>
                </FormFieldsetBody>
              </FormFieldset>
            </Form>

            <FormFieldset>
              <FormFieldsetHeader>
                <FormLegend>Citation</FormLegend>
              </FormFieldsetHeader>
              <FormFieldsetBody>
                {showCitationForm ? (
                  <CitationForm />
                ) : hasCitation ? (
                  <Button
                    variation="base-raised-light"
                    size="large"
                    onClick={this.toggleCitationForm}
                  >
                    Update citation
                  </Button>
                ) : (
                  <AddBtn
                    variation="base-raised-light"
                    size="large"
                    onClick={this.toggleCitationForm}
                  >
                    Add a citation
                  </AddBtn>
                )}
              </FormFieldsetBody>
            </FormFieldset>
          </EditPage>
        </Inpage>
      );
    }
    return null;
  }
}

IdentifyingInformation.propTypes = {
  updateAtbd: PropTypes.func,
  fetchAtbdAliasCount: PropTypes.func,
  atbd: PropTypes.object,
  t: PropTypes.object,
  hasCitation: PropTypes.bool
};

const mapStateToProps = (state) => {
  const { application: app } = state;
  const { atbdVersion, atbdCitation, t } = app;
  const atbd = atbdVersion ? atbdVersion.atbd : null;
  return {
    atbd,
    hasCitation: Boolean(atbdCitation),
    t: t ? t.identifying_information : {}
  };
};

const mapDispatch = {
  updateAtbd,
  fetchAtbdAliasCount
};

export default connect(mapStateToProps, mapDispatch)(IdentifyingInformation);
