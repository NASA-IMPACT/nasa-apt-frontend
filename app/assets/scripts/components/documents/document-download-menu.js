import React, { useMemo } from 'react';
import T from 'prop-types';
import ReactGA from 'react-ga';
import { Auth } from 'aws-amplify';
import { saveAs } from 'file-saver';

import DropdownMenu, { DropMenuItemEnhanced } from '../common/dropdown-menu';
import { createProcessToast } from '../common/toasts';

import { apiUrl } from '../../config';
import { useAuthToken } from '../../context/user';

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

  // TODO: Fix Journal PDF downloading
  // Temporarily disable journal PDF downloading https://github.com/nasa-impact/nasa-apt/issues/744
  // const ability = useContextualAbility();
  //const canDownloadJournalPdf = ability.can('download-journal-pdf', atbd);
  const canDownloadJournalPdf = false;

  const handlePdfDownloadClick = React.useCallback(() => {
    const processToast = createProcessToast('Downloading PDF, please wait...');
    if (atbd.documentType === 'PDF' && !atbd.pdf) {
      processToast.error("This ATBD doesn't have the attachment");
      return;
    }

    const { id, version, alias } = atbd;
    const pdfUrl =
      atbd.documentType === 'PDF'
        ? atbd.pdf.file_path
        : `${apiUrl}/atbds/${id}/versions/${version}/pdf`;

    const pdfFileName = `${alias}-v${version}.pdf`;
    const maxRetries = 50;
    const waitBetweenTries = 5000;
    const initialWait = 10000;
    let retryCount = 0;

    async function fetchPdf(url) {
      if (retryCount > 0) {
        processToast.update(
          'Generating the PDF. This may take up to 5 minutes.'
        );
      }
      const user = await Auth.currentAuthenticatedUser();
      if (!user) {
        processToast.error('Failed to download PDF! (Not authenticated)');
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

        // If we get a 404 on retry, it means the PDF is not ready yet.
        // Keep retrying until we reach the max retry count.
        if (
          response.status === 404 &&
          response.headers.get('content-type') === 'application/json' &&
          url.includes('?retry=true')
        ) {
          if (retryCount < maxRetries) {
            setTimeout(() => {
              fetchPdf(`${pdfUrl}?retry=true`);
            }, waitBetweenTries);
            ++retryCount;
          } else {
            processToast.error(
              'Failed to download PDF. Please retry after several minutes. If this error persists, please contact the APT team.'
            );
          }
          return;
        }

        // If we get a 201, it means the PDF generation has been triggered.
        // Retry after some time to check if the PDF is ready for download.
        if (
          response.status === 201 &&
          response.headers.get('content-type') === 'application/json'
        ) {
          const result = await response.json();

          if (result?.message) {
            processToast.update(result.message);
          }

          setTimeout(() => {
            fetchPdf(`${pdfUrl}?retry=true`);
          }, initialWait);
          ++retryCount;

          return;
        }

        // If we get a 200, it means the PDF is ready for download.
        // We get the s3 url and use file saver to download and save the pdf.
        if (
          response.status === 200 &&
          response.headers.get('content-type') === 'application/json'
        ) {
          const result = await response.json();

          await saveAs(result.pdf_url, pdfFileName);
          processToast.success('PDF downloaded successfully!');
          return;
        }

        processToast.error('Failed to download PDF!');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        processToast.error('Failed to download PDF!');
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
