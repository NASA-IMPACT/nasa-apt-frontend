import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Popper } from 'react-popper';
import styled from 'styled-components/macro';
import collecticon from '../styles/collecticons';
import Button from '../styles/button/button';
import ButtonGroup from '../styles/button/group';

const activeVariation = 'base-raised-semidark';
const baseVariation = 'base-raised-light';

const ActionsContainer = styled.div`
  z-index: 10000;
`;

const FixedWidthButton = styled(Button)`
  width: 3rem;
`;

const LinkButton = styled(FixedWidthButton).attrs({ hideText: true })`
  ::before {
    ${collecticon('link')}
    line-height: 1;
    vertical-align: middle;
  }
`;

const buttonConfig = [
  {
    display: <strong>B</strong>,
    mark: 'bold',
    el: FixedWidthButton
  },
  {
    display: <em>i</em>,
    mark: 'italic',
    el: FixedWidthButton
  },
  {
    display: <u>u</u>,
    mark: 'underline',
    el: FixedWidthButton
  },
  {
    display: <span>x&#178;</span>,
    mark: 'superscript',
    el: FixedWidthButton
  },
  {
    display: <span>x&#8322;</span>,
    mark: 'subscript',
    el: FixedWidthButton
  },
  {
    display: 'Add a link',
    mark: 'link',
    el: LinkButton
  }
];

class FormatTextToolbar extends React.Component {
  renderFormatOptions() {
    const { value, onButtonClick, activeFormatters } = this.props;

    const activeMarks = Array.from(value.activeMarks).map(Mark => Mark.type);

    const btns = activeFormatters.length
      ? buttonConfig.filter(btn => activeFormatters.includes(btn.mark))
      : buttonConfig;

    return (
      <ButtonGroup orientation="horizontal">
        {btns.map(btn => (
          <btn.el
            key={btn.mark}
            onClick={(e) => {
              e.preventDefault();
              onButtonClick(btn.mark);
            }}
            variation={
              activeMarks.indexOf(btn.mark) >= 0 && btn.mark !== 'link'
                ? activeVariation
                : baseVariation
            }
          >
            {btn.display}
          </btn.el>
        ))}
      </ButtonGroup>
    );
  }

  render() {
    const { range } = this.props;
    // Check is a range exists and if something is selected
    if (!range || !range.getBoundingClientRect().width) return null;

    return (
      <Popper referenceElement={range} placement="top-center">
        {({
          ref, style, placementA, arrowProps
        }) => (
          <div
            id="format-toolbar"
            ref={ref}
            style={{ ...style, zIndex: 100 }}
            data-placement={placementA}
          >
            <ActionsContainer>{this.renderFormatOptions()}</ActionsContainer>
            <div ref={arrowProps.ref} style={arrowProps.style} />
          </div>
        )}
      </Popper>
    );
  }
}

FormatTextToolbar.propTypes = {
  range: T.object,
  activeFormatters: T.array,
  onButtonClick: T.func.isRequired,
  value: T.object.isRequired
};

FormatTextToolbar.defaultProps = {
  activeFormatters: []
};

export default FormatTextToolbar;
