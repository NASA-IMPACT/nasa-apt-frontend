import React, { useCallback, useEffect } from 'react';
import T from 'prop-types';
import { Prompt } from 'react-router-dom';
import { useFormikContext } from 'formik';

const DEFAULT_WARNING =
  'Are you sure you want to leave? Unsaved changes will be lost.';

export function UnloadPrompt({ when, message }) {
  const beforeunloadHandler = useCallback(
    (event) => {
      event.preventDefault();
      return (event.returnValue = message);
    },
    [message]
  );

  useEffect(() => {
    if (when) {
      window.addEventListener('beforeunload', beforeunloadHandler);
    } else {
      window.removeEventListener('beforeunload', beforeunloadHandler);
    }

    return () =>
      window.removeEventListener('beforeunload', beforeunloadHandler);
  }, [when, beforeunloadHandler]);

  return <Prompt when={when} message={message} />;
}

UnloadPrompt.propTypes = {
  when: T.bool.isRequired,
  message: T.string
};

UnloadPrompt.defaultProps = {
  message: DEFAULT_WARNING
};

export function FormikUnloadPrompt({ message }) {
  const { dirty } = useFormikContext();

  return <UnloadPrompt when={dirty} message={message} />;
}

FormikUnloadPrompt.propTypes = {
  message: T.string
};

FormikUnloadPrompt.defaultProps = {
  message: DEFAULT_WARNING
};
