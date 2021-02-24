import React from 'react';

import App from '../../common/app';
import FullEditor from '../../slate/editor';
import Constrainer from '../../../styles/constrainer';

function SandboxEditor() {
  return (
    <App pageTitle='Sandbox editor'>
      <Constrainer>
        <h1>Editor</h1>
        <FullEditor />
      </Constrainer>
    </App>
  );
}

export default SandboxEditor;
