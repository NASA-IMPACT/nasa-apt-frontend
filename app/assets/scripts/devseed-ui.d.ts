type FnNoParam = () => any;

declare module '@devseed-ui/theme-provider' {
  /**
   * Applies anti-aliasing to font rendering, making the text more readable and
   * pleasing to the eye. Webkit and mozilla specific.
   */
  function antialiased(): any;
  /**
   * Hides elements visually, but preserving its accessibility to screen readers
   * or crawlers. Useful for semantic solutions.
   */
  function visuallyHidden(): any;
  /**
   * Removes default list (`ul` and `ol`) styling. Say goodbye to default
   * padding, margin, and bullets/numbers.
   */
  function listReset(): any;
  /**
   * Truncates a text string and applies ellipsis. Requires a declared width
   * value.
   */
  function truncated(): any;
  /**
   * Applies disabled styles to an element, and disabled pointer events.
   */
  function visuallyDisabled(): any;
  /**
   * The same behavior as `disabled`, but the pointer events remain active. This
   * is useful when, for example, paired with a tooltip that needs the `hover`
   * event to fire.
   */
  function disabled(): any;
  /**
   * Constrains element content to its declared height, preventing vertical
   * scrolling.
   */
  function unscrollableY(): any;
  /**
   * Constrains element content to its declared width, preventing horizontal
   * scrolling.
   */
  function unscrollableX(): any;
  /**
   * Creates a math function to add values. It takes into account
   * only the unit of the first value. Eg: 2rem + 2 = 4rem | 2 + 2rem = 4
   * This function is ready to work with styled-components so that any function
   * passed as an argument will receive the component props.
   *
   * @param {string} a First value
   * @param {string} b Second value
   */
  function add<T extends number | string>(a: T, b: number | string): T;
  /**
   * Creates a math function to subtract values. It takes into account
   * only the unit of the first value. Eg: 4rem - 2 = 2rem | 4 - 2rem = 2
   * This function is ready to work with styled-components so that any function
   * passed as an argument will receive the component props.
   *
   * @param {string} a First value
   * @param {string} b Second value
   */
  function subtract<T extends number | string>(a: T, b: number | string): T;
  /**
   * Creates a math function to divide values. It takes into account
   * only the unit of the first value. Eg: 4rem / 2 = 2rem | 4 / 2rem = 2
   * This function is ready to work with styled-components so that any function
   * passed as an argument will receive the component props.
   *
   * @param {string} a First value
   * @param {string} b Second value
   */
  function divide<T extends number | string>(a: T, b: number | string): T;
  /**
   * Creates a math function to multiply values. It takes into account
   * only the unit of the first value. Eg: 2rem * 2 = 4rem | 2 * 2rem = 4
   * This function is ready to work with styled-components so that any function
   * passed as an argument will receive the component props.
   *
   * @param {string} a First value
   * @param {string} b Second value
   */
  function multiply<T extends number | string>(a: T, b: number | string): T;
  /**
   * Creates a math function that returns the minimum of two values. Units are
   * discarded when doing the comparison, but the value is returned with a unit
   * if both arguments has the same one or if only one has it.
   * Eg: 10px, 3px => 3px
   * Eg: 10px, 3 => 3px
   * Eg: 1rem, 3px => 1
   *
   * This function is ready to work with styled-components
   * so that any function passed as an argument will receive the component props.
   *
   * @param {string} a First value
   * @param {string} b Second value
   */
  function min<T extends number | string>(a: T, b: number | string): T;
  /**
   * Creates a math function that returns the maximum of two values. Units are
   * discarded when doing the comparison, but the value is returned with a unit
   * if both arguments has the same one or if only one has it.
   * Eg: 10px, 3px => 10px
   * Eg: 10px, 3 => 10px
   * Eg: 1rem, 3px => 3
   *
   * This function is ready to work with styled-components
   * so that any function passed as an argument will receive the component props.
   *
   * @param {string} a First value
   * @param {string} b Second value
   */
  function max<T extends number | string>(a: T, b: number | string): T;

