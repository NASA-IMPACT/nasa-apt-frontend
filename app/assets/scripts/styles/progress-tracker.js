import styled from 'styled-components';
import { tint } from 'polished';
import { glsp, stylizeFunction, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

const _tint = stylizeFunction(tint);
const railSize = '1.75rem';

export const ProgressTracker = styled.ol`
  list-style: none !important;
  padding: ${glsp(0)} !important;
  margin: 0 !important;
  position: relative;

  &::before {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    bottom: 0;
    content: '';
    width: ${railSize};
    border-radius: ${themeVal('shape.ellipsoid')};
    pointer-events: none;
    background: transparent
      linear-gradient(
        90deg,
        ${themeVal('color.baseAlphaC')},
        ${themeVal('color.baseAlphaC')}
      )
      50% / 4px auto no-repeat;
  }
`;

export const ProgressItem = styled.li`
  padding: ${glsp(0, 0, 0, 2.5)};
  margin-bottom: ${glsp(2)};
  counter-increment: item;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ProgressEntry = styled.article`
  background: transparent;
`;

export const EntryTitle = styled(Heading)`
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin: 0;

  &::before {
    transform: translate(-2rem, 0);
    z-index: 2;
    content: counter(item);
    display: inline-flex;
    height: 2rem;
    aspect-ratio: 1 / 1;
    align-items: center;
    justify-content: center;
    font-weight: ${themeVal('type.base.bold')};
    color: ${themeVal('color.baseLight')};
    background: ${_tint(0.36, themeVal('color.base'))};
    box-shadow: 0 0 0 4px ${themeVal('color.surface')};
    border-radius: ${themeVal('shape.ellipsoid')};
    font-size: 0.75em;
    line-height: inherit;
    overflow: hidden;
  }
`;

export const SubTracker = styled.ol`
  list-style: none !important;
  padding: ${glsp(0)} !important;
  margin: 0 !important;

  > * {
    margin: 0.5rem 0 !important;
  }
`;

export const SubEntryTitle = styled(Heading)`
  font-size: 1rem;
  line-height: 1.5rem;
  margin: 0;

  &::before {
    position: absolute;
    left: 0;
    z-index: 2;
    content: '';
    display: flex;
    width: ${railSize};
    height: ${railSize};
    align-items: center;
    justify-content: center;
    font-weight: ${themeVal('type.base.bold')};
    text-transform: uppercase;
    color: ${themeVal('color.baseLight')};
    background: ${_tint(0.36, themeVal('color.base'))};
    box-shadow: 0 0 0 4px ${themeVal('color.surface')};
    border-radius: ${themeVal('shape.ellipsoid')};
    padding: 0.5em 1em;
    font-size: 0.75em;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    pointer-events: none;
  }
`;
