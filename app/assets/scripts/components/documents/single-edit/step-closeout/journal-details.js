import React from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FieldArray, useFormikContext, useField } from 'formik';
import {
  FormCheckableGroup,
  FormFieldsetBody,
  FormHelperMessage,
  FormHelperCounter,
  FormFieldset,
  FormFieldsetHeader,
  FormLegend
} from '@devseed-ui/form';
import { Toolbar } from '@devseed-ui/toolbar';

import { DocInfoList } from '../../../../styles/documents/doc-info';
import { FormBlockHeading } from '../../../../styles/form-block';
import { FormikInputText } from '../../../common/forms/input-text';
import { FormikInputEditor } from '../../../common/forms/input-editor';
import { FormikInputTextarea } from '../../../common/forms/input-textarea';
import { FormikSectionFieldset } from '../../../common/forms/section-fieldset';
import { FormikInputCheckable } from '../../../common/forms/input-checkable';
import FormGroupStructure from '../../../common/forms/form-group-structure';
import { FieldMultiItem } from '../../../common/forms/field-multi-item';
import { DeletableFieldset } from '../../../common/forms/deletable-fieldset';
import Prose from '../../../../styles/typography/prose';
import FormInfoTip from '../../../common/forms/form-info-tooltip';

import { formString } from '../../../../utils/strings';
import { getDocumentSectionLabel } from '../sections';
import {
  isJournalPublicationIntended,
  JOURNAL_NO_PUBLICATION,
  JOURNAL_PUBLISHED,
  JOURNAL_PUB_INTENDED,
  JOURNAL_SUBMITTED
} from '../../status';
import { getContactName } from '../../../contacts/contact-utils';

