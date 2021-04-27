import React, { useEffect } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

import { useTabs } from './tabs-context';
export * from './tabs-context';

// Use:
// <TabsManager>  --> Context provider. Doesn't render any wrapper
//   <TabsNav>  --> Nav list. Renders a Ul
//     <TabItem label='Tab 1' tabId='t1'>  --> List item. Renders li > a
//       Tab 1
//     </TabItem>
//     <TabItem label='Tab 2' tabId='t2'>
//       Tab 2
//     </TabItem>
//   </TabsNav>
//   <div>
//     <TabContent tabId='t1'>Tab 1 content</TabContent> --> Tab content. Renders a div when active.
//     <TabContent tabId='t2'>Tab 2 content</TabContent>
//   </div>
// </TabsManager>
//
// Since we're using context, there can be as may wrappers and elements between
// the tab navigation and the content.

const TabsList = styled.ul`
  display: grid;
  grid-auto-columns: max-content;
  grid-gap: ${glsp()};
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaC')};

  li {
    list-style: none;
    grid-row: 1;
  }
`;

const TabInnerContent = styled.div`
  display: grid;
  grid-gap: ${glsp()};
`;

const TabLink = styled.a`
  position: relative;
  display: block;
  padding: ${glsp(0, 0, 0.5, 0)};
  font-size: 0.875rem;
  line-height: 1rem;
  font-weight: ${themeVal('type.base.bold')};
  text-transform: uppercase;

  &,
  &:visited {
    color: inherit;
  }

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    content: '';
    background: ${themeVal('color.link')};
    transition: all 0.16s ease-in-out 0s;

    ${({ active }) =>
      active &&
      css`
        width: 100%;
      `}
  }
`;

export function TabsNav(props) {
  const { children, ...rest } = props;

  return <TabsList {...rest}>{children}</TabsList>;
}

TabsNav.propTypes = {
  children: T.node
};

export function TabItem(props) {
  const { children, label, tabId, ...rest } = props;
  const { activeTab, setActiveTab, registerTab, unregisterTab } = useTabs();

  useEffect(() => {
    if (tabId) {
      registerTab({ id: tabId });
    }
    return () => {
      unregisterTab({ id: tabId });
    };
  }, [tabId, registerTab, unregisterTab]);

  return (
    <li>
      <TabLink
        href='#'
        onClick={(e) => {
          e.preventDefault();
          setActiveTab(tabId);
        }}
        title={`Select ${label} tab`}
        active={activeTab === tabId}
        {...rest}
      >
        {children}
      </TabLink>
    </li>
  );
}

TabItem.propTypes = {
  children: T.node,
  tabId: T.string.isRequired,
  label: T.string
};

export function TabContent(props) {
  const { children, tabId, ...rest } = props;
  const { activeTab } = useTabs();

  return (
    activeTab === tabId && (
      <TabInnerContent {...rest}>{children}</TabInnerContent>
    )
  );
}

TabContent.propTypes = {
  children: T.node,
  tabId: T.string.isRequired
};
