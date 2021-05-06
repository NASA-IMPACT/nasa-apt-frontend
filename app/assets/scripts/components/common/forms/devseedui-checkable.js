import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import collecticon from '@devseed-ui/collecticons';

import {
  disabled,
  rgba,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';

/**
 * Renders a FormCheckable component.
 *
 * @param {string} type Determines the type of input to render. Can be one of
 *                      `checkbox` or `radio`
 * @param {string} name (html prop) name to be used as `name` prop of
 *                      the element
 * @param {string} id (html prop) id to be used as `id` prop of the element
 * @param {string} title (html prop) Label's title attribute
 * @param {boolean} checked Whether or not the FormCheckable is checked
 * @param {func} onChange Change callback for the FormCheckable
 * @param {node} children Textual content
 * @param {string} textPlacement Where to position the text. `left` or `right`
 *                  of the control. Default to `right`
 */
const FormCheckableElement = (props) => {
  const {
    children,
    id,
    name,
    title,
    type,
    checked,
    onChange,
    className,
    textPlacement,
    hideText,
    value,
    // Prevent reaching the DOM.
    /* eslint-disable-next-line  react/prop-types, no-unused-vars */
    invalid,
    ...rest
  } = props;

  return (
    <label htmlFor={id} className={className} title={title} {...rest}>
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {textPlacement === 'right' && <FormCheckableControl />}
      <FormCheckableText hideText={hideText}>{children}</FormCheckableText>
      {textPlacement === 'left' && <FormCheckableControl />}
    </label>
  );
};

FormCheckableElement.propTypes = {
  name: T.string.isRequired,
  id: T.string.isRequired,
  textPlacement: T.string,
  hideText: T.bool,
  className: T.string,
  title: T.string,
  type: T.oneOf(['checkbox', 'radio']),
  checked: T.bool,
  value: T.oneOfType([T.string, T.number]),
  children: T.node.isRequired,
  onChange: T.func
};

FormCheckableElement.defaultProps = {
  textPlacement: 'right'
};

const formCheckableWrapper = css`
  display: inline-grid;
  grid-auto-columns: max-content;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  cursor: pointer;
  vertical-align: top;

  input {
    flex: none;
  }
`;

const FormCheckableText = styled.span`
  line-height: 1.5;

  /* Hide Text */
  ${({ hideText }) => hideText && visuallyHidden()}
`;

const FormCheckableControl = styled.span`
  position: relative;
  transition: all 0.16s ease 0s;
`;

export const FormCheckable = styled(FormCheckableElement)`
  ${formCheckableWrapper}

  input {
    ${visuallyHidden()}
  }

  ${FormCheckableControl} {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.125rem 0;
    height: 1.25rem;
    width: 1.25rem;
    background: ${themeVal('color.surface')};
    line-height: 1;
    border: ${themeVal('layout.border')} solid
      ${rgba(themeVal('color.base'), 0.16)};
    border-radius: ${({ type }) =>
      type === 'checkbox'
        ? themeVal('shape.rounded')
        : themeVal('shape.ellipsoid')};

    &::before {
      transition: all 0.24s ease 0s;
      opacity: 0;
      ${({ type }) =>
        type === 'checkbox'
          ? css`
              ${collecticon('tick--small')}
            `
          : css`
              content: '';
              height: 0.5rem;
              width: 0.5rem;
              background: ${themeVal('color.base')};
              border-radius: ${themeVal('shape.ellipsoid')};
            `}
    }
  }

  &:hover ${FormCheckableControl} {
    border-width: ${themeVal('layout.border')};
    border-color: ${rgba(themeVal('color.base'), 0.32)};
  }

  ${({ invalid }) =>
    invalid &&
    css`
      ${FormCheckableControl} {
        border-width: ${themeVal('layout.border')};
        border-color: ${themeVal('color.danger')};
      }
      &:hover
        ${FormCheckableControl},
        &:focus
        ${FormCheckableControl},
        &:active
        ${FormCheckableControl} {
        border-color: ${themeVal('color.danger')};
      }
    `}

  input:focus ~ ${FormCheckableControl},
  input:active ~ ${FormCheckableControl} {
    outline: 0;
    border-width: ${themeVal('layout.border')};
    border-color: ${rgba(themeVal('color.base'), 0.64)};
  }

  ${({ checked }) => (checked ? `${FormCheckableControl},` : '')}
  input:checked ~ ${FormCheckableControl} {
    &::before {
      opacity: 1;
    }
  }

  &[disabled] {
    ${disabled()}
  }
`;