const DeletableFieldsetDiptych = styled(DeletableFieldset)`
  ${FormFieldsetBody} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const journalStatuses = [
  {
    value: JOURNAL_NO_PUBLICATION,
    label: 'Not to be published'
  },
  {
    value: JOURNAL_PUB_INTENDED,
    label: 'To be published'
  },
  {
    value: JOURNAL_SUBMITTED,
    label: 'Submitted'
  },
  {
    value: JOURNAL_PUBLISHED,
    label: 'Published'
  }
];

export default function JournalDetails(props) {
  const { atbd } = props;
  const { values, dirty } = useFormikContext();

  // Publication units is a meta information files. Calculated in the server,
  // contains the different values needed to calculate the PU.
  const { publication_units } = atbd;

  return (
    <React.Fragment>
      <FormBlockHeading>Journal details</FormBlockHeading>
      <FormGroupStructure
        label='Journal publication process'
        description={formString('closeout.journal_publication')}
      >
        <FormCheckableGroup>
          {journalStatuses.map((s) => (
            <FormikInputCheckable
              key={s.value}
              id={`journal_status-${s.value}`}
              name='journal_status'
              type='radio'
              value={s.value}
            >
              {s.label}
            </FormikInputCheckable>
          ))}
        </FormCheckableGroup>
      </FormGroupStructure>

      {isJournalPublicationIntended(values.journal_status) && (
        <React.Fragment>
          <FormikSectionFieldset
            label={getDocumentSectionLabel('discussion')}
            sectionName='sections_completed.discussion'
            commentSection='discussion'
          >
            <FormikInputEditor
              id='journal_discussion'
              name='document.journal_discussion'
              label='Significance Discussion'
              description={formString('closeout.discussion')}
            />
            <FormikInputEditor
              id='data_availability'
              name='document.data_availability'
              label='Open Research'
              description={formString('closeout.data_availability')}
            />
          </FormikSectionFieldset>

          <FormikSectionFieldset
            label={getDocumentSectionLabel('acknowledgements')}
            sectionName='sections_completed.acknowledgements'
            commentSection='acknowledgements'
          >
            <FormikInputEditor
              id='journal_acknowledgements'
              name='document.journal_acknowledgements'
              label='Acknowledgment List'
              description={formString('closeout.acknowledgements')}
            />
          </FormikSectionFieldset>

          <FormikSectionFieldset
            label={getDocumentSectionLabel('publication_checklist')}
            sectionName='sections_completed.publication_checklist'
            commentSection='publication_checklist'
          >
            <FieldKeyPoints />

            <FieldSuggestedReviewers />

            <FormikInputText
              id='publication_checklist-journal_editor'
              name='publication_checklist.journal_editor'
              label='Requested Journal Editor'
              description={formString('closeout.journal_editor')}
            />

            <FormFieldset>
              <FormFieldsetHeader>
                <FormLegend>Paper Length Details</FormLegend>
                <Toolbar size='small'>
                  <FormInfoTip
                    title="The paper length details are shown here for convenience, but
                they're always accessible through the Document Info modal."
                  />
                </Toolbar>
              </FormFieldsetHeader>
              <FormFieldsetBody>
                {dirty && (
                  <p>
                    The paper length is calculated when the document is saved.
                    Save the document to see updated values.
                  </p>
                )}
                <DocInfoList>
                  <dt>Words</dt>
                  <dd>{publication_units?.words || 0}</dd>
                  <dt>Images</dt>
                  <dd>{publication_units?.images || 0}</dd>
                  <dt>Tables</dt>
                  <dd>{publication_units?.tables || 0}</dd>
                </DocInfoList>
              </FormFieldsetBody>
            </FormFieldset>

            <FieldCorrespondingAuthor contacts={atbd.contacts_link} />

            <FormFieldset>
              <FormFieldsetHeader>
                <FormLegend>Review Author Roles</FormLegend>
              </FormFieldsetHeader>
              <FormFieldsetBody>
                <FormikInputCheckable
                  id='publication_checklist-review_roles'
                  name='publication_checklist.review_roles'
                  type='checkbox'
                  value={undefined}
                >
                  I have reviewed and agree with the Author list and associated
                  roles as stated in the{' '}
                  <Link
                    to='contacts'
                    title='View ATBD contacts'
                    target='_blank'
                  >
                    contacts
                  </Link>{' '}
                  step.
                </FormikInputCheckable>
              </FormFieldsetBody>
            </FormFieldset>

            <FormFieldset>
              <FormFieldsetHeader>
                <FormLegend>Primary Author Affirmations</FormLegend>
                <Toolbar size='small'>
                  <FormInfoTip
                    title={formString('closeout.author_affirmations')}
                  />
                </Toolbar>
              </FormFieldsetHeader>
              <FormFieldsetBody>
                <Prose>
                  <ul>
                    <li>
                      All authors have read and approved the paper and will be
                      informed about all reviews and revisions. It is expected
                      that authors will have: (1) made substantial contributions
                      to the conception or design of the work; or the
                      acquisition, analysis, or interpretation of data, or
                      creation of new software used in the work; or have drafted
                      the work or substantively revised it; (2) approved the
                      submitted version (and any substantially modified version
                      that involves the author’s contribution to the study); and
                      (3) agreed to be personally accountable for their own
                      contributions and for ensuring that questions related to
                      the accuracy or integrity of any part of the work, even
                      ones in which the author was not personally involved, are
                      appropriately investigated, resolved, and documented in
                      the literature. AGU will notify each co-author about a
                      submission and all revisions.
                    </li>
                    <li>
                      All author affiliations related to the work are indicated.
                    </li>
                    <li>
                      Any real or perceived conflicts of interest related to
                      this work are declared to the editors in the cover letter
                    </li>
                    <li>
                      Data and data products related to the paper will be
                      available upon publication in a repository practicing the
                      FAIR principles. AGU journals follow the guidelines for
                      Enabling FAIR data.
                    </li>
                    <li>
                      The paper is an original submission and not under active
                      consideration elsewhere. All papers are checked for
                      plagiarism. Papers with significant overlap will be
                      rejected or returned for correction.
                    </li>
                  </ul>
                </Prose>
                <FormikInputCheckable
                  id='publication_checklist-author_affirmations'
                  name='publication_checklist.author_affirmations'
                  type='checkbox'
                  value={undefined}
                >
                  I affirm that the above statements are correct and accurate.
                </FormikInputCheckable>
              </FormFieldsetBody>
            </FormFieldset>
          </FormikSectionFieldset>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

JournalDetails.propTypes = {
  atbd: T.shape({
    status: T.string,
    publication_units: T.object,
    contacts_link: T.array
  })
};

const MAX_KEY_POINTS_CHARS = 420;

function FieldKeyPoints() {
  const [{ value }] = useField('document.key_points');
  const trimmed = value.trim();

  return (
    <FormikInputTextarea
      id='key_points'
      name='document.key_points'
      label='Key Points'
      description={formString('closeout.key_points')}
      growWithContents
      helper={
        <React.Fragment>
          <FormHelperMessage>
            Provide the 3 key points of your research as presented in this ATBD.
            Each point is a short statement.
            <br />
            Key points will be shown on the submission PDF title page.
          </FormHelperMessage>
          <FormHelperCounter
            value={trimmed.length}
            max={MAX_KEY_POINTS_CHARS}
            warnAt={MAX_KEY_POINTS_CHARS - 15}
          />
        </React.Fragment>
      }
    />
  );
}

const suggestedReviewerEmptyValue = {
  name: '',
  email: ''
};

function FieldSuggestedReviewers() {
  return (
    <FieldArray
      name='publication_checklist.suggested_reviewers'
      render={({ remove, push, form, name }) => (
        <FieldMultiItem
          id={name}
          label='Potential Reviewers'
          description={formString('closeout.suggested_reviewers')}
          emptyMessage='There are no Potential Reviewers. You can start by adding one.'
          onAddClick={() => push(suggestedReviewerEmptyValue)}
        >
          {get(form.values, name).map((field, index) => (
            <DeletableFieldsetDiptych
              /* eslint-disable-next-line react/no-array-index-key */
              key={index}
              id={`${name}.${index}`}
              label={`Potential Reviewer #${index + 1}`}
              onDeleteClick={() => remove(index)}
            >
              <FormikInputText
                id={`${name}.${index}.name`}
                name={`${name}.${index}.name`}
                label='Name'
              />
              <FormikInputText
                id={`${name}.${index}.email`}
                name={`${name}.${index}.email`}
                label='Email'
              />
            </DeletableFieldsetDiptych>
          ))}
        </FieldMultiItem>
      )}
    />
  );
}

