import styled from 'styled-components';
import { glsp, rgba, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

export const ProgressTracker = styled.section`
  display: grid;
  grid-template-rows: 1fr;
`;

export const ProgressList = styled.ol`
  list-style: none !important;
  padding: ${glsp(2, 0)} !important;
  margin: 0 !important;

  position: relative;

  &::before {
    position: absolute;
    left: 50%;
    top: 0;
    content: '';
    display: block;
    width: 2px;
    height: 100%;
    background: ${themeVal('color.baseAlphaC')};
    z-index: 1;
    transform: translate(-50%, 0);
    pointer-events: none;
  }
`;

export const ProgressListItem = styled.li`
  background: transparent;
  width: calc(50% - 2rem);
  margin-bottom: ${glsp(2)};
  counter-increment: item;
  clear: both;

  &::before {
    position: absolute;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, 0);
    pointer-events: none;
    content: counter(item);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    width: 2rem;
    color: ${themeVal('color.baseLight')};
    background-color: ${rgba(themeVal('color.base'), 0.48)};
    border-radius: ${themeVal('shape.ellipsoid')};
  }

  &:nth-child(odd) {
    float: left;
  }

  &:nth-child(even) {
    float: right;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ProgressEntry = styled.article`
  padding: ${glsp(themeVal('layout.gap.xsmall'))};
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: ${themeVal('boxShadow.elevationB')};
  background: ${themeVal('color.surface')};

  h1 {
    font-size: 1.25rem;
    line-height: 1.75rem;
    margin: 0;
  }
`;

export const ProgressEntryTitle = styled(Heading)`
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin: 0;
`;
