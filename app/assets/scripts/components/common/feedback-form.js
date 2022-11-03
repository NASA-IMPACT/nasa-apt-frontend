import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';

import config from '../../config';

const StyledGoogleForm = styled.iframe`
  width: 100%;
`;

export default function FeedbackForm() {
  const [isRevealed, setRevealed] = useState(false);

  const close = () => setRevealed(false);
  const reveal = () => setRevealed(true);

  // The about page (app/scripts/components/about/index.jx)
  // includes a button to trigger the feedback modal. That button dispatches an
  // event, which this modal reacts to.
  // Although this is not very React-y, it was quick to implement. The
  // alternative would be to track the modal status more globally (through an
  // app context for example) which would make it accessible everywhere.
  useEffect(() => {
    const listener = () => setRevealed(true);
    document.addEventListener('show-feedback-modal', listener);
    return () => document.removeEventListener('show-feedback-modal', listener);
  }, []);

  return (
    <>
      <Button
        variation='achromic-plain'
        title='Leave feedback about the app'
        onClick={reveal}
      >
        Feedback
      </Button>
      <Modal
        id='modal'
        size='large'
        title='Give us feedback'
        revealed={isRevealed}
        onCloseClick={close}
        onOverlayClick={close}
        closeButton
        content={
          <StyledGoogleForm
            src={config.feedbackForm}
            height='504'
            frameBorder='0'
            marginHeight='0'
            marginWidth='0'
          >
            Loading…
          </StyledGoogleForm>
        }
      />
    </>
  );
}
