import styled, { css } from 'styled-components';
import { tint } from 'polished';
import {
  add,
  divide,
  glsp,
  stylizeFunction,
  themeVal
} from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';

import { statusSwatch } from '../components/common/status-pill';

const _tint = stylizeFunction(tint);
const railSize = '1.75rem';
const innerSpace = 0.75;
const inactiveCSSColor = css`
  ${_tint(0.92, themeVal('color.base'))}
`;
const activeCSSColor = css`
  ${_tint(0.24, themeVal('color.base'))}
`;

export const Tracker = styled.ol`
  li {
    position: relative;
    padding-left: ${add(railSize, innerSpace)};
    padding-bottom: ${glsp(1.5)};
    display: grid;
    gap: ${glsp(1.5)};

    &::before {
      position: absolute;
      left: 0;
      z-index: 4;
      content: '';
      display: flex;
      height: ${railSize};
      aspect-ratio: 1 / 1; /* stylelint-disable-line */
      align-items: center;
      justify-content: center;
      font-weight: ${themeVal('type.base.bold')};
      box-shadow: 0 0 0 0.25rem ${themeVal('color.surface')};
      border-radius: ${themeVal('shape.ellipsoid')};
      font-size: 0.875em;
      line-height: 1;
    }

    &::after {
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      left: ${divide(railSize, 2)};
      transform: translate(-50%, 0);
      content: '';
      display: block;
      width: ${glsp(0.25)};
      pointer-events: none;
      border-radius: ${themeVal('shape.ellipsoid')};
    }

    &::before,
    &::after {
      background: ${inactiveCSSColor};
    }
  }

  > li {
    counter-increment: item;

    &::before {
      content: counter(item);
    }
  }

  > li > ol {
    margin-left: -${add(railSize, innerSpace)};
  }

  > li > ol > li {
    &::before {
      height: ${divide(railSize, 2)};
      transform: translate(50%, 0);
      margin-top: 0.3rem;
      content: '';
    }

    &::after {
      z-index: 2;
    }
  }

  > li:last-child::after {
    display: none;
  }

  > li:last-child {
    padding-bottom: 0;
  }
`;

export const TrackerItem = styled.li`
  background: transparent;

  ${({ status }) =>
    status === 'progress'
      ? css`
          &&::before {
            color: ${themeVal('color.baseLight')};
            background: ${activeCSSColor};
          }

          &&::after {
            background: transparent
              linear-gradient(
                180deg,
                ${activeCSSColor} 64%,
                ${inactiveCSSColor} 64%
              );
          }
        `
      : status === 'complete'
      ? css`
          &&::before {
            color: ${themeVal('color.baseLight')};
            font-size: 1rem;
            content: ${collecticon('tick--small')};
            background: ${activeCSSColor};
          }

          &&::after {
            background: ${activeCSSColor};
          }

          ${TrackerItem}::before {
            font-size: 0;
            content: '';
          }
        `
      : /* Used when a sub tracker item is in progress. This will be the status
        of the parent. */
      status === 'progress-child'
      ? css`
          &&::before {
            color: ${themeVal('color.baseLight')};
            background: ${activeCSSColor};
          }

          &&::after {
            background: ${activeCSSColor};
          }
        `
      : null}
`;

export const TrackerEntry = styled.article`
  > *:last-child {
    margin-bottom: 0px;
  }
`;

export const TrackerTrigger = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;

  &,
  &:visited {
    color: inherit;
  }

  &:after {
    ${collecticon('chevron-down--small')}
    margin-left: auto;
    transition: transform 240ms ease-in-out;
    transform: ${({ isExpanded }) =>
      isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

export const TrackerEntryTitle = styled(Heading).attrs({
  as: 'h1'
})`
  font-weight: ${themeVal('type.base.bold')};
  text-transform: uppercase;
  font-size: 1rem;
  line-height: 1.75rem;
  margin: ${glsp(0, 0, 0.25, 0)};
  display: flex;
  gap: 0.5em;
  align-items: center;

  &::before {
    ${statusSwatch}
  }
`;

export const SubTracker = styled.ol`
  background: transparent;
  margin-bottom: ${glsp(-1.5)};
`;

export const SubTrackerEntryTitle = styled(Heading).attrs({
  as: 'h2'
})`
  font-weight: ${themeVal('type.base.bold')};
  text-transform: uppercase;
  font-size: 0.75rem;
  line-height: 1.5rem;
  margin: 0;
`;
