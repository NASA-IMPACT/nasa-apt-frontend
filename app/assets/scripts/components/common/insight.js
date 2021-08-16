import React from 'react';
import T from 'prop-types';
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

export default function Insight(props) {
  const { id, total, value, description, segmentColor, a11y } = props;
  const theme = useTheme();

  // We want the circumference to be 100 because of the dasharray calculations.
  const radius = 100 / (2 * Math.PI);
  const boxSize = 40;
  const percent = (value / total) * 100;
  const empty = 100 - percent;

  return (
    <InsightSelf>
      <InsightChart>
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${boxSize} ${boxSize}`}
          aria-labelledby={`docs-${id}-title docs-${id}-desc`}
          role='img'
        >
          <title id={`docs-${id}-title`}>{a11y?.title({ value, total })}</title>
          <desc id={`docs-${id}-desc`}>
            {a11y?.description({ value, total })}
          </desc>
          <circle
            cx={boxSize / 2}
            cy={boxSize / 2}
            r={radius}
            fill='transparent'
            stroke={theme.color.baseAlphaC}
            strokeWidth='2'
            role='presentation'
          />
          <circle
            cx={boxSize / 2}
            cy={boxSize / 2}
            r={radius}
            fill='transparent'
            stroke={segmentColor}
            strokeWidth='2'
            strokeDasharray={`${percent} ${empty}`}
            strokeDashoffset='25'
            aria-labelledby={`docs-${id}-donut-segment-title docs-${id}-donut-segment-desc`}
          >
            <title id={`docs-${id}-donut-segment-title`}>
              {a11y?.segmentTitle({ value, total })}
            </title>
            <desc id={`docs-${id}-donut-segment-desc`}>
              {a11y?.segmentDescription({ value, total })}
            </desc>
          </circle>
          <ChartText>{value}</ChartText>
        </svg>
      </InsightChart>
      <InsightCaption>{description}</InsightCaption>
    </InsightSelf>
  );
}

Insight.propTypes = {
  id: T.string,
  segmentColor: T.string,
  total: T.number,
  value: T.number,
  description: T.string,
  a11y: T.object
};
