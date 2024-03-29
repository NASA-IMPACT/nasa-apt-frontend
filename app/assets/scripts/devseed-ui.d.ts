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
    /** Opacity: 0.02 */
    | 'color.baseAlphaA'
    /** Opacity: 0.04 */
    | 'color.baseAlphaB'
    /** Opacity: 0.08 */
    | 'color.baseAlphaC'
    /** Opacity: 0.16 */
    | 'color.baseAlphaD'
    /** Opacity: 0.32 */
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

  /**
   * Renders a wrapper for buttons to create a group
   */
  class ButtonGroup extends React.Component<ButtonGroupProps, any> {}

  interface ButtonGroupProps {
    /**
     * Orientation of the button group.
     */
    orientation: 'horizontal' | 'vertical';
  }
}

declare module '@devseed-ui/dropdown' {
  class DropContent extends React.Component<any, any> {}
  class DropTitle extends React.Component<any, any> {}
  class DropInset extends React.Component<any, any> {}

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
     * An id for the dropdown
     */
    id: string;

    /*
     * A function that returns a trigger element. The passed props must be
     * attached to the trigger element, which can be anything.
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
     * Sets opening direction of the dropdown
     */
    direction: 'up' | 'down' | 'left' | 'right';

    /*
     * Sets the alignment of the dropdown box. ['left' | 'center' | 'right'] can
     * only be used with ['up' | 'down'] directions. ['top' | 'middle' |
     * 'bottom'] can only be used with ['left' | 'right'] directions.
     */
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
  }
  export default class Dropdown extends React.Component<DropdownProps, any> {}
}

declare module '@devseed-ui/collecticons' {
  function collecticonsFont(): any;

  class CollecticonsGlobalStyle extends React.Component<any, any> {}

  /**
   * Function to get the collecticon for use in a styled component
   * @param name Name of the collecticon to show
   */
  export default function collecticon(name: string): any;
}

declare module '@devseed-ui/shadow-scrollbar' {
  interface ShadowScrollbarProps {
    /**
     * Variation for the top shadow.
     * @default light
     */
    topShadowVariation: 'light' | 'dark' | 'none';

    /**
     * Variation for the bottom shadow.
     * @default light
     */
    bottomShadowVariation: 'light' | 'dark' | 'none';

    /**
     * Variation for the left shadow.
     * @default light
     */
    leftShadowVariation: 'light' | 'dark' | 'none';

    /**
     * Variation for the right shadow.
     * @default light
     */
    rightShadowVariation: 'light' | 'dark' | 'none';

    /**
     * Props for `react-custom-scrollbars`.
     * See https://github.com/malte-wessel/react-custom-scrollbars/blob/master/docs/API.md
     */
    scrollbarsProps: any;
  }

  /**
   * Component to add custom scrollbars to ensure that they're consistent in all
   * browsers. It also includes shadows on the sides of the container to
   * indicate there's more content to scroll through. These shadows gradually
   * disappear when the user reaches the end of the content.
   */
  export default class ShadowScrollbar extends React.Component<
    ShadowScrollbarProps,
    any
  > {}
}

declare module '@devseed-ui/global-loading' {
  /**
   * Base component for the global loading
   * @param {object} props Component props
   */
  export default class GlobalLoadingProvider extends React.Component<
    any,
    any
  > {}

  interface GlobalLoadingHideProps {
    /**
     * Define how many loadings to show. This will not show multiple loadings
     * on the page but will increment a counter. This is helpful when there are
     * many actions that require a loading. The global loading will only be
     * dismissed once all counters shown are hidden. Each function call will
     * increment the counter. Default 1.
     */
    count: number;

    /**
     * Sets the count to the given value without incrementing. Default false.
     */
    force: boolean;
  }

  interface GlobalLoadingShowProps extends GlobalLoadingHideProps {
    /**
     * Sets an optional message to display. Default to empty.
     */
    message: string;
  }

  /**
   * Programmatic api to show a global loading.
   *
   * The <GlobalLoadingProvider> must be mounted.
   * The loading has a minimum visible time defined by the MIN_TIME constant.
   * This will prevent flickers in the interface when the action is very fast.
   *
   * @example
   * showGlobalLoading()
   * // Counter set to 1
   * showGlobalLoading({ count: 3 })
   * // Counter set to 4
   * hideGlobalLoading()
   * // Counter is now 3
   * hideGlobalLoading({ count: 3 })
   * // Counter is now 0 and the loading is dismissed.
   */
  function showGlobalLoading(options: GlobalLoadingShowProps): void;

  /**
   * Programmatic api to hide a global loading.
   *
   * The <GlobalLoadingProvider> must be mounted.
   *
   * @example
   * showGlobalLoading()
   * // Counter set to 1
   * showGlobalLoading({ count: 3 })
   * // Counter set to 4
   * hideGlobalLoading()
   * // Counter is now 3
   * hideGlobalLoading({ count: 3 })
   * // Counter is now 0 and the loading is dismissed.
   */
  function hideGlobalLoading(options: GlobalLoadingHideProps): void;

  /**
   * Programmatic api to show a global loading with a message.
   *
   * The <GlobalLoadingProvider> must be mounted.
   * Each call to showGlobalLoadingMessage will update the global loading message
   * but not increment the internal counter, show a single call to
   * hideGlobalLoading will dismiss it
   *
   * @param {string} message Message to display
   */
  function showGlobalLoadingMessage(message: string): void;

