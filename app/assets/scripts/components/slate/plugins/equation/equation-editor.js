import React from 'react';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';

export default function EquationEditor(props) {
  const { attributes, children } = props;

  return (
    <div {...attributes}>
      <div>{children}</div>
      <p contentEditable={false}>The equation result</p>
    </div>
  );
}
