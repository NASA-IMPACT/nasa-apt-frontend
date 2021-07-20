import React, { useState } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import { glsp, media, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';
// import SmartLink from '../components/smart-link';

export const Card = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
  padding: ${glsp(themeVal('layout.gap.xsmall'))};
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  min-height: 8rem;
  overflow: hidden;
  transition: all 0.24s ease-in-out 0s;

  ${media.mediumUp`
    padding: ${glsp(themeVal('layout.gap.medium'))};
    grid-gap: ${glsp(themeVal('layout.gap.medium'))};
  `}

  ${media.largeUp`
    padding: ${glsp(themeVal('layout.gap.large'))};
    grid-gap: ${glsp(themeVal('layout.gap.large'))};
  `}

  > *:not(a) {
    position: relative;
    z-index: 3;
    pointer-events: none;
  }

  ${({ isExternal }) =>
    isExternal &&
    css`
      &::after {
        ${collecticon('expand-top-right')}
        position: absolute;
        top: 0;
        right: 0;
        z-index: 4;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        width: 3.5rem;
        height: 3.5rem;
        color: ${themeVal('color.surface')};
        line-height: 1;
        background: ${themeVal('color.link')};
        padding: ${glsp(0.5)};
        clip-path: polygon(100% 0, 0 0, 100% 100%);
        pointer-events: none;
      }
    `}
`;

export const CardHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(0.25)};

  ${media.mediumUp`
    grid-gap: ${glsp(0.5)};
  `}
`;

export const CardHeadline = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(0.5)};
`;

export const CardTitle = styled(Heading)`
  font-size: 1rem;
  line-height: 1.25rem;
  margin: 0;

  ${media.mediumUp`
    font-size: 1.25rem;
    line-height: 1.75rem;
  `}
`;

export const CardHgroup = styled.div`
  display: inline-grid;
  grid-auto-columns: minmax(min-content, max-content);
  grid-gap: ${glsp(1.25)};
  align-items: center;
  min-width: 0px;

  > * {
    grid-row: 1;
  }
`;

export const CardDetails = styled.p`
  font-size: 0.875rem;
  line-height: 1rem;
  margin: 0;
`;

export const CardMedia = styled.figure`
  grid-row: 1;
  margin-top: ${glsp(-0.5)};
  margin-left: ${glsp(-0.5)};
  margin-right: ${glsp(-0.5)};

  ${media.mediumUp`
    margin-top: ${glsp(-1)};
    margin-left: ${glsp(-1)};
    margin-right: ${glsp(-1)};
  `}
`;

export const CardMediaThumb = styled.div`
  position: relative;
  min-height: 3rem;
  background: ${themeVal('color.baseAlphaB')};
  border-radius: ${themeVal('shape.rounded')};
  overflow: hidden;

  &::after {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    pointer-events: none;
    box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaC')};
    border-radius: inherit;
  }

  img {
    position: relative;
    z-index: 1;
    display: block;
    margin: 0;
    max-width: 100%;
    height: auto;
  }
`;

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(0.25)};
`;

export const CardExcerpt = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  opacity: 0.64;

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const CardFooter = styled.footer`
  display: flex;

  > * {
    flex-grow: 1;
    margin-right: ${glsp(0.75)};
  }
`;

// export const CardLink = styled(SmartLink)`
//   position: absolute;
//   z-index: 1;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   pointer-events: auto;
//   font-size: 0;
//   background: transparent;
//   margin: 0;

//   &:hover {
//     opacity: 1;
//   }
// `;

// // // // // // // // // // // // // // // // // // // // // // // // // // //
// React components for the different card types.
// // // // // // // // // // // // // // // // // // // // // // // // // // //

const CardEvented = styled(Card)`
  ${({ isStateFocus }) =>
    isStateFocus &&
    css`
      box-shadow: ${themeVal('boxShadow.elevationC')};
      transform: translate(0, 0.125rem);
    `}
  ${({ isStateOver }) =>
    isStateOver &&
    css`
      box-shadow: ${themeVal('boxShadow.elevationC')};
      transform: translate(0, 0.125rem);
    `}
  ${({ isStateActive }) =>
    isStateActive &&
    css`
      box-shadow: ${themeVal('boxShadow.elevationB')};
      transform: translate(0, 0.125rem);
    `}
`;

/**
 * Adds events to the card link that add properties to the card wrapper. Because
 * there may be links in the card, the card itself can't be link. The list
 * itself is positioned on top of the card, so we need it's events (hover,
 * focus, press) to be sent to the parent card to be able to style it
 *
 * @param {Object} props Component properties
 * @param {React node} props.children Elements to render inside the card
 * @param {String} props.linkTo To property for the link
 * @param {String} props.linkTitle Title attribute of the link
 * @param {String} props.linkLabel Label of the link
 */
export const CardInteractive = (props) => {
  const {
    children,
    linkTo,
    linkTitle,
    linkLabel,
    onClickCapture,
    linkProps = {},
    ...rest
  } = props;
  const [isStateOver, setStateOver] = useState(false);
  const [isStateActive, setStateActive] = useState(false);
  const [isStateFocus, setStateFocus] = useState(false);

  return (
    <CardEvented
      {...rest}
      onClickCapture={onClickCapture}
      isStateOver={isStateOver}
      isStateActive={isStateActive}
      isStateFocus={isStateFocus}
    >
      {children}
      <CardLink
        to={linkTo}
        title={linkTitle}
        {...linkProps}
        onMouseDown={() => setStateActive(true)}
        onMouseUp={() => setStateActive(false)}
        onMouseEnter={() => setStateOver(true)}
        onMouseLeave={() => {
          setStateOver(false);
          setStateActive(false);
        }}
        onFocus={() => setStateFocus(true)}
        onBlur={() => setStateFocus(false)}
      >
        {linkLabel}
      </CardLink>
    </CardEvented>
  );
};

CardInteractive.propTypes = {
  children: T.node,
  onClickCapture: T.func,
  linkTo: T.string,
  linkTitle: T.string,
  linkLabel: T.string,
  linkProps: T.object
};
