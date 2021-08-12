import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';

const HeadingWActions = styled.h1`
  position: relative;
  font-size: 3rem;
  line-height: 3.5rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;

  span + span {
    position: absolute;
    /* stylelint-disable-next-line */
    right: calc(100% + ${glsp(0.5)});
    z-index: 2;
    display: inline-block;
    line-height: inherit;
    white-space: nowrap;
    overflow: hidden;
    opacity: 0;
    transition: all 0.24s ease-in-out 0.16s;

    > * {
      vertical-align: 0.55em;

      &:not(:last-child) {
        margin-right: ${glsp(0.25)};
      }
    }
  }

  &:hover {
    span + span {
      opacity: 1;
      transition-delay: 0s;
    }
  }
`;

export default HeadingWActions;
