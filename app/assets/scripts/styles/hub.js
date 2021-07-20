import styled from 'styled-components';
import {
  glsp,
  media,
  themeVal,
  truncated,
  visuallyHidden
} from '@devseed-ui/theme-provider';

export const HubList = styled.ol`
  grid-column: content-start / content-end;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};

  ${media.smallUp`
    grid-template-columns: repeat(2, 1fr);
    grid-gap: ${glsp(themeVal('layout.gap.small'))};
  `}

  ${media.mediumUp`
    grid-template-columns: repeat(2, 1fr);
    grid-gap: ${glsp(themeVal('layout.gap.medium'))};
  `}

  ${media.largeUp`
    grid-gap: ${glsp(themeVal('layout.gap.large'))};
  `}
`;

export const HubListItem = styled.li`
  > * {
    height: 100%;
  }
`;

export const HubEntry = styled.article`
  background: transparent;
`;

export const HubEntryHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr minmax(min-content, max-content) minmax(
      min-content,
      max-content
    );
  grid-gap: ${glsp(0, themeVal('layout.gap.xsmall'))};
`;

export const HubEntryHeadline = styled.div`
  display: inline-grid;
  grid-auto-columns: minmax(min-content, max-content);
  grid-gap: ${glsp(1.25)};
  align-items: center;
  min-width: 0px;

  > * {
    grid-row: 1;
  }
`;

export const HubEntryTitle = styled.h1`
  ${truncated()}
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin: 0;
  max-width: 24rem;

  a {
    display: block;
    color: inherit;
  }
`;

export const HubEntryMeta = styled.dl`
  grid-row: 2;
  grid-column: 1;
  display: grid;
  grid-gap: ${glsp(0.5)};
  align-items: center;
  grid-auto-columns: minmax(min-content, max-content);
  font-size: 0.75rem;
  line-height: 1.25rem;

  > * {
    grid-row: 1;
  }

  dt {
    ${visuallyHidden}
  }

  a {
    color: inherit;
  }
`;

export const HubEntryDetails = styled.dl`
  grid-row: 1;
  grid-column: 2;
  display: grid;
  grid-gap: ${glsp(1)};
  align-items: center;
  grid-auto-columns: minmax(min-content, max-content);
  font-size: 0.875rem;
  line-height: 1.25rem;

  > * {
    grid-row: 1;
  }

  dt {
    ${visuallyHidden}
  }

  a {
    color: inherit;
  }
`;

export const HubEntryHeadNav = styled.nav`
  font-size: 1rem;
  line-height: 2rem;
`;

export const HubEntryBreadcrumbMenu = styled.ul`
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

export const HubEntryActions = styled.div`
  grid-column: 3;
  display: inline-grid;
  grid-gap: ${glsp(0.5)};
  align-items: center;

  > * {
    grid-row: 1;
  }
`;
