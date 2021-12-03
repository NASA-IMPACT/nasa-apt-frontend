import defaultsDeep from 'lodash.defaultsdeep';
import { rgba } from 'polished';

export function themeOverridesAPT(uiTheme) {
  const baseColor = '#2c3e50';
  const primaryColor = '#2276ac';

  return defaultsDeep(
    {
      color: {
        base: baseColor,
        baseDark: baseColor,
        primary: primaryColor,
        secondary: '#17557c',
        link: primaryColor,
        baseAlphaA: rgba(baseColor, 0.02),
        baseAlphaB: rgba(baseColor, 0.04),
        baseAlphaC: rgba(baseColor, 0.08),
        baseAlphaD: rgba(baseColor, 0.16),
        baseAlphaE: rgba(baseColor, 0.32),
        baseAlphaF: rgba(baseColor, 0.64),
        statusDraft: '#fcab10',
        statusReview: '#f4442e',
        statusPublication: '#2ca58d',
        statusPublished: primaryColor
      },
      type: {
        base: {
          color: baseColor,
          weight: '400',
          extrabold: '800'
        }
      },
      layout: {
        // The gap is defined as a multiplier of the layout.space
        // The elements that use the gap should use it as a parameter for the glsp function
        gap: {
          xsmall: 1,
          small: 1,
          medium: 2,
          large: 2,
          xlarge: 3
        }
      }
    },
    uiTheme
  );
}
