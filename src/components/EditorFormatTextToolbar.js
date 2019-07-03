import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Popper } from 'react-popper';
import styled from 'styled-components/macro';
import collecticon from '../styles/collecticons';
import FormInput from '../styles/form/input';
import Button from '../styles/button/button';
import ButtonGroup from '../styles/button/group';

const activeVariation = 'base-raised-semidark';
const baseVariation = 'base-raised-light';
const ActionsContainer = styled.div`
  z-index: 10000;
`;
const buttonConfig = [
  {
    display: <strong>B</strong>,
    mark: 'bold'
  },
  {
    display: <em>i</em>,
    mark: 'italic'
  },
  {
    display: <u>u</u>,
    mark: 'underline'
  },
  {
    display: <span>x&#178;</span>,
    mark: 'superscript'
  },
  {
    display: <span>x&#8322;</span>,
    mark: 'subscript'
  }
];
const FixedWidthButton = styled(Button)`
  width: 3rem;
`;
const LinkButton = styled(FixedWidthButton)`
  ::before {
    ${collecticon('link')}
    line-height: 1;
    vertical-align: middle;
  }
`;

const UrlInput = styled(FormInput)`
  width: 20rem;
`;

class FormatTextToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUrlEditor: false,
      urlValue: '',
      lastSelectedRange: null
    };
    this.setUrlEditor = this.setUrlEditor.bind(this);
    this.insertLink = this.insertLink.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.input = React.createRef();
  }

  componentDidUpdate(_, prevState) {
    const { isUrlEditor } = this.state;
    if (isUrlEditor && !prevState.isUrlEditor) {
      // Focus the input after rendering it
      this.input.current.focus();
    }
  }

  setUrlEditor(isUrlEditor) {
    const { range: lastSelectedRange } = this.props;
    this.setState({ isUrlEditor, lastSelectedRange });
  }

  insertLink() {
    const { insertLink } = this.props;
    const { urlValue } = this.state;
    insertLink(urlValue);
  }

  handleKeyPress(e) {
    const { keyCode } = e;
    // enter
    if (keyCode === 13) {
      e.preventDefault();
      this.insertLink();
      this.setState({ isUrlEditor: false, urlValue: '' });
    }
  }

  renderUrlEditor() {
    const { urlValue } = this.state;
    return (
      <UrlInput
        type="text"
        id="url-editor"
        size="large"
        placeholder="Enter a URL"
        value={urlValue}
        onChange={(e) => {
          this.setState({ urlValue: e.currentTarget.value });
        }}
        onKeyDown={this.handleKeyPress}
        onBlur={() => {
          this.setState({ isUrlEditor: false, urlValue: '' });
        }}
        ref={this.input}
      />
    );
  }

  renderFormatOptions() {
    const { value, toggleMark } = this.props;
    const { setUrlEditor } = this;

    const activeMarks = Array.from(value.activeMarks).map(Mark => Mark.type);

    return (
      <ButtonGroup orientation="horizontal">
        {buttonConfig.map(config => (
          <FixedWidthButton
            key={config.mark}
            onClick={() => toggleMark(config.mark)}
            variation={
              activeMarks.indexOf(config.mark) >= 0
                ? activeVariation
                : baseVariation
            }
          >
            {config.display}
          </FixedWidthButton>
        ))}
        <LinkButton
          key="link"
          hideText
          variation={baseVariation}
          onClick={() => setUrlEditor(true)}
        >
          Add a link
        </LinkButton>
      </ButtonGroup>
    );
  }

  render() {
    const { isUrlEditor, lastSelectedRange } = this.state;
    const { range: currentRange } = this.props;
    let referenceElement;

    if (isUrlEditor) {
      // If the popup is set to be displayed the URL editor should  use the
      // last selected range, otherwise the popup will not a reference for
      // positioning.
      referenceElement = lastSelectedRange;
    } else {
      // If the toolbar is set to be displayed get the current range
      referenceElement = currentRange;

      // Check is a range exists
      if (!referenceElement) return null;

      // If so, check if something is selected
      const { width } = referenceElement.getBoundingClientRect();
      if (width === 0) return null;
    }

    return (
      <Popper referenceElement={referenceElement} placement="top-center">
        {({
          ref, style, placementA, arrowProps
        }) => (
          <div
            ref={ref}
            style={{ ...style, zIndex: 100 }}
            data-placement={placementA}
          >
            <ActionsContainer>
              {isUrlEditor
                ? this.renderUrlEditor()
                : this.renderFormatOptions()}
            </ActionsContainer>
            <div ref={arrowProps.ref} style={arrowProps.style} />
          </div>
        )}
      </Popper>
    );
  }
}

FormatTextToolbar.propTypes = {
  range: T.object,
  toggleMark: T.func.isRequired,
  insertLink: T.func.isRequired,
  value: T.object.isRequired
};

export default FormatTextToolbar;