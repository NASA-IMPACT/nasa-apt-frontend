import React, { useMemo } from 'react';
import T from 'prop-types';
import ReactGA from 'react-ga';

import DropdownMenu, { DropMenuItemEnhanced } from '../common/dropdown-menu';

import { apiUrl } from '../../config';
import { useAuthToken } from '../../context/user';
import { useContextualAbility } from '../../a11n';

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

export default function DocumentDownloadMenu(props) {
  const { atbd, hideText, variation, alignment, direction, onChange } = props;
  const { token } = useAuthToken();

  const ability = useContextualAbility();
  const canDownloadJournalPdf = ability.can('download-journal-pdf', atbd);

  const dropProps = useMemo(() => {
    const triggerProps = {
      triggerProps: {
        useIcon: 'download-2',
        variation,
        hideText
      },
      triggerLabel: 'Download'
    };

    // There are pdfs available for all minor versions of a major version.
    // Therefore if the minor version is a 4, we know that there are also pdf
    // for minor 3, 2, 1 and 0. The urls are constructed dynamically.
    let pdfLinks = [];
    const { id, version } = atbd;
    const pdfUrl = `${apiUrl}/atbds/${id}/versions/${version}/pdf`;

    if (canDownloadJournalPdf) {
      pdfLinks.push({
        id: `${version}-journal`,
        label: `${version} Journal PDF`,
        title: `Download journal for version ${version}`,
        href: `${pdfUrl}?journal=true${token ? `&token=${token}` : ''}`,
        /* eslint-disable-next-line react/display-name */
        render: (props) => (
          <DropMenuItemOutboundLink
            {...props}
            eventLabel={`Journal PDF ${id}/${version}`}
          />
        )
      });
    }

    pdfLinks.push({
      id: `${version}-document`,
      label: `${version} Document PDF`,
      title: `Download document for version ${version}`,
      href: `${pdfUrl}${token ? `?token=${token}` : ''}`,
      /* eslint-disable-next-line react/display-name */
      render: (props) => (
        <DropMenuItemOutboundLink
          {...props}
          eventLabel={`PDF ${atbd.id}/${version}`}
        />
      )
    });

    return {
      ...triggerProps,
      menu: {
        id: 'download',
        items: pdfLinks
      }
    };
  }, [hideText, variation, token, atbd, canDownloadJournalPdf]);

  return (
    <DropdownMenu
      {...dropProps}
      onChange={onChange}
      alignment={alignment || 'right'}
      direction={direction || 'down'}
      dropTitle='Download'
    />
  );
}

DocumentDownloadMenu.propTypes = {
  onChange: T.func,
  atbd: T.object,
  hideText: T.bool,
  alignment: T.string,
  direction: T.string,
  variation: T.string
};
