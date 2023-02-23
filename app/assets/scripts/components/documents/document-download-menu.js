import React, { useMemo } from 'react';
import T from 'prop-types';
import ReactGA from 'react-ga';
import { Auth } from 'aws-amplify';
import { saveAs } from 'file-saver';

import DropdownMenu, { DropMenuItemEnhanced } from '../common/dropdown-menu';
import { createProcessToast } from '../common/toasts';

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

  const handlePdfDownloadClick = React.useCallback(() => {
    const { id, version, alias } = atbd;
    const pdfUrl = `${apiUrl}/atbds/${id}/versions/${version}/pdf`;
    const pdfFileName = `${alias}-v${version}.pdf`;
    let retryCount = 0;

    async function fetchPdf(url) {
      const toast = createProcessToast('Downloading PDF, please wait...');
      const user = await Auth.currentAuthenticatedUser();
      if (!user) {
        toast.error('Failed to download PDF! (Not authenticated)');
        return;
      }

      const {
        signInUserSession: { idToken, accessToken }
      } = user;
      const authToken = `Bearer ${idToken.jwtToken}`;
      const xAccessToken = accessToken.jwtToken;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: authToken,
            'X-ACCESS-TOKEN': xAccessToken
          }
        });

        if (
          response.status === 200 &&
          response.headers.get('content-type') === 'application/json'
        ) {
          if (retryCount < 3) {
            const result = await response.json();

            if (result?.message) {
              toast.update(result.message);
            }

            setTimeout(() => {
              fetchPdf(`${pdfUrl}?retry=true`);
            }, 3000);
            ++retryCount;
          } else {
            toast.error('Failed to download PDF!');
          }

          return;
        }

        if (
          response.status === 201 &&
          response.headers.get('content-type') === 'application/pdf'
        ) {
          const pdfBlob = await response.blob();
          saveAs(pdfBlob, pdfFileName);
          toast.success('PDF downloaded successfully!');
          return;
        }

        toast.error('Failed to download PDF!');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        toast.error('Failed to download PDF!');
      }
    }

    fetchPdf(pdfUrl);
  }, [atbd]);

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
      render: (p) => {
        return (
          <DropMenuItemEnhanced
            data-dropdown='click.close'
            key={p.id}
            eventLabel={`PDF ${atbd.id}/${version}`}
            onClick={handlePdfDownloadClick}
            title={p.menuItem.title}
          >
            {p.menuItem.label}
          </DropMenuItemEnhanced>
        );
      }
    });

    return {
      ...triggerProps,
      menu: {
        id: 'download',
        items: pdfLinks
      }
    };
  }, [
    hideText,
    variation,
    token,
    atbd,
    canDownloadJournalPdf,
    handlePdfDownloadClick
  ]);

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
