## Slate Editor plugins

> Built on top of Slate, slate-plugins enables you to use a list of configurable and extendable plugins to keep your codebase clean and easy to debug.
> -- From https://github.com/udecode/slate-plugins/tree/69cafb634d365fc5d16b209287356682bc6ecfd6

**Note**: Since both `slate` and `slate-plugins` are in a beta stage, the repo links and versions are fixed.

### Motivation

The `slate-plugins` provides several interesting plugins and the framework to build our own.
To simplify code organization, all the `slate-plugins` related code, including their configuration, is kept inside the `scripts/slate/plugins` folder.

There are some functions which are exported directly. This leads to some redundancy but simplifies having to deal with this framework.

## Plugin structure:
Each slate plugin has the following interface:
```js
interface SlatePlugin {
  decorate?: Decorate;
  deserialize?: DeserializeHtml;
  renderElement?: RenderElement;
  renderLeaf?: RenderLeaf;
  onKeyDown?: OnKeyDown;
  onDOMBeforeInput?: OnDOMBeforeInput;
}
```

The slate plugins defined by apt extends this interface and adds 2 properties:
```js
interface APTSlatePlugin extends SlatePlugin {
  toolbar: ToolbarItem[];
  onUse: OnUse;
}

interface ToolbarItem {
  // Id to reference this toolbar button.
  id: string;
  // Icons from collecticons to display.
  icon: string;
  // Keyboard hotkey as defined by the is-hotkey package.
  hotkey: string;
  // Toolbar button label.
  label: string;
  // Toolbar tooltip. key is the shortcut string formatter according to OS.
  tip: (key: string) => string;
}

// The OnUse function is called whenever the plugin action is triggered either
// through the toolbar click or the keyboard shortcut.
type OnUse = (editor: Editor, btnId: string) => void;
```

Template for an APTSlatePlugin:
```js
export const PLUGIN_ID = 'plugin-id';

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
export const onPluginUse = (editor, btnId) => {
  // Usage code
};

export const PluginTemplate = {
  renderElement: getRenderElement({
    type: PLUGIN_ID,
    component: PluginComponent
  }),
  onKeyDown: (e, editor) => {
    // Ensure that all toolbar hotkeys run.
    castArray(PluginTemplate.toolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        PluginTemplate.onUse(editor, btn.id);
      }
    });
  },
  toolbar: {
    id: PLUGIN_ID,
    icon: 'xmark',
    hotkey: '',
    label: 'Plugin',
    tip: (key) => `Plugin (${modKey(key)})`
  },
  onUse: onPluginUse
};
```