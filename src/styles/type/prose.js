import styled from 'styled-components/macro';
import { themeVal } from '../utils/general';
import { multiply } from '../utils/math';

const Prose = styled.div`
  font-size: ${themeVal('type.base.size')};                                     /* 16px */
  line-height: ${themeVal('type.base.line')};                                   /* 24px */

  ol ol, ol ul, ul ol, ul ul {
    margin-bottom: 0;
  }

  ul, ol, dl {
    padding: 0;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  ul,
  ol {
    list-style-position: outside;
    margin-left: ${themeVal('layout.space')};
  }

  .prose-editor > *,
  > * {
    margin-bottom: ${multiply(themeVal('type.base.size'), themeVal('type.base.line'))}; /* same as line-height */
  }

  .prose-editor > *:last-child,
  > *:last-child {
    margin-bottom: 0;
  }
`;

export default Prose;
