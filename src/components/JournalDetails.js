import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateAtbdVersion } from '../actions/actions';

import FreeEditor from './FreeEditor';
import { Inpage } from './common/Inpage';
import InfoButton from './common/InfoButton';
import EditPage, { getAtbdStep } from './common/EditPage';
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

export function JournalDetails(props) {
  const {
    atbd,
    atbd_version,
    discussion,
    acknowledgements,
    updateAtbdVersion: update,
    t
  } = props;

  const {
    atbd_id,
    title,
    alias
  } = atbd;

  const { step, stepNum } = getAtbdStep('journal_details');
  return (
    <Inpage>
      <EditPage
        title={title || ''}
        id={atbd_id}
        alias={alias}
        step={stepNum}
      >
        <h2>{step.display}</h2>

        <p>The journal details will only be included in the Journal PDF export.</p>

        <Form>
          <FormFieldset>
            <FormFieldsetHeader>
              <FormLegend>Discussion</FormLegend>
            </FormFieldsetHeader>
            <FormFieldsetBody>
              <FormGroup>
                <FormGroupHeader>
                  <FormLabel>List discussion points</FormLabel>
                  <FormToolbar>
                    <InfoButton text={t.discussion} />
                  </FormToolbar>
                </FormGroupHeader>
                <FormGroupBody>
                  <FreeEditor
                    initialValue={discussion}
                    save={(document) => {
                      update(atbd_id, atbd_version, {
                        journal_discussion: document
                      });
                    }}
                  />
                </FormGroupBody>
              </FormGroup>
            </FormFieldsetBody>
          </FormFieldset>

          <FormFieldset>
            <FormFieldsetHeader>
              <FormLegend>Acknowledgements</FormLegend>
            </FormFieldsetHeader>
            <FormFieldsetBody>
              <FormGroup>
                <FormGroupHeader>
                  <FormLabel>List of acknowledgements</FormLabel>
                  <FormToolbar>
                    <InfoButton text={t.acknowledgements} />
                  </FormToolbar>
                </FormGroupHeader>
                <FormGroupBody>
                  <FreeEditor
                    initialValue={acknowledgements}
                    save={(document) => {
                      update(atbd_id, atbd_version, {
                        journal_acknowledgements: document
                      });
                    }}
                  />
                </FormGroupBody>
              </FormGroup>
            </FormFieldsetBody>
          </FormFieldset>
        </Form>

      </EditPage>
    </Inpage>
  );
}

JournalDetails.propTypes = {
  atbd: PropTypes.object,
  atbd_version: PropTypes.number,
  discussion: PropTypes.object,
  acknowledgements: PropTypes.object,
  updateAtbdVersion: PropTypes.func.isRequired,
  t: PropTypes.object
};

const mapStateToProps = (state) => {
  const { application: app } = state;
  const atbdVersion = app.atbdVersion || {};
  const atbd = atbdVersion.atbd || {};
  return {
    atbd,
    atbd_version: atbdVersion.atbd_version,
    discussion: atbdVersion.journal_discussion,
    acknowledgements: atbdVersion.journal_acknowledgements,
    t: app.t ? app.t.journal_details : {}
  };
};

const mapDispatchToProps = { updateAtbdVersion };

export default connect(mapStateToProps, mapDispatchToProps)(JournalDetails);
