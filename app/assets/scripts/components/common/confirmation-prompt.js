import React, { Component } from 'react';
import styled from 'styled-components';

import { Modal, ModalFooter } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';

const ConfirmationModalFooter = styled(ModalFooter)`
  justify-content: flex-end;
`;

const noop = () => {};
// Once the component is mounted we store it to be able to access it from
// the outside.
let theConfirmationModal = null;

// Base state to reset on new showings.
const baseState = {
  title: 'Are you sure?',
  content: <p>This action will be carried out.</p>,
  // eslint-disable-next-line
  renderControls: ({ cancel, confirm }) => (
    <React.Fragment>
      <Button
        variation='base-plain'
        title='Cancel this action'
        onClick={cancel}
      >
        Cancel
      </Button>
      <Button
        variation='base-plain'
        title='Confirm this action'
        onClick={confirm}
      >
        Confirm
      </Button>
    </React.Fragment>
  ),
  data: null
};

/**
 * Confirmation Prompt element. Renders a modal to ask the user for confirmation
 * on some action.
 *
 * Usage: The <ConfirmationPrompt /> should be mounted only once as high as
 * possible in the application tree. It has no properties requirements.
 *
 * The show the confirmation prompt use showConfirmationPrompt(opts)
 * @param {object} opts The options for the confirmation prompt
 * @param {string} opts.title The confirmation title to be displayed on the
 * header. Defaults to "Are you sure?"
 * @param {node} opts.content The content for the prompt. Can be a react
 * component. Defaults to <p>This action will be carried out.</p>
 * @param {function} renderControls The callback function to render the buttons.
 * Has the following signature: ({ confirm, cancel, setResult }), with confirm
 * and cancel being the functions to call when the buttons are clicked. The
 * setResult allows to define a custom value for the result. (useful when there
 * are more than 2 buttons). Defaults to "Confirm/Cancel" buttons.
 * @param {any} data Any extra data that the confirmation prompt should keep
 * track of. Useful to know what confirmation we're working with.
 *
 * @returns {Promise} Resolves when the user selects an option with: { result:
 *                    any, data: any }
 *
 *
 * @example
 *    const res = await showConfirmationPrompt();
 *    console.log(res.result ? 'User says yes' : 'User says no');
 */
class ConfirmationPrompt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onResult: noop,
      revealed: false,
      ...baseState
    };

    this.onResult = this.onResult.bind(this);
    this.keyListener = this.keyListener.bind(this);

    if (theConfirmationModal !== null) {
      throw new Error(
        '<ConfirmationPrompt /> component was already mounted. Only 1 is allowed.'
      );
    }
    theConfirmationModal = this;
  }

  componentDidMount() {
    document.addEventListener('keyup', this.keyListener);
  }

  componentWillUnmount() {
    theConfirmationModal = null;
    document.removeEventListener('keyup', this.keyListener);
  }

  keyListener(e) {
    // Enter.
    // eslint-disable-next-line
    if (this.state.revealed && e.keyCode === 13) {
      e.preventDefault();
      this.onResult(true);
    }
  }

  onResult(payload) {
    this.setState({ revealed: false });
    // eslint-disable-next-line
    this.state.onResult(payload);
  }

  render() {
    const { revealed, title, content, renderControls } = this.state;

    return (
      <Modal
        id='confirmation-prompt-modal'
        size='small'
        revealed={revealed}
        title={title}
        content={content}
        renderToolbar={() => null}
        renderFooter={() => (
          <ConfirmationModalFooter>
            {renderControls({
              cancel: this.onResult.bind(this, false),
              confirm: this.onResult.bind(this, true),
              setResult: this.onResult
            })}
          </ConfirmationModalFooter>
        )}
      />
    );
  }
}

export default ConfirmationPrompt;

/**
 * Displays a confirmation prompt to the user
 *
 * @param {object} opts The options for the confirmation prompt
 * @param {string} opts.title The confirmation title to be displayed on the
 * header. Defaults to "Are you sure?"
 * @param {node} opts.content The content for the prompt. Can be a react
 * component. Defaults to <p>This action will be carried out.</p>
 * @param {function} renderControls The callback function to render the buttons.
 * Has the following signature: ({ confirm, cancel }), with confirm and cancel
 * being the function to call when the buttons are clicked. Defaults to
 * "Confirm/Cancel" buttons.
 * @param {any} data Any extra data that the confirmation prompt should keep
 *  track of. Useful to know what confirmation we're working with.
 *
 * @returns {Promise} Resolves when the user selects an option with: { result:
 *                    boolean, data: any }
 *
 * @example
 *    const res = await showConfirmationPrompt();
 *    console.log(res.result ? 'User says yes' : 'User says no');
 */
export function showConfirmationPrompt(opts = {}) {
  if (theConfirmationModal === null) {
    throw new Error('<ConfirmationPrompt /> component not mounted');
  }
  const { data, title, content, renderControls } = opts;
  return new Promise((resolve) => {
    theConfirmationModal.setState({
      revealed: true,
      title: title || baseState.title,
      content: content || baseState.content,
      renderControls: renderControls || baseState.renderControls,
      onResult: (result) => resolve({ result, data: data || baseState.data })
    });
  });
}

const deleteControls = ({ confirm, cancel }) => (
  <React.Fragment>
    <Button
      variation='base-plain'
      title='Cancel deletion'
      useIcon='xmark--small'
      onClick={cancel}
    >
      Cancel
    </Button>
    <Button
      variation='danger-raised-dark'
      title='Confirm deletion'
      useIcon='trash-bin'
      onClick={confirm}
    >
      Delete
    </Button>
  </React.Fragment>
);

/**
 * Convenience method to show a delete confirmation prompt for a document.
 * Will display a "Cancel/Delete" buttons and:
 * title: 'Delete this document?'
 * content: <p>The document <strong>{name}</strong> will be deleted.</p>
 *
 * @param {string} name Name of the document to delete
 * @param {any} data Any extra data that the confirmation prompt should keep
 *              track of. Useful to know what confirmation we're working with.
 */
export const confirmDeleteAtbd = async (name) => {
  return showConfirmationPrompt({
    title: 'Delete this document?',
    content: (
      <p>
        The document <strong>{name}</strong> and all its versions will be
        deleted.
      </p>
    ),
    renderControls: deleteControls
  });
};

/**
 * Convenience method to show a delete confirmation prompt for a document.
 * Will display a "Cancel/Delete" buttons and:
 * title: 'Delete this document?'
 * content: <p>The document <strong>{name}</strong> will be deleted.</p>
 *
 * @param {string} name Name of the document to delete
 * @param {any} data Any extra data that the confirmation prompt should keep
 *              track of. Useful to know what confirmation we're working with.
 */
export const confirmDeleteAtbdVersion = async (name, version) => {
  return showConfirmationPrompt({
    title: 'Delete this document version?',
    content: (
      <p>
        The version <strong>{version}</strong> of document{' '}
        <strong>{name}</strong> will be deleted.
      </p>
    ),
    renderControls: deleteControls
  });
};