import { useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { buildExtensions } from '@/lib/codemirrorExtensions.ts';

interface UseCodeMirrorOptions {
  initialDoc: string;
  onChange: (value: string) => void;
  onRun?: () => void;
}

export function useCodeMirror({ initialDoc, onChange, onRun }: UseCodeMirrorOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  const lastDocRef = useRef(initialDoc);

  // Keep the callback refs current without re-running the main effect
  useEffect(() => {
    onChangeRef.current = onChange;
    onRunRef.current = onRun;
  });

  // Initialize editor once
  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: initialDoc,
      extensions: buildExtensions(
        (value) => onChangeRef.current(value),
        () => onRunRef.current?.(),
      ),
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;
    lastDocRef.current = initialDoc;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update document when initialDoc changes (challenge switch or reset)
  useEffect(() => {
    const view = viewRef.current;
    if (!view || initialDoc === lastDocRef.current) return;

    lastDocRef.current = initialDoc;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== initialDoc) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: initialDoc,
        },
      });
    }
  }, [initialDoc]);

  return { containerRef };
}
