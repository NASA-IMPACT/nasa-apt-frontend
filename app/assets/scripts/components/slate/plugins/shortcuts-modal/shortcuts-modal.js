import React, { useMemo, useCallback } from 'react';
import T from 'prop-types';
import { useSlate } from 'slate-react';
import castArray from 'lodash.castarray';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { glsp } from '@devseed-ui/theme-provider';

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

const CheatSheet = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${glsp(1, 2)};
`;

const CheatSheetSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  grid-gap: ${glsp(0.5)};
`;

const CheatSheetSectionTitle = styled.h3`
  margin: 0;
`;

const CheatSheetList = styled(DetailsList)`
  grid-template-columns: 1fr minmax(min-content, max-content);
  grid-gap: ${glsp(0.25, 2)};

  dd {
    text-align: right;

    kbd {
      vertical-align: top;
    }
  }
`;

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
      size='medium'
      revealed={visible}
      onCloseClick={closeModal}
      title='Keyboard shortcuts'
      content={
        <CheatSheet>
          <CheatSheetSection>
            <CheatSheetSectionTitle>General Actions</CheatSheetSectionTitle>
            <CheatSheetList>
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
            </CheatSheetList>
          </CheatSheetSection>
          {!!toolbar.length && (
            <CheatSheetSection>
              <CheatSheetSectionTitle>Insert items</CheatSheetSectionTitle>
              <CheatSheetList>
                {toolbar.map((shortcut) => (
                  <React.Fragment key={shortcut.id}>
                    <dt>{shortcut.label}</dt>
                    <dd>
                      <Kbd>{modKey2kbd(shortcut.hotkey)}</Kbd>
                    </dd>
                  </React.Fragment>
                ))}
              </CheatSheetList>
            </CheatSheetSection>
          )}
          <CheatSheetSection>
            <CheatSheetSectionTitle>Contextual actions</CheatSheetSectionTitle>
            <p>
              Contextual actions will only appear when the element they refer to
              is selected.
            </p>
            {plugins.map((p) => {
              if (!p.contextToolbar) return null;

              return (
                <React.Fragment key={p.name}>
                  <h4>{p.name}</h4>
                  <CheatSheetList>
                    {castArray(p.contextToolbar).map((shortcut) => (
                      <React.Fragment key={shortcut.id}>
                        <dt>{shortcut.label}</dt>
                        <dd>
                          <Kbd>{modKey2kbd(shortcut.hotkey)}</Kbd>
                        </dd>
                      </React.Fragment>
                    ))}
                  </CheatSheetList>
                </React.Fragment>
              );
            })}
          </CheatSheetSection>
          {!!floating.length && (
            <CheatSheetSection>
              <CheatSheetSectionTitle>Format selection</CheatSheetSectionTitle>
              <CheatSheetList>
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
              </CheatSheetList>
            </CheatSheetSection>
          )}
        </CheatSheet>
      }
    />
  );
}

ShortcutsModal.propTypes = {
  plugins: T.array
};
