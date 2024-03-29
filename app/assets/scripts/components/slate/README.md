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
  // Human readable name of the plugin.
  name: string;
  // Main toolbar shown on the editor toolbar. Should contain permanent actions
  // to insert blocks.
  toolbar: ToolbarItem[];
  // Items that appear on the floating toolbar when text is selected. Should
  // display actions related to selections.
  floatToolbar: ToolbarItem[];
  // The context toolbar is shown alongside the main toolbar but only when the 
  // isInContext returns true. This is useful for actions that are contextual to
  // the focused element.
  contextToolbar: ToolbarContextItem[];
  // Callback for when a button is pressed.
  onUse: (editor: Editor, btnId: string) => void;
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
  // Whether or not the button should be disabled.
  isDisabled: (editor: Editor) => Boolean;
  // Override to custom render the toolbar item.
  // buttonProps should be spread onto the item.
  render: (props: { editor: Editor, plugin: APTSlatePlugin, item: ToolbarItem, buttonProps: Object }) => React.Component;
}

interface ToolbarContextItem extends ToolbarItem {
  // Whether or not the button should be displayed.
  isInContext: (editor: Editor) => Boolean;
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

### Plugins with React components
There are certain plugins that have a React component besides Slate. One such example is the Link Editor and this will be used to explain the approach.
The original `slate-plugins` link plugin uses a `prompt` to get the url value. To improve on the user experience we implemented a floating input box that appears over the link (similar implementations by Google Docs, Dropbox Paper, etc).

Much like the floating toolbar (with bold, italic, etc), the Link Editor's positioning is governed by the slate editor selection. The problem is that when the input field gets focused (to write the link url), the slate editor loses focus and consequently the selection. This results in the Link Editor losing its reference, not only for positioning, but also where to insert the link.

The solution is to store the editor selection state before triggering the Link Editor and reapply it once the link url is inputted and confirmed. Given that Slate and React have different APIs the solution needs to make heavier use of one of them:

**Using React**  
Focusing more on React leads to a lot of different hooks, listeners and functions that need to be added to slate at different points: One would be to listen to the slate editor changes and address caret positioning, other for the keyboard shortcuts. This was implemented with a certain degree of success but the code was becoming overly complicated (Code is dirty but can be seen in commit `3c363b49e8637aa98775df2e2cef29abd19a6183`).

**Using Slate**  
By looking at different Slate plugins and approaches, focusing more on the Slate APIs seems the right thing to do. In this way we create functions to decorated the editor and then show additional React components when needed. This allows for a better abstraction and switching out components at will.
Now that the reasoning was explained let's get into how it actually works.

The Link Editor is shown when invoked manually through a click on the "Link" button, but also when the caret is over a link. For the Link click we could add a click listener to the button, but we don't have an event for the caret placement as that has to be tracked when the Slate editor fires the `onChange` event, which happens for every change. One solution for this is to tap into the change event like the [slate-plugin's Mention plugin](https://github.com/udecode/slate-plugins/blob/7ec852ab6fc889b282c3460d3ed459e61bfb634d/stories/elements/mention.stories.tsx#L72-L75) does. Using this as inspiration and to keep things a bit more contained and standardized we included this change tracking in the plugin itself.

The `withLinkEditor` function does 2 important things:
1) Enhances the slate editor with a LinkEditor object whose job is to keep track of the operation to be executed in the next onChange cycle.
2) Enhances the slate editor `onChange` method to handle the LinkEditor operations. Whenever `onChange` fires it will go through the LinkEditor handler and then continue to slate internal `onChange`.

The enhanced editor will be:
```
editor = {
  // ... other properties

  linkEditor: {
    operation       The operation to run in the next onChange
    show(data)      Sets the operation to show and stores needed data
    reset()         Sets the operation to reset
    getData()       Returns the data needed to display the Link Editor
  }
}
```

The slate editor `onChange` method is our gateway to React. Every time this fires the components dependent on the `useSlate` hook will rerender and any updated properties can be read off of the `editor` (from  `const editor = useSlate();`)

By virtue of the `onChange` event, we know that react will render every time there a change in the Link Editor data and that data from `editor.linkEditor.getData()` will always be updated.

So, the flow for a user initiated Link Editor is something like:
- User clicks on button to show the Link Editor.
- This desire to show the Link editor is stored as an operation under `editor.linkEditor.operation` with the needed parameters like the current editor selection (which will be lost when focus is given to the url input - but we need it to later set the link).
- A change event is triggered.
- The `onChange` event handler checks if there are operations on the Link Editor pending and acts accordingly, in the this case by setting the Link Editor data in such a way that when React renders, the Link Editor will be shown.
- The slate change event triggers a react render.
- The Link Editor component is shown using data from `editor.linkEditor.getData()`.

Any other flow (like showing on caret placement) works the same way, with the definition of the operation to carry out and it being applied on the `onChange` cycle.

One may argue that the link click could store the properties directly and trigger the needed change for React to pick it up, but then the `onChange` handler would run and conflicting conditions would hide the Link Editor. By concentrating the operations in a single place it becomes easier to reason about and track errors.

## Rich Context

The RichContext (`common/rich-context.js`) is used to pass additional context information to slate's plugin components. Some components have to render in a different way when they're in read mode. Not only that but depending on where they're used, they may need contextual information.

For example: The subsection needs to know the heading level that should be used to render it, and the section it appears in to use as id prefix.

Another example are the references. The reference node stores the id to the reference it refers to, but we need the full reference data to be able to display the popover.
```js
{
  type: 'ref',
  refId: 1,
  children: [{ text: '' }]
}
```

The context should wrap the editor and values should be passed using the `context` prop. This values gets memoized but dependencies can be provided using `contextDeps`
```js
<RichContextProvider context={{ value: theValue }} contextDeps={[theValue]}>
  <RichTextEditor />
</RichContextProvider>
```

The rich context is currently being used by:

**Subsection**  
Only used when in read only mode:
  - `subsectionLevel`: heading level to be used when rendering the section header. Needed because of the nesting of document sections.
  - `sectionId`: The prefix for the section heading id. Used to avoid clashed with ids on other editors.

**References**  
In read mode:
  - `references`: List of references from where to pick the data for the tooltip
In write mode:
  - `references`: List of references from where to pick the data for the tooltip and for the modal
  - `onReferenceUpsert`: called when the user confirms the insertion of a reference. The value will contain any updates to the reference.


# Loose notes

**Toolbar button and focus**  
Any button that interacts with the editor, link the toolbar and floating toolbar ones need to use `onMouseDown` with the `getPreventDefaultHandler` function to prevent the editor from loosing focus. If `click` is used, the editor would have to be refocused with `ReactEditor.focus(editor);` However this is critical for the floating toolbar, that gets hidden when the editor looses focus.

**Captions**  
The caption is a complete node block. This gives us more flexibility in what a caption can be made of.
```js
{
  type: 'caption',
  children: [{ text: 'some caption' }]
}
```
Right now supports formatting (bold, italic, ...) and other inline items, like links and references. It is not possible to have block elements (like lists) inside captions.
Captions will not appear randomly in the document. They will always be paired with other elements like tables and images.
In these cases a parent wrapper block will house the element we want and a caption. Always in this order, and always 2 children.

For example a table will be:
```js
{
  type: 'table-block',
  children: [
    {
      type: 'table',
      children: [
        // all table children
      ]
    },
    {
      type: 'caption',
      children: [{ text: 'some caption' }]
    }
  ]
}
```