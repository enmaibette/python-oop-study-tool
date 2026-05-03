import { useChallengeStore } from '@/stores/challengeStore';
import { useUIStore } from '@/stores/uiStore';
import { useEffect } from 'react';
import { useWorkerStore } from '@/stores/workerStore.ts';

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
  const workerRef = useWorkerStore((state) => state.worker);

  useEffect(() => {
    if (!workerRef) return;
    const handler = (event: MessageEvent) => {
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
    workerRef.addEventListener('message', handler);
    return () => workerRef.removeEventListener('message', handler);
  }, [workerRef]);

  const triggerRun = () => {
    clearOutput();

    workerRef?.postMessage({
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

    workerRef?.postMessage({
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