function FieldCorrespondingAuthor(props) {
  const { contacts } = props;

  const correspondingAuthors = contacts
    .filter((c) =>
      c.roles.find((r) => r.toLowerCase() === 'corresponding author')
    )
    .map((c) => c.contact);

  return (
    <FormFieldset>
      <FormFieldsetHeader>
        <FormLegend>Corresponding author</FormLegend>
        <Toolbar size='small'>
          <FormInfoTip title='Identify the author who will be the primary contact to interact with the journal staff throughout the publication process.' />
        </Toolbar>
      </FormFieldsetHeader>
      <FormFieldsetBody>
        {correspondingAuthors.length ? (
          correspondingAuthors.length === 1 ? (
            <p>
              The <em>Corresponding Author</em> for this document is{' '}
              <strong>{getContactName(correspondingAuthors[0])}</strong>.
            </p>
          ) : (
            <p>
              There are {correspondingAuthors.length}{' '}
              <em>Corresponding Authors</em> for this document:{' '}
              <strong>
                {correspondingAuthors.map(getContactName).join(', ')}
              </strong>
            </p>
          )
        ) : (
          <p>
            There is no contact with the <em>Corresponding Author</em> role.
          </p>
        )}
        <p>
          If needed, the roles can be updated through the{' '}
          <Link to='contacts' title='View ATBD contacts' target='_blank'>
            contacts
          </Link>{' '}
          step.
        </p>
      </FormFieldsetBody>
    </FormFieldset>
  );
}

FieldCorrespondingAuthor.propTypes = {
  contacts: T.array
};
