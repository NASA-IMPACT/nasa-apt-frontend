import React from 'react';
import styled, { useTheme } from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { headingAlt } from '@devseed-ui/typography';

const InsightSelf = styled.figure`
  display: flex;
  flex-flow: column;
`;

const InsightChart = styled.div`
  background: transparent;
`;

const ChartText = styled.text.attrs({
  x: '50%',
  y: '50%',
  dominantBaseline: 'central'
})`
  font-family: ${themeVal('type.base.family')};
  font-weight: ${themeVal('type.base.bold')};
  font-size: 0.65em;
  line-height: 1;
  fill: ${themeVal('type.base.color')};
  text-anchor: middle;
`;

const InsightCaption = styled.figcaption`
  ${headingAlt()}
  text-align: center;
`;

export default function Insight() {
  const theme = useTheme();

  return (
    <InsightSelf>
      <InsightChart>
        <svg
          width='100%'
          height='100%'
          viewBox='0 0 42 42'
          aria-labelledby='docs-draft-title docs-draft-desc'
          role='img'
        >
          <title id='docs-draft-title'>Documents in draft</title>
          <desc id='docs-draft-desc'>
            Donut chart showing the percentage of documents in draft.
          </desc>
          <circle
            cx='21'
            cy='21'
            r='15.91549430918954'
            fill='transparent'
            stroke={theme.color.baseAlphaC}
            strokeWidth='3'
            role='presentation'
          />
          <circle
            cx='21'
            cy='21'
            r='15.91549430918954'
            fill='transparent'
            stroke={theme.color.primary}
            strokeWidth='3'
            strokeDasharray='25 75'
            strokeDashoffset='25'
            aria-labelledby='docs-draft-donut-segment-title docs-draft-donut-segment-desc'
          >
            <title id='docs-draft-donut-segment-title'>Draft</title>
            <desc id='docs-draft-donut-segment-desc'>
              Blue chart segment spanning 25% of the whole, which correspond to
              80 documents in draft out of 200 total.
            </desc>
          </circle>
          <ChartText>80</ChartText>
        </svg>
      </InsightChart>
      <InsightCaption>Draft</InsightCaption>
    </InsightSelf>
  );
}
