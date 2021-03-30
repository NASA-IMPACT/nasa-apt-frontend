import styled, { css } from 'styled-components';

import {
  themeVal,
  glsp,
  media,
  divide,
  subtract,
  val2px
} from '@devseed-ui/theme-provider';

// Grid:
//   start    1    2    3    4    5    6    7    8    9   10   11   12     end
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
//
// The start and end take up 1 fraction and its size is fluid, depending on
// window size.
// Each column takes up a 12th of the max content width (defined in the theme).
// Grid gaps are marked with an asterisk.
// Each instance or Universal Gridder, nested inside another Universal Gridder
// must define its grid for the different media queries, through a grid prop.
// The only required media queries are: smallUp, mediumUp, largeUp
// The value for each media query breakpoint is an array with a start and an end
// column. It works much like the `grid-column property of css.
//    <UniversalGridder>
//      <UniversalGridder
//        grid={{
//          smallUp: ['full-start', 'full-end'],
//          mediumUp: ['content-3', 'content-4'],
//          largeUp: ['content-3', 'content-5'],
//        }}
//      >
//        Subgrid 1
//      </UniversalGridder>
//      <UniversalGridder
//        grid={{
//          smallUp: ['full-start', 'full-end'],
//          mediumUp: ['full-start', 'full-end'],
//          largeUp: ['content-6', 'full-end'],
//        }}
//      >
//        Subgrid 2
//      </UniversalGridder>
//    </UniversalGridder>
//
// The Universal Gridder will define a grid whose line names are always the same
// regardless of how many nested grids there are. Therefore an element placed on
// `content-5` will be aligned with the top most `content-5`.

function makeGrid(columns, mdQuery) {
  return ({ grid }) => {
    const gapRem = glsp(themeVal(`layout.gap.${mdQuery}`));
    // Use all the values defined in pixels.
    const layoutMax = val2px(themeVal('layout.max'));
    const gridGap = val2px(gapRem);
    // Discard the base padding to ensure that gridded folds have the same size as
    // the constrainers.
    const layoutMaxNoPadding = subtract(layoutMax, gridGap);
    // Each column takes up a 12th of the content block (with is the layoutMaxNoPadding).
    const fullColumn = divide(layoutMaxNoPadding, columns);
    // To get the usable size of each column we need to account for the gap.
    const contentColWidth = subtract(fullColumn, gridGap);

    // Create the columns as:
    // [content-<num>] minmax(0, <size>)
    // Columns start at 2 since the first is named content-start
    const contentColumns = Array(columns - 1)
      .fill(0)
      .map((_, i) => ({
        name: `content-${i + 2}`,
        value: css`
          [content-${i + 2}] minmax(0, ${contentColWidth})
        `
      }));

    // Create an array with all the columns definitions. It will be used to
    // filter out the ones that are not needed when taking the user's grid
    // definition into account.
    const columnTemplate = [
      { name: 'full-start', value: css`[full-start] minmax(0, 1fr)` },
      {
        name: 'content-start',
        value: css`[content-start] minmax(0, ${contentColWidth})`
      },
      ...contentColumns,
      { name: 'content-end', value: css`[content-end] minmax(0, 1fr)` },
      { name: 'full-end', value: '[full-end]' }
    ];

    let gridTemplateColumns = null;
    let gridColumn = undefined;

    if (grid) {
      const [start, end] = getGridProp(grid, mdQuery);
      gridColumn = css`
        grid-column: ${start} / ${end};
      `;
      const startIdx = columnTemplate.findIndex((col) => col.name === start);
      const endIdx = columnTemplate.findIndex((col) => col.name === end);
      const lastColumn = columnTemplate[endIdx];
      gridTemplateColumns = [
        ...columnTemplate.slice(startIdx, endIdx),
        // Add the name of the last column without a size so we can use it for
        // naming purposes.
        { name: lastColumn.name, value: `[${lastColumn.name}]` }
      ];
    } else {
      gridTemplateColumns = columnTemplate;
    }

    // The grid-template-columns will be a subset of this, depending on the grid
    // defined by the user.
    // grid-template-columns:
    //   [full-start] minmax(0, 1fr)
    //   [content-start] minmax(0, 000px)
    //   [content-2] minmax(0, 000px)
    //   [content-3] minmax(0, 000px)
    //   [content-4] minmax(0, 000px)
    //   ...
    //   [content-end] minmax(0, 1fr)
    //   [full-end];
    return css`
      ${gridColumn}
      grid-gap: ${gapRem};
      grid-template-columns: ${gridTemplateColumns.map((col) => col.value)};
    `;
  };
}

const getGridProp = (grid, mdQuery) => {
  // Check if specific key exists.
  if (grid[`${mdQuery}Up`]) return grid[`${mdQuery}Up`];
  // xsmall and small share properties, therefore they can be reused.
  // However small is always mandatory.
  if (['xsmall', 'small'].includes(mdQuery)) {
    if (grid.smallUp) {
      return grid.smallUp;
    } else {
      throw 'Missing [small] definition in UniversalGridder';
    }
  }
  if (mdQuery === 'medium') {
    if (grid.mediumUp) {
      return grid.mediumUp;
    } else {
      throw 'Missing [medium] definition in UniversalGridder';
    }
  }
  // large and xlarge share properties, therefore they can be reused.
  // However large is always mandatory.
  if (['large', 'xlarge'].includes(mdQuery)) {
    if (grid.largeUp) {
      return grid.largeUp;
    } else {
      throw 'Missing [large] definition in UniversalGridder';
    }
  }
};

const UniversalGridder = styled.div`
  ${makeGrid(4, 'xsmall')}
  display: grid;

  ${media.smallUp`
    ${makeGrid(4, 'small')}
  `}

  ${media.mediumUp`
    ${makeGrid(8, 'medium')}
  `}

  ${media.largeUp`
    ${makeGrid(12, 'large')}
  `}

  ${media.xlargeUp`
    ${makeGrid(12, 'xlarge')}
  `}
`;

export default UniversalGridder;
