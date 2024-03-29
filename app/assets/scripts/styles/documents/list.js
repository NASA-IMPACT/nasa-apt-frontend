import styled from 'styled-components';
import { divide, glsp, themeVal } from '@devseed-ui/theme-provider';
import { VerticalDivider } from '@devseed-ui/toolbar';

export const DocumentsList = styled.ol`
  background: transparent;
`;

export const DocumentsListItem = styled.li`
  &:not(:last-child) {
    padding-bottom: ${glsp()};
    margin-bottom: ${glsp()};
    box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaC')};
  }
`;

export const DocumentEntry = styled.article`
  background: transparent;
`;

export const DocumentEntryHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr minmax(min-content, max-content);
  grid-gap: ${glsp(
    divide(themeVal('layout.gap.xsmall'), 2),
    themeVal('layout.gap.xsmall')
  )};
  align-items: end;
`;

export const DocumentEntryHeadline = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(0.25)};
`;

export const DocumentEntryHgroup = styled.div`
  display: inline-grid;
  grid-auto-columns: minmax(min-content, max-content);
  grid-gap: ${glsp(1.25)};
  align-items: baseline;
  min-width: 0px;

  > * {
    grid-row: 1;
  }
`;

export const DocumentEntryTitle = styled.h1`
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin: 0;

  a {
    display: block;
    color: inherit;
  }
`;

export const DocumentEntryMeta = styled.ul`
  display: grid;
  grid-gap: ${glsp(0.75)};
  align-items: center;
  grid-auto-columns: minmax(min-content, max-content);
  font-size: 0.875rem;
  line-height: 1.25rem;

  > * {
    grid-row: 1;
    display: flex;
    align-content: center;
  }

  a {
    color: inherit;
  }
`;

export const DocumentEntryNav = styled.nav`
  font-size: 1rem;
  line-height: 1.75rem;
`;

export const DocumentEntryBreadcrumbMenu = styled.ul`
  display: inline-grid;
  grid-gap: ${glsp(0.5)};
  align-items: center;

  > * {
    grid-row: 1;
  }

  li {
    display: flex;
    flex-flow: row nowrap;

    &::before {
      content: '/';
      font-weight: ${themeVal('type.heading.weight')};
      margin-right: ${glsp(0.5)};
      opacity: 0.32;
    }
  }

  strong {
    padding: ${glsp(0, 0.75)};
  }
`;

export const DocumentEntryActions = styled.div`
  display: inline-grid;
  grid-gap: ${glsp(0.5)};
  align-items: end;

  ${VerticalDivider}:first-child {
    display: none;
  }

  > * {
    grid-row: 1;
  }
`;
