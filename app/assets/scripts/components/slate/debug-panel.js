import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';

const Panel = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 30rem;
  padding: ${glsp()};
  box-shadow: ${themeVal('boxShadow.elevationB')};
  background: #fff;
  display: flex;
  flex-flow: column;

  textarea {
    width: 100%;
    flex-grow: 1;
    border: none;
    resize: none;
    outline: none;
    font-size: 0.75rem;
    font-family: monospace;
  }
`;

const Message = styled.p`
  padding: ${glsp(0.25)};
  box-shadow: ${themeVal('boxShadow.inset')};

  &::before {
    margin-right: ${glsp(0.25)};
  }

  ${({ isInvalid }) =>
    isInvalid
      ? css`
          color: ${themeVal('color.danger')};

          &::before {
            ${collecticon('circle-xmark')}
          }
        `
      : css`
          color: ${themeVal('color.success')};

          &::before {
            ${collecticon('circle-tick')}
          }
        `}
`;

export default function DebugPanel(props) {
  const { value, onChange } = props;

  useEffect(() => {
    setDraftValue(JSON.stringify(value, null, '  '));
  }, [value]);

  const [draftValue, setDraftValue] = useState('');
  const [error, setError] = useState('');

  const onTextareaChange = (e) => {
    const v = e.target.value;
    setDraftValue(v);
    setError('');
    try {
      const parsed = JSON.parse(v);
      onChange(parsed);
    } catch (error) {
      setError(error.message);
    }
  };

  return createPortal(
    <Panel>
      <textarea onChange={onTextareaChange} value={draftValue} />
      <Message isInvalid={!!error}>{error || 'Document is valid.'}</Message>
    </Panel>,
    document.querySelector('#app-container')
  );
}
