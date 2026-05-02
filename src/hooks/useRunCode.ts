import { useChallengeStore } from '@/stores/challengeStore';
import { useUIStore } from '@/stores/uiStore';
import { useEffect, useRef } from 'react';

interface UseRunCodeReturn {
  triggerRun: () => void;
  triggerSubmit: () => void;
}

export function useRunCode(): UseRunCodeReturn {
  const editorContent = useChallengeStore((state) => state.editorContent);
  const clearOutput = useUIStore((state) => state.clearOutput);
  const appendOutputLine = useUIStore((state) => state.appendOutputLine);
  const appendOutputLines = useUIStore((state) => state.appendOutputLines);
  const setConsoleActiveTab = useUIStore((state) => state.setConsoleActiveTab);
  const setTestCaseResults = useUIStore((state) => state.setTestCaseResults);
  const editorContentMap = useChallengeStore((state) => state.editorContentMap);
  const activeFilePath = useChallengeStore((state) => state.activeFilePath);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/pyodide.worker.tsx', import.meta.url),
      { type: "module"}
    )
    workerRef.current.postMessage({ type: 'init' });
    workerRef.current.onmessage = (event) => {
      const { type } = event.data;
      if (type === 'result') {
        appendOutputLines(event.data.stdout.split('\n'));
      }

      if (type === 'error') {
        appendOutputLine(`Error: ${event.data.message}`);
      }

      if (type === 'submit_result') {
        setTestCaseResults(event.data.results);
      }

      if (type === 'submit_error') {
        appendOutputLine(`Submit error: ${event.data.message}`);
        setConsoleActiveTab('output');
      }
    };
    return () => workerRef.current?.terminate();

  }, []);

  const triggerRun = () => {
    clearOutput();
    workerRef.current?.postMessage({
      type: 'run',
      code: editorContent,
      files: editorContentMap,
      activeFilePath,
    });
    setConsoleActiveTab('output');
  };

  const triggerSubmit = () => {
    const { challenges, activeChallengeId } = useChallengeStore.getState();
    const currentActive = challenges.find((c) => c.id === activeChallengeId);
    if (!currentActive) return;
    clearOutput();

    workerRef.current?.postMessage({
      type: 'submit',
      code: editorContent,
      files: editorContentMap,
      activeFilePath,
      testcasePy: currentActive.testCasesPy,
    });
    setConsoleActiveTab('testcases');


  };

  return { triggerRun, triggerSubmit };
}
