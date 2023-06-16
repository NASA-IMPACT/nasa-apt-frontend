import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { multiply, themeVal } from '@devseed-ui/theme-provider';

import Prose, { proseSpacing } from '../../../styles/typography/prose';

import DocumentBody from './document-body';
import DocumentTitle from './document-title';

export const DocumentProse = styled(Prose)`
  > * {
    position: relative;
    padding-bottom: ${multiply(proseSpacing, 2)};
    margin-bottom: ${multiply(proseSpacing, 2)};

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 1px;
      width: 100%;
      background: ${themeVal('color.baseAlphaC')};
      content: '';
      pointer-events: none;
    }
  }

  > *:last-child {
    padding-bottom: 0;
    margin-bottom: 0;

    &::after {
      display: none;
    }
  }
`;

function DocumentContent(props) {
  const { atbdData, disableScrollManagement } = props;

  return (
    <DocumentProse>
      <DocumentTitle data={atbdData} />
      <DocumentBody
        disableScrollManagement={disableScrollManagement}
        atbd={atbdData}
      />
    </DocumentProse>
  );
}

DocumentContent.propTypes = {
  atbdData: T.shape({
    title: T.string,
    version: T.string,
    keywords: T.arrayOf(T.string),
    citation: T.shape({
      creators: T.string,
      editors: T.string
    }),
    doi: T.string
  }),
  disableScrollManagement: T.bool
};

export default DocumentContent;