  type ThemeValPath =
    | 'color.baseLight'
    | 'color.baseDark'
    | 'color.primary'
    | 'color.secondary'
    | 'color.tertiary'
    | 'color.quaternary'
    | 'color.base'
    | 'color.background'
    | 'color.surface'
    | 'color.link'
    | 'color.danger'
    | 'color.warning'
    | 'color.success'
    | 'color.info'
    | 'color.baseAlphaA'
    | 'color.baseAlphaB'
    | 'color.baseAlphaC'
    | 'color.baseAlphaD'
    | 'color.baseAlphaE'
    | 'color.silkLight'
    | 'color.silkDark'
    | 'type.base.root'
    | 'type.base.size'
    | 'type.base.line'
    | 'type.base.color'
    | 'type.base.family'
    | 'type.base.style'
    | 'type.base.settings'
    | 'type.base.case'
    | 'type.base.light'
    | 'type.base.regular'
    | 'type.base.medium'
    | 'type.base.bold'
    | 'type.base.weight'
    | 'type.base.antialiasing'
    | 'type.heading.family'
    | 'type.heading.style'
    | 'type.heading.settings'
    | 'type.heading.case'
    | 'type.heading.light'
    | 'type.heading.regular'
    | 'type.heading.medium'
    | 'type.heading.bold'
    | 'type.heading.weight'
    | 'type.button.family'
    | 'type.button.style'
    | 'type.button.settings'
    | 'type.button.case'
    | 'type.button.weight'
    | 'shape.rounded'
    | 'shape.ellipsoid'
    | 'layout.space'
    | 'layout.border'
    | 'layout.min'
    | 'layout.max'
    | 'boxShadow.inset'
    | 'boxShadow.input'
    | 'boxShadow.elevationA'
    | 'boxShadow.elevationB'
    | 'boxShadow.elevationC'
    | 'boxShadow.elevationD'
    | 'mediaRanges.xsmall'
    | 'mediaRanges.small'
    | 'mediaRanges.medium'
    | 'mediaRanges.large'
    | 'mediaRanges.xlarge';
  /**
   * Returns a function to be used with styled-components and gets a value from
   * the theme property.
   *
   * @param {string} path The path to get from theme
   */
  function themeVal(path: ThemeValPath): FnNoParam;
  /**
   * Allows a function to be used with style-components interpolation, passing the
   * component props to each one of the functions arguments if those arguments are
   * functions.
   *
   * Useful in conjunction with themeVal. Instead of:
   * ${(props) => rgba(props.theme.colors.primaryColor, 0.16)}
   * you can do
   * ${rgbaFn(themeVal('colors.primaryColor'), 0.16)}
   *
   * @param {function} fn The function to wrap.
   *
   * @returns {function} Curried function
   */
  function stylizeFunction(fn: FnNoParam): FnNoParam;
  /**
   * Returns the layout.space value form the theme multiplied by the
   * given multiplier.
   *
   * @param {number} m multiplier
   */
  function glsp(...multiplier: number[]): FnNoParam;
  /**
   * Polished rgba function but stylized.
   */
  function rgba(fn: FnNoParam): FnNoParam;
}

declare module '@devseed-ui/typography' {
  class Heading extends React.Component<HeadingProps, any> {}

  interface HeadingProps {
    size:
      | 'xxsmall'
      | 'xsmall'
      | 'small'
      | 'medium'
      | 'large'
      | 'xlarge'
      | 'xxlarge'
      | 'jumbo';
    useAlt: Boolean;
    variation: 'base' | 'primary' | 'secondary';
  }

  /**
   * Styled components function to create an heading in alternative style.
   */
  function headingAlt(): FnNoParam;
}

declare module '@devseed-ui/button' {
  /**
   * Renders a Button element with a span inside it.
   */
  class Button extends React.Component<ButtonProps, any> {}

  interface ButtonProps {
    /**
     * Button variation to render.
     */
    variation:
      | 'primary-raised-light'
      | 'primary-raised-semidark'
      | 'primary-raised-dark'
      | 'primary-plain'
      | 'danger-raised-light'
      | 'danger-raised-dark'
      | 'danger-plain'
      | 'success-raised-light'
      | 'success-raised-dark'
      | 'success-plain'
      | 'achromic-plain'
      | 'achromic-glass'
      | 'base-raised-light'
      | 'base-raised-semidark'
      | 'base-raised-dark'
      | 'base-plain';
    /**
     * The value for the box. One of "small" | "medium" | "large" | "xlarge"
     */
    size: 'small' | 'medium' | 'large' | 'xlarge';
    /**
     * The value for the radius. One of "ellipsoid" | "square" | "rounded"
     */
    radius: 'ellipsoid' | 'square' | 'rounded';
    /**
     * The value for the box. One of "block" | "semi-fluid" | null
     */
    box: 'block' | 'semi-fluid' | null;
    /**
     * Whether the button is in an active state.
     */
    active: Boolean;
    /**
     * Whether the button text should be hidden.
     */
    hideText: Boolean;
    /**
     * Whether the button should be disabled.
     */
    disabled: Boolean;
    /**
     * Whether the button should be visually disabled. A visually disabled
     * button looks disabled but retains the mouse events. This is useful to
     * trigger tooltips on hover.
     */
    visuallyDisabled: Boolean;
    /**
     * The value for the icon. Has to be the name of a collecticon. If an array
     * is used instead of a string, the first position is the name of the icon,
     * and the second the position ("before" | "after").
     */
    useIcon: string | [iconName: string, position: 'before' | 'after'];
  }
}

declare module '@devseed-ui/dropdown' {
  class DropContent extends React.Component<any> {}
  class DropTitle extends React.Component<any> {}
  class DropInset extends React.Component<any> {}

  interface DropMenuProps {
    selectable?: Boolean;
    iconified?: Boolean;
  }
  class DropMenu extends React.Component<DropMenuProps, any> {}

  interface DropMenuItemProps {
    active?: Boolean;
    useIcon?: String;
    'data-dropdown'?: 'click.close';
  }
  class DropMenuItem extends React.Component<DropMenuItemProps, any> {}

  interface DropdownProps {
    /*
     * An id for the dropdown"
     */
    id: string;

    /*
     * A function that returns a trigger element. The passed props must be
     * attached to the trigger element, which can be anything."
     */
    triggerElement: (triggerProps: {
      ref: object;
      onClick: (event: any) => any;
      active: Boolean;
      className: string;
      'data-drop-el': 'trigger';
      'data-drop-instance': string;
    }) => any;

    /*
     * Sets opening direction of the dropdown"
     */
    direction: 'up' | 'down' | 'left' | 'right';

    /*
     * Sets the alignment of the dropdown box. ['left' | 'center' | 'right'] can
     * only be used with ['up' | 'down'] directions. ['top' | 'middle' |
     * 'bottom'] can only be used with ['left' | 'right'] directions."
     */
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
  }
  export default class Dropdown extends React.Component<DropdownProps, any> {}
}
