import { RichTextEditor } from './editor';
import { InlineRichTextEditor } from './inline-editor';
import { editorEmptyValue } from './editor-values';
import SafeReadEditor from './safe-read-editor';
import { subsectionsFromSlateDocument } from './subsections-from-slate';
import {
  nodeFromSlateDocument,
  removeNodeFromSlateDocument
} from './nodes-from-slate';
import { RichContextProvider } from './plugins/common/rich-context';

export {
  RichTextEditor,
  InlineRichTextEditor,
  // Working context,
  RichContextProvider,
  // Read only version of the editor wrapped in an error boundary.
  SafeReadEditor,
  // Starting value.
  editorEmptyValue,
  // Helpers.
  subsectionsFromSlateDocument,
  nodeFromSlateDocument,
  removeNodeFromSlateDocument
};
