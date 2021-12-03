import React, { useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { rgba, themeVal } from '@devseed-ui/theme-provider';

import { useTabs } from '../common/tabs';
import { useAtbds } from '../../context/atbds-list';
import { PUBLISHED } from '../documents/status';

const DocumentCountMessage = styled.p`
  grid-row: 2;
  font-size: 0.875rem;
  color: ${rgba(themeVal('color.base'), 0.48)};
`;

/**
 * useTabs() will throw an error if not used in the Tabs context. In this way we
 * can know if we're inside a tabs context or not. This is needed because the
 * Curator dashboard doesn't have tabs but shows a count anyway.
 */
const useTabsSafe = () => {
  try {
    return useTabs();
  } catch (error) {
    return null;
  }
};

/**
 * Component to show the number of visible document vs the total amount of docs.
 */
function DocCountIndicator(props) {
  const { applyListSettingsFilters } = props;
  const tabs = useTabsSafe();

  // How does this component work?
  // This component is used in the Curator and Contributor dashboards to show
  // the document totals. In the Curator dashboard it could get the values from
  // the parent, but in the Contributor dashboard it gets rendered in a sibling
  // (this is rendered in the DocumentNavigator and the documents are rendered
  // in the TabContent --- done for semantic reasons) therefore we don't have
  // access to the document counts.
  // We use useAtbds() to access the queries atbds (they'll be fetched from the
  // Component that renders them), but we need the correct status and role to
  // access the state slice key. That's where useTabsSafe() comes into play. If
  // there's no tab we're looking at the Curator dashboard and there's no need
  // for values ({} empty object). If there's a tab we compute the correct
  // values.

  const { role, status } = useMemo(() => {
    switch (tabs?.activeTab) {
      case 'leading':
        return { role: 'owner' };
      case 'contrib':
        return { role: 'author' };
      case 'reviews':
        return { role: 'reviewer' };
      case 'public':
        return { status: PUBLISHED };
      default:
        return {};
    }
  }, [tabs]);

  const { atbds } = useAtbds({ role, status });

  if (atbds.status === 'succeeded' && !!atbds.data?.length) {
    const total = atbds.data.length;
    const visible = applyListSettingsFilters(atbds.data).length;

    // If there are no visible document do not show this message. An empty
    // message will kick in from the component that renders the content.
    if (!visible) return null;

    return (
      <DocumentCountMessage>
        Showing {visible} of {total} document
        {total !== 1 ? 's' : ''}
      </DocumentCountMessage>
    );
  }

  return null;
}

DocCountIndicator.propTypes = {
  applyListSettingsFilters: T.func
};

export default DocCountIndicator;
