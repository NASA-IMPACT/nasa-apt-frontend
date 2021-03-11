import React, { useMemo, useState } from 'react';
import T from 'prop-types';
import isHotkey from 'is-hotkey';

import DebugPanel from './panel';

// We need to keep track of instances so when one panel opens, all the other
// ones can close.
let idCounter = 1;
let panelInstances = [];

export default function composeDebugEditor(EditorComponent) {
  function DebugEditor(props) {
    const { value, onDebugChange, name, plugins, ...rest } = props;

    const [isDebugVisible, setDebugVisible] = useState(false);
    const id = useMemo(() => ++idCounter, []);

    const hide = () => {
      setDebugVisible(false);
      panelInstances = panelInstances.filter((instance) => instance.id !== id);
    };
    const show = () => {
      setDebugVisible(true);
      // Hide all other instances.
      panelInstances.forEach((instance) => instance.hide());
      panelInstances.push({
        id,
        hide
      });
    };

    const debugPlugin = {
      onKeyDown: (e) => {
        if (isHotkey('mod+shift+I', e)) {
          if (isDebugVisible) {
            hide();
          } else {
            show();
          }
        }
      },
      onKeyDownDeps: [isDebugVisible]
    };

    const showDebug = !!value && !!onDebugChange && isDebugVisible;
    return (
      <>
        {showDebug && (
          <DebugPanel
            name={name}
            value={value}
            onChange={onDebugChange}
            onCloseClick={() => hide()}
          />
        )}
        <EditorComponent {...rest} plugins={[...plugins, debugPlugin]} />
      </>
    );
  }

  DebugEditor.propTypes = {
    value: T.array,
    onDebugChange: T.func,
    name: T.string,
    plugins: T.array
  };

  return DebugEditor;
}
