import { keymap, lineNumbers, EditorView, highlightActiveLine } from "@codemirror/view";
import {
  defaultKeymap,
  historyKeymap,
  history,
  indentWithTab,
} from '@codemirror/commands';
import { python } from "@codemirror/lang-python";
import { indentUnit, bracketMatching, codeFolding, foldGutter } from '@codemirror/language';
import { autocompletion } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState, Extension } from "@codemirror/state";
import { search, searchKeymap } from '@codemirror/search';

const editorTheme = EditorView.theme({
  "&": { height: "100%" },
  ".cm-scroller": { overflow: "auto" },
  ".cm-content": { padding: "12px 0" },
});

export function buildExtensions(onChange: (value: string) => void, onRun?: () => void): Extension[] {
  return [
    lineNumbers(),
    highlightActiveLine(),
    history(),
    python(),
    autocompletion(),
    search(),
    oneDark,
    keymap.of([
      {
        key: 'Ctrl-Enter',
        run: () => {
          onRun?.();
          return true;
        },
      },
      indentWithTab,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
    ]),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) onChange(update.state.doc.toString());
    }),
    EditorState.tabSize.of(4),
    indentUnit.of('    '),
    bracketMatching(),
    codeFolding(),
    foldGutter(),
    editorTheme,
  ];
}