  /**
   * React component to show/hide a Global loading via mounting and unmounting.
   * If children are passed, they are used as a message, so it is recommended to
   * use a string.
   *
   * @param {*} props Component props
   */
  export class GlobalLoading extends React.Component<any, any> {}
}

declare module '@devseed-ui/form' {
  /**
   * Styled component function to apply the form control skin. Components
   * implementing this function will support `size`, `invalid` and
   * `stressed`props.
   */
  function controlSkin(): any;
  /**
   * Base <form>
   */
  export class Form extends React.Component<any, any> {}

  /**
   * Element to create the form group structure
   */
  export class FormGroup extends React.Component<any, any> {}
  /**
   * Element to create the form group structure header
   */
  export class FormGroupHeader extends React.Component<
    { isHidden: boolean },
    any
  > {}
  /**
   * Element to create the form group structure body
   */
  export class FormGroupBody extends React.Component<any, any> {}

  /**
   * Element to create the form fieldset structure
   */
  export class FormFieldset extends React.Component<any, any> {}
  /**
   * Element to create the form fieldset structure header
   */
  export class FormFieldsetHeader extends React.Component<any, any> {}
  /**
   * Element to create the form fieldset structure body
   */
  export class FormFieldsetBody extends React.Component<any, any> {}
  /**
   * Element to create the form fieldset structure legend
   */
  export class FormLegend extends React.Component<any, any> {}

  /**
   * Element to create the form helper structure
   */
  export class FormHelper extends React.Component<any, any> {}
  /**
   * Element to hold the helper message
   */
  export class FormHelperMessage extends React.Component<
    { invalid: boolean },
    any
  > {}
  /**
   * Counter component that changes color according to the passed values.
   */
  export class FormHelperCounter extends React.Component<
    {
      /* Current counter value */
      value: number;
      /* Max allowed values */
      max: number;
      /* At what point to warn the user the max is being reached. 90% of max by
    default. */
      warnAt: number;
    },
    any
  > {}

  /**
   * Component to create the label for the form field
   */
  export class FormLabel extends React.Component<any, any> {}

  // Form structure example
  // <FormGroup>
  //   <FormGroupHeader>
  //     <FormLabel htmlFor='field id'>
  //       Label here
  //     </FormLabel>
  //   </FormGroupHeader>
  //   <FormGroupBody>
  //     Field here
  //     <FormHelper>
  //       <FormHelperMessage>message here</FormHelperMessage>
  //     </FormHelper>
  //   </FormGroupBody>
  // </FormGroup>

  export class FormCheckable extends React.Component<any, any> {}
  export class FormCheckableGroup extends React.Component<any, any> {}
  export class FormInput extends React.Component<any, any> {}
  export class FormSelect extends React.Component<any, any> {}
  export class FormTextarea extends React.Component<any, any> {}
  export class FormSwitch extends React.Component<any, any> {}
}

declare module '@devseed-ui/accordion' {
  export class AccordionFoldContainer extends React.Component<any, any> {}
  export class AccordionFoldHeader extends React.Component<any, any> {}
  export class AccordionFoldHeadline extends React.Component<any, any> {}
  export class AccordionFoldToolbar extends React.Component<any, any> {}
  export class AccordionFoldBody extends React.Component<any, any> {}
  export class AccordionFoldBodyInner extends React.Component<any, any> {}
  export class ToggleButton extends React.Component<any, any> {}

  export class Accordion extends React.Component<
    {
      /* Number of folds to be controlled */
      foldCount: number;
      /* Whether or not to allow multiple open folds at the same time */
      allowMultiple: boolean;
      /* Initial state for the folds */
      initialState: [boolean];
    },
    any
  > {}

  type renderFunction = (bag: {
    /* Whether or not this fold is expanded. */
    isFoldExpanded: boolean;
    /* Method to change the fold state by passing a boolean with the new state. */
    setFoldExpanded: (value: boolean) => void;
  }) => any;

  // According fold without overrides:
  // <AccordionFoldSelf>
  //   <AccordionFoldHeader>
  //     <AccordionFoldTrigger>
  //       <h1 />
  //     </AccordionFoldTrigger>
  //   </AccordionFoldHeader>
  //   <AccordionFoldBody>
  //     <AccordionFoldBodyInner />
  //   </AccordionFoldBody>
  // </AccordionFoldSelf>
  export class AccordionFold extends React.Component<
    {
      /* An id for the fold. */
      id: string;
      /* Classname for the fold. */
      className: string;
      /* Title to use on the fold header. Required unless renderHeader is being used. */
      title: string;
      /* Content for the fold. Required unless renderBody is being used. */
      content: any;
      /* Whether or not this fold is expanded. */
      isFoldExpanded: boolean;
      /* Callback for the fold header. Will be called with the a boolean indicating the new fold state. */
      setFoldExpanded: (value: boolean) => void;
      /* Overrides the fold header element. Anything returned by this function is rendered instead of `AccordionFoldHeader`. */
      renderHeader: renderFunction;
      /* Overrides the fold body element. Anything returned by this function is rendered instead of `AccordionFoldBodyInner`. */
      renderBody: renderFunction;
    },
    any
  > {}
}
