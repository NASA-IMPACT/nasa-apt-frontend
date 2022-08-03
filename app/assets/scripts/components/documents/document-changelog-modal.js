import React, { useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import ReactGA from 'react-ga';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';

import { apiUrl } from '../../config';
import { useAuthToken } from '../../context/user';
import { SafeReadEditor } from '../slate';

const Version = styled.div`
  margin-bottom: ${glsp(3)};
`;

const Downloads = styled.div`
  margin-top: ${glsp(1.5)};

  & > a {
    margin-right: ${glsp()};
  }
`;

export default function DocumentChangelogModal(props) {
  const { atbd, revealed, onClose } = props;
  const { token } = useAuthToken();

  useEffect(() => {
    if (revealed) {
      ReactGA.modalview('document-changelog');
    }
  }, [revealed]);

  const content = atbd.versions.map(({ version, document }) => {
    const pdfUrl = `${apiUrl}/atbds/${atbd.id}/versions/${version}/pdf`;

    return (
      <Version key={version}>
        <h3>{version}</h3>
        <SafeReadEditor
          value={document.version_description}
          whenEmpty='No summary available'
        />
        <Downloads>
          <Button
            as='a'
            variation='primary-raised-dark'
            useIcon='download-2'
            href={`${pdfUrl}?journal=true${token ? `&token=${token}` : ''}`}
          >
            Download Journal PDF
          </Button>
          <Button
            as='a'
            variation='primary-raised-dark'
            useIcon='download-2'
            href={`${pdfUrl}${token ? `?token=${token}` : ''}`}
          >
            Download Document PDF
          </Button>
        </Downloads>
      </Version>
    );
  });

  return (
    <Modal
      id='modal'
      size='large'
      revealed={revealed}
      onCloseClick={onClose}
      title='Document Changelog'
      content={<>{content}</>}
    />
  );
}

DocumentChangelogModal.propTypes = {
  atbd: T.object,
  revealed: T.bool,
  onClose: T.func
};
