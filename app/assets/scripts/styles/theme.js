import defaultsDeep from 'lodash.defaultsdeep';

export function themeOverridesAPT(uiTheme) {
  return defaultsDeep(
    {
      color: {
        baseDark: '#323232',
        primary: '#2276AC',
        secondary: '#2c3e50'
      },
      layout: {
        // The gap is defined as a multiplier of the layout.space
        // The elements that use the gap should use it as a parameter for the glsp function
        gap: {
          xsmall: 1,
          small: 2,
          medium: 2,
          large: 2,
          xlarge: 3
        }
      }
    },
    uiTheme
  );
}
