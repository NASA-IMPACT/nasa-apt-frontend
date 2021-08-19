import React, { useCallback } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { FormTextarea } from '@devseed-ui/form';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';

import { TabContent, TabItem, TabsManager, TabsNav } from '../common/tabs';
import DetailsList from '../../styles/typography/details-list';
import Prose from '../../styles/typography/prose';
import { Link } from '../../styles/clean/link';
import { CopyField } from '../common/copy-field';
import Datetime from '../common/date';
import { Can } from '../../a11n';

import { documentEdit } from '../../utils/url-creator';
import { createBibtexCitation, createStringCitation } from './citation';
import { downloadTextFile } from '../../utils/download-text-file';
import { getDocumentStatusLabel } from './status';

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
  const { atbd, revealed, onClose } = props;
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

          <TabGeneral atbd={atbd} />
          <TabCitation atbd={atbd} closeModal={onClose} />
        </TabsManager>
      }
    />
  );
}

DocumentInfoModal.propTypes = {
  atbd: T.object,
  revealed: T.bool,
  onClose: T.func
};

function TabGeneral(props) {
  const { atbd } = props;

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
        <dd>{atbd.created_by.preferred_username}</dd>
        <dt>Status</dt>
        <dd>{getDocumentStatusLabel(atbd)}</dd>
        <dt>Last update</dt>
        <dd>{updatedAt ? <Datetime date={updatedAt} /> : 'n/a'}</dd>
      </DocInfoList>
    </TabContent>
  );
}

TabGeneral.propTypes = {
  atbd: T.object
};

function TabCitation(props) {
  const { atbd, closeModal } = props;

  const citationText = createStringCitation(atbd);

  const citationEditLink = (
    <Link
      to={documentEdit(atbd, atbd.version)}
      title='Edit ATBD identifying information'
      onClick={closeModal}
    >
      identifying information
    </Link>
  );

  const onDownloadClick = useCallback(() => {
    const { id, alias, version } = atbd;
    const aliasId = alias || id;

    const bibtexCitation = createBibtexCitation(atbd);
    downloadTextFile(`atbd--${aliasId}--${version}.bibtex`, bibtexCitation);
  }, [atbd]);

  return (
    <TabContent tabId='citation'>
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

      <Prose>
        <Can do='edit' on={atbd}>
          <p>
            The citation information can be edited through the{' '}
            {citationEditLink} form.
          </p>
        </Can>
      </Prose>
    </TabContent>
  );
}

TabCitation.propTypes = {
  closeModal: T.func,
  atbd: T.object
};
