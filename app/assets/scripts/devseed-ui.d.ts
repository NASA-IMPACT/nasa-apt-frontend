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
  type headingAlt = () => any;
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
