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

const _tint = stylizeFunction(tint);
const railSize = '1.75rem';
const innerSpace = 0.75;

export const Tracker = styled.ol`
  li {
    position: relative;
    padding-left: ${add(railSize, innerSpace)};
    display: grid;
    gap: ${glsp(1.5)};

    &:not(:last-child) {
      padding-bottom: ${glsp(1.5)};
    }

    &::before {
      position: absolute;
      left: 0;
      z-index: 4;
      content: '';
      display: flex;
      height: ${railSize};
      aspect-ratio: 1 / 1;
      align-items: center;
      justify-content: center;
      font-weight: ${themeVal('type.base.bold')};
      color: ${themeVal('color.baseLight')};
      background: ${_tint(0.36, themeVal('color.base'))};
      box-shadow: 0 0 0 4px ${themeVal('color.surface')};
      border-radius: ${themeVal('shape.ellipsoid')};
      font-size: 0.75em;
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
      background: ${_tint(0.92, themeVal('color.base'))};
    }
  }

  > li {
    counter-increment: item;

    &::before {
      content: counter(item);
    }
  }

  > li:last-child::after {
    display: none;
  }

  > li > ol {
    margin-left: -${add(railSize, innerSpace)};
  }

  > li > ol > li {
    &::before {
      height: ${divide(railSize, 2)};
      transform: translate(50%, 0);
      margin-top: 0.3rem;
      font-size: 0;
    }

    &::after {
      z-index: 2;
    }
  }
`;

export const TrackerItem = styled.li`
  background: transparent;

  ${({ status }) =>
    status === 'progress'
      ? css`
          &&::before {
            background: ${themeVal('color.primary')};
          }

          &&::after {
            background: transparent
              linear-gradient(
                180deg,
                ${themeVal('color.primary')} 64%,
                ${_tint(0.92, themeVal('color.base'))} 64%
              );
          }
        `
      : status === 'complete'
      ? css`
          &&::before {
            font-size: 1rem;
            content: ${collecticon('tick--small')};
            background: ${themeVal('color.primary')};
          }

          &&::after {
            background: ${themeVal('color.primary')};
          }

          ${TrackerItem}::before {
            font-size: 0;
          }
        `
      : null}
`;

export const TrackerEntry = styled.article`
  > *:last-child {
    margin-bottom: 0px;
  }
`;

export const TrackerEntryTitle = styled(Heading).attrs({
  as: 'h1'
})`
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin: ${glsp(0, 0, 0.25, 0)};
`;

export const SubTracker = styled.ol`
  background: transparent;
`;

export const SubTrackerEntryTitle = styled(Heading).attrs({
  as: 'h2'
})`
  font-size: 1rem;
  line-height: 1.5rem;
  margin: ${glsp(0, 0, 0.25, 0)};
`;