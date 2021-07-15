import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Form, FormTextarea } from '@devseed-ui/form';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';

import { TabContent, TabItem, TabsManager, TabsNav } from '../common/tabs';
import DetailsList from '../../styles/typography/details-list';
import Tip from '../common/tooltip';
import Prose from '../../styles/typography/prose';
import { Link } from '../../styles/clean/link';
import { CopyField } from '../common/copy-field';
import {
  FormikInputTextarea,
  InputTextarea
} from '../common/forms/input-textarea';
import Datetime from '../common/date';
import { Can } from '../../a11n';

import { documentEdit } from '../../utils/url-creator';
import { citationFields, createBibtexCitation } from './citation';
import { downloadTextFile } from '../../utils/download-text-file';

const TabsNavModal = styled(TabsNav)`
  margin: ${glsp(0, -2, 1, -2)};
  padding: ${glsp(0, 2)};
`;

const TabActions = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-gap: ${glsp()};

  > * {
    grid-row: 1;
  }
`;

const DocInfoList = styled(DetailsList)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${glsp(0, 1)};

  margin-bottom: ${glsp(-1)};

  dt {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  dd {
    margin-bottom: ${glsp()};
  }

  dt:nth-of-type(1),
  dt:nth-of-type(2),
  dt:nth-of-type(3) {
    grid-row: 1;
  }

  dt:nth-of-type(4),
  dt:nth-of-type(5),
  dt:nth-of-type(6) {
    grid-row: 3;
  }

  dd:nth-of-type(1),
  dd:nth-of-type(2),
  dd:nth-of-type(3) {
    grid-row: 2;
  }

  dd:nth-of-type(4),
  dd:nth-of-type(5),
  dd:nth-of-type(6) {
    grid-row: 5;
  }
`;

export default function DocumentInfoModal(props) {
  const { atbd, revealed, onClose, onSubmit } = props;
  return (
    <Modal
      id='modal'
      size='medium'
      revealed={revealed}
      onCloseClick={onClose}
      title='Document info'
      content={
        <TabsManager>
          <TabsNavModal>
            <TabItem label='General' tabId='general'>
              General
            </TabItem>
            <TabItem label='Citation' tabId='citation'>
              Citation
            </TabItem>
          </TabsNavModal>

          <TabGeneral atbd={atbd} onSubmit={onSubmit} />
          <TabCitation atbd={atbd} />
        </TabsManager>
      }
    />
  );
}

DocumentInfoModal.propTypes = {
  atbd: T.object,
  revealed: T.bool,
  onClose: T.func,
  onSubmit: T.func
};

function TabGeneral(props) {
  const { atbd, onSubmit } = props;

  const initialValues = useMemo(
    () => ({
      id: atbd.id,
      changelog: atbd.changelog || ''
    }),
    [atbd]
  );

  const createdAt = atbd.created_at ? new Date(atbd.created_at) : null;
  const updatedAt = atbd.last_updated_at
    ? new Date(atbd.last_updated_at)
    : null;

  return (
    <TabContent tabId='general'>
      <DocInfoList>
        <dt>Version</dt>
        <dd>{atbd.version}</dd>
        <dt>Created on</dt>
        <dd>{createdAt ? <Datetime date={createdAt} /> : 'n/a'}</dd>
        <dt>Created by</dt>
        <dd>Admin</dd>
        <dt>Status</dt>
        <dd>{atbd.status}</dd>
        <dt>Last update</dt>
        <dd>{updatedAt ? <Datetime date={updatedAt} /> : 'n/a'}</dd>
      </DocInfoList>

      <Can do='edit' on='document'>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form as={FormikForm}>
            <FormikInputTextarea
              id='changelog'
              name='changelog'
              label='Changelog'
              description='Use the changelog to register what changed in relation to the previous version.'
            />
            <TabActions>
              <SaveButton />
            </TabActions>
          </Form>
        </Formik>
      </Can>

      <Can not do='edit' on='document'>
        <InputTextarea
          id='changelog'
          name='changelog'
          label='Changelog'
          value={initialValues.changelog}
          readOnly
        />
      </Can>
    </TabContent>
  );
}

TabGeneral.propTypes = {
  atbd: T.object,
  onSubmit: T.func
};

// Moving the save button to a component of its own to use Formik context.
const SaveButton = () => {
  const { dirty, isSubmitting, submitForm } = useFormikContext();

  return (
    <Tip position='right' title='There are unsaved changes' open={dirty}>
      <Button
        variation='primary-raised-dark'
        title='Save current changes'
        disabled={isSubmitting || !dirty}
        onClick={submitForm}
        useIcon='tick--small'
      >
        Update
      </Button>
    </Tip>
  );
};

function TabCitation(props) {
  const { atbd } = props;

  const citation = atbd.citation;

  const hasCitation = !!Object.keys(citation || {}).length;

  const citationText = citation
    ? citationFields
        .filter((f) => !!citation[f.name])
        .map((f) => citation[f.name])
        .join(', ')
    : '';

  const citationEditLink = (
    <Link
      to={documentEdit(atbd, atbd.version)}
      title='Edit ATBD identifying information'
    >
      identifying information
    </Link>
  );

  const onDownloadClick = useCallback(() => {
    const { id, alias, version, citation } = atbd;
    const aliasId = alias || id;

    const bibtexCitation = createBibtexCitation(aliasId, version, citation);
    downloadTextFile(`atbd--${aliasId}--${version}.bibtex`, bibtexCitation);
  }, [atbd]);

  return (
    <TabContent tabId='citation'>
      {!hasCitation && (
        <Prose>
          <p>There is no citation data available.</p>
          <Can do='edit' on='document'>
            <p>
              The citation information can be edited through the{' '}
              {citationEditLink} form.
            </p>
          </Can>
        </Prose>
      )}

      {citationText && (
        <CopyField value={citationText}>
          {({ value, ref }) => (
            <React.Fragment>
              <FormTextarea readOnly value={value} />
              <TabActions>
                <Button
                  useIcon='clipboard'
                  variation='primary-raised-light'
                  title='Copy to clipboard'
                  ref={ref}
                >
                  Copy to clipboard
                </Button>
                <Button
                  useIcon='download-2'
                  variation='primary-raised-dark'
                  title='Download BibTeX file'
                  onClick={onDownloadClick}
                >
                  Download BibTeX
                </Button>
              </TabActions>
            </React.Fragment>
          )}
        </CopyField>
      )}
    </TabContent>
  );
}

TabCitation.propTypes = {
  atbd: T.object
};
