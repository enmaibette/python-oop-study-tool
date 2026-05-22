import { useChallengeStore } from '@/stores/challengeStore';
import { useUIStore } from '@/stores/uiStore';
import { useWorkerStore } from '@/stores/workerStore.ts';

interface UseRunCodeReturn {
  triggerRun: () => void;
  triggerSubmit: () => void;
  triggerReset: () => void;
}

export function useRunCode(): UseRunCodeReturn {
  const editorContent = useChallengeStore((state) => state.editorContent);
  const editorContentMap = useChallengeStore((state) => state.editorContentMap);
  const activeFilePath = useChallengeStore((state) => state.activeFilePath);
  const binaryFiles = useChallengeStore((state) => state.binaryFiles);
  const resetEditorToStarter = useChallengeStore((state) => state.resetEditorToStarter);
  const workerRef = useWorkerStore((state) => state.worker);
  const clearOutput = useUIStore((state) => state.clearOutput);
  const setConsoleActiveTab = useUIStore((state) => state.setConsoleActiveTab);
  const bumpCanvasClearKey = useUIStore((state) => state.bumpCanvasClearKey);

  const runContext = { code: editorContent, files: editorContentMap, activeFilePath, binaryFiles };

  const triggerRun = () => {
    clearOutput();
    workerRef?.postMessage({ type: 'run', ...runContext });
    setConsoleActiveTab('output');
  };

  const triggerSubmit = () => {
    // getState() avoids a stale closure - challenges list is not subscribed reactively here
    const { challenges, activeChallengeId } = useChallengeStore.getState();
    const currentActive = challenges.find((c) => c.id === activeChallengeId);
    if (!currentActive) return;
    clearOutput();
    workerRef?.postMessage({ type: 'submit', ...runContext, testcasePy: currentActive.testCasesPy });
    setConsoleActiveTab('testcases');
  };

  const triggerReset = () => {
    resetEditorToStarter();
    clearOutput();
    bumpCanvasClearKey();
  };

  return { triggerRun, triggerSubmit, triggerReset };
}
