import React from 'react';
import { Button } from '@devseed-ui/button';

import App from '../../common/app';
import FullEditor from '../../slate/editor';
import Constrainer from '../../../styles/constrainer';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';

function SandboxEditor() {
  return (
    <App pageTitle='Sandbox editor'>
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Editor</InpageTitle>
            </InpageHeadline>
            <InpageActions>
              <Button>Some button</Button>
            </InpageActions>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <Constrainer>
            <FullEditor />
          </Constrainer>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default SandboxEditor;
