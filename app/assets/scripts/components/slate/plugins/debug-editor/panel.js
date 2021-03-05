import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';
import PortalContainer from '../common/portal-container';

const Panel = styled.section`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
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

const PanelHeader = styled.header`
  display: flex;
  z-index: 10;
  margin: ${glsp(-1, -1, 0, -1)};
  padding: ${glsp(0.5, 1)};
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaC')};

  h1 {
    margin: 0;
    font-size: 1rem;
  }

  ${Button} {
    margin-left: auto;
  }
`;

const Message = styled.p`
  margin: ${glsp(1, -1, -1, -1)};
  padding: ${glsp(0.5, 1)};
  box-shadow: ${themeVal('boxShadow.inset')};
  box-shadow: 0 -1px 0 0 ${themeVal('color.baseAlphaC')};

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
  const { value, name, onCloseClick, onChange } = props;

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

  return (
    <PortalContainer>
      <Panel>
        <PanelHeader>
          <h1>{name || 'Untitled editor'}</h1>
          <Button
            hideText
            useIcon='xmark--small'
            size='small'
            onClick={onCloseClick}
          >
            Close
          </Button>
        </PanelHeader>
        <textarea onChange={onTextareaChange} value={draftValue} />
        <Message isInvalid={!!error}>{error || 'Document is valid.'}</Message>
      </Panel>
    </PortalContainer>
  );
}

DebugPanel.propTypes = {
  value: T.array,
  name: T.string,
  onCloseClick: T.func,
  onChange: T.func
};
