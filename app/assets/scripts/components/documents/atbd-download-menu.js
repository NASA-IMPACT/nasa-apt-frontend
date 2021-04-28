import React, { useMemo } from 'react';
import T from 'prop-types';

import DropdownMenu from '../common/dropdown-menu';
import ButtonSecondary from '../../styles/button-secondary';

import { apiUrl } from '../../config';
import { useAuthToken } from '../../context/user';

export default function AtbdDownloadMenu(props) {
  const { atbd } = props;
  const { token } = useAuthToken();

  const dropProps = useMemo(() => {
    const triggerProps = {
      triggerProps: {
        useIcon: 'download-2',
        as: ButtonSecondary
      },
      triggerLabel: 'Download'
    };

    // There are pdfs available for all minor versions of a major version.
    // Therefore if the minor version is a 4, we know that there are also pdf
    // for minor 3, 2, 1 and 0. The urls are constructed dynamically.
    let pdfLinks = [];
    for (let v = atbd.minor; v >= 0; v--) {
      const version = `v${atbd.major}.${v}`;
      const pdfUrl = `${apiUrl}/atbds/${atbd.id}/versions/${version}/pdf`;

      pdfLinks.push(
        {
          id: `${version}-document`,
          label: `${version} Document PDF`,
          title: `Download document for version ${version}`,
          href: `${pdfUrl}${token ? `?token=${token}` : ''}`
        },
        {
          id: `${version}-journal`,
          label: `${version} Journal PDF`,
          title: `Download journal for version ${version}`,
          href: `${pdfUrl}?journal=true${token ? `&token=${token}` : ''}`
        }
      );
    }

    return {
      ...triggerProps,
      menu: {
        id: 'download',
        items: pdfLinks
      }
    };
  }, [atbd]);

  return (
    <DropdownMenu
      {...dropProps}
      alignment='right'
      direction='down'
      dropTitle='Download'
    />
  );
}

AtbdDownloadMenu.propTypes = {
  atbd: T.object
};
