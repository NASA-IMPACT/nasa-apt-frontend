import React, { useMemo, useCallback } from 'react';
import T from 'prop-types';
import { useSlate } from 'slate-react';
import castArray from 'lodash.castarray';
import { Modal } from '@devseed-ui/modal';

import DetailsList from '../../../../styles/typography/details-list';

import { Kbd } from '../../../../styles/typography/code';
import { modKey2kbd, REDO_HOTKEY, UNDO_HOTKEY } from '../common/utils';
import { LINK } from '../link';
import { SHORTCUTS_HOTKEY } from '.';

const getPluginShortcuts = (plugins) => {
  const getShortcuts = (toolbar) =>
    castArray(toolbar).filter((t) => !!t?.hotkey);

  return plugins.reduce(
    (acc, p) => {
      const { toolbar, floating } = acc;

      return {
        toolbar: toolbar.concat(getShortcuts(p.toolbar)),
        floating: floating.concat(getShortcuts(p.floatToolbar))
      };
    },
    {
      toolbar: [],
      floating: []
    }
  );
};

export function ShortcutsModal(props) {
  const { plugins } = props;
  const editor = useSlate();

  const { visible } = editor.shortcutsModal.getData();

  const closeModal = useCallback(() => {
    editor.shortcutsModal.reset();
  }, [editor]);

  const { toolbar, floating } = useMemo(() => getPluginShortcuts(plugins), [
    plugins
  ]);

  return (
    <Modal
      id='modal'
      size='large'
      revealed={visible}
      onCloseClick={closeModal}
      title='Keyboard shortcuts'
      content={
        <React.Fragment>
          <div>
            <h2>General Actions</h2>
            <DetailsList>
              <dt>Undo</dt>
              <dd>
                <Kbd>{modKey2kbd(UNDO_HOTKEY)}</Kbd>
              </dd>
              <dt>Redo</dt>
              <dd>
                <Kbd>{modKey2kbd(REDO_HOTKEY)}</Kbd>
              </dd>
              <dt>Shortcuts</dt>
              <dd>
                <Kbd>{modKey2kbd(SHORTCUTS_HOTKEY)}</Kbd>
              </dd>
            </DetailsList>
          </div>
          {!!toolbar.length && (
            <div>
              <h2>Insert items</h2>
              <DetailsList>
                {toolbar.map((shortcut) => (
                  <React.Fragment key={shortcut.id}>
                    <dt>{shortcut.label}</dt>
                    <dd>
                      <Kbd>{modKey2kbd(shortcut.hotkey)}</Kbd>
                    </dd>
                  </React.Fragment>
                ))}
              </DetailsList>
            </div>
          )}
          {!!floating.length && (
            <div>
              <h2>Format selection</h2>
              <DetailsList>
                {floating.map((shortcut) => (
                  <React.Fragment key={shortcut.id}>
                    <dt>
                      {shortcut.id === LINK ? 'Insert link' : shortcut.label}
                    </dt>
                    <dd>
                      <Kbd>{modKey2kbd(shortcut.hotkey)}</Kbd>
                    </dd>
                  </React.Fragment>
                ))}
              </DetailsList>
            </div>
          )}
          <div>
            <h2>Contextual actions</h2>
            <p>
              Contextual actions will only appear when the element they refer to
              is selected.
            </p>
            {plugins.map((p) => {
              if (!p.contextToolbar) return null;

              return (
                <React.Fragment key={p.name}>
                  <h3>{p.name}</h3>
                  <DetailsList>
                    {castArray(p.contextToolbar).map((shortcut) => (
                      <React.Fragment key={shortcut.id}>
                        <dt>{shortcut.label}</dt>
                        <dd>
                          <Kbd>{modKey2kbd(shortcut.hotkey)}</Kbd>
                        </dd>
                      </React.Fragment>
                    ))}
                  </DetailsList>
                </React.Fragment>
              );
            })}
          </div>
        </React.Fragment>
      }
    />
  );
}

ShortcutsModal.propTypes = {
  plugins: T.array
};
