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
      content: '';
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
  display: flex;
  gap: 0.375rem;
  align-items: center;

  &::before {
    content: '';
    height: 0.5rem;
    aspect-ratio: 1 / 1;
    box-shadow: 0 0 0 0.25rem ${themeVal('color.surface')};
    border-radius: ${themeVal('shape.ellipsoid')};
    background: red;
  }
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
