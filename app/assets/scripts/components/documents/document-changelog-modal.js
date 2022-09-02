import React, { useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import ReactGA from 'react-ga';
import { Modal as BaseModal } from '@devseed-ui/modal';
import { glsp } from '@devseed-ui/theme-provider';

import { apiUrl } from '../../config';
import { useAuthToken } from '../../context/user';
import { useContextualAbility } from '../../a11n';
import { SafeReadEditor } from '../slate';
import DropdownMenu, { DropMenuItemEnhanced } from '../common/dropdown-menu';

const Modal = styled(BaseModal)`
  z-index: 7001;
`;

const Version = styled.div`
  margin-bottom: ${glsp(3)};
`;

const Downloads = styled.div`
  margin-top: ${glsp(1.5)};

  & > a {
    margin-right: ${glsp()};
  }
`;

function DropMenuItemOutboundLink(props) {
  const { eventLabel, menuItem, active, ...rest } = props;
  return (
    <DropMenuItemEnhanced
      as={ReactGA.OutboundLink}
      {...rest}
      active={active || undefined}
      eventLabel={eventLabel}
      to={menuItem.href}
      title={menuItem.title}
    >
      {menuItem.label}
    </DropMenuItemEnhanced>
  );
}

DropMenuItemOutboundLink.propTypes = {
  active: T.bool,
  eventLabel: T.string,
  menuItem: T.object
};

function DownloadMenu({ id, atbdVersion, canDownloadJournalPdf }) {
  const { token } = useAuthToken();
  const items = [];

  for (let v = atbdVersion.minor; v >= 0; v--) {
    const version = `v${atbdVersion.major}.${v}`;
    const pdfUrl = `${apiUrl}/atbds/${id}/versions/${version}/pdf`;

    if (canDownloadJournalPdf) {
      items.push({
        id: `${version}-journal`,
        label: `${version} Journal PDF`,
        title: `Download journal for version ${version}`,
        href: `${pdfUrl}?journal=true${token ? `&token=${token}` : ''}`,
        /* eslint-disable-next-line react/display-name */
        render: (props) => (
          <DropMenuItemOutboundLink
            {...props}
            eventLabel={`Journal PDF ${atbdVersion.id}/${version}`}
          />
        )
      });
    }

    items.push({
      id: `${version}-document`,
      label: `${version} Document PDF`,
      title: `Download document for version ${version}`,
      href: `${pdfUrl}${token ? `?token=${token}` : ''}`,
      /* eslint-disable-next-line react/display-name */
      render: (props) => (
        <DropMenuItemOutboundLink
          {...props}
          eventLabel={`PDF ${atbdVersion.id}/${version}`}
        />
      )
    });
  }

  return (
    <DropdownMenu
      triggerProps={{
        variation: 'primary-raised-dark',
        useIcon: 'download-2'
      }}
      menu={{
        id: 'download',
        items
      }}
      triggerLabel='Download'
      alignment='left'
      direction='down'
      dropTitle='Download'
    />
  );
}

DownloadMenu.propTypes = {
  id: T.number.isRequired,
  atbdVersion: T.object.isRequired,
  canDownloadJournalPdf: T.bool
};

export default function DocumentChangelogModal(props) {
  const { atbd, revealed, onClose } = props;

  const ability = useContextualAbility();
  const canDownloadJournalPdf = ability.can('download-journal-pdf', atbd);

  useEffect(() => {
    if (revealed) {
      ReactGA.modalview('document-changelog');
    }
  }, [revealed]);

  const content = atbd.versions.map((atbdVersion) => {
    const { document, major } = atbdVersion;

    const version_description = document
      ? document.version_description
      : atbd.document.version_description;

    return (
      <Version key={major}>
        <h3>Major version {major}</h3>
        <SafeReadEditor
          value={version_description}
          whenEmpty='No summary available'
        />
        <Downloads>
          <DownloadMenu
            id={atbd.id}
            atbdVersion={atbdVersion}
            canDownloadJournalPdf={canDownloadJournalPdf}
          />
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
      data-cy='changelog-modal'
    />
  );
}

DocumentChangelogModal.propTypes = {
  atbd: T.object,
  revealed: T.bool,
  onClose: T.func
};
