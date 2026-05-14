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
  const clearOutput = useUIStore((state) => state.clearOutput);
  const setConsoleActiveTab = useUIStore((state) => state.setConsoleActiveTab);
  const editorContentMap = useChallengeStore((state) => state.editorContentMap);
  const activeFilePath = useChallengeStore((state) => state.activeFilePath);
  const binaryFiles = useChallengeStore((state) => state.binaryFiles);
  const workerRef = useWorkerStore((state) => state.worker);
  const resetEditorToStarter = useChallengeStore((state) => state.resetEditorToStarter);
  const bumpCanvasClearKey = useUIStore((state) => state.bumpCanvasClearKey);

  const triggerRun = () => {
    clearOutput();
    workerRef?.postMessage({
      type: 'run',
      code: editorContent,
      files: editorContentMap,
      activeFilePath,
      binaryFiles,
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
      binaryFiles,
    });
    setConsoleActiveTab('testcases');
  };

  const triggerReset = (): void => {
    resetEditorToStarter();
    clearOutput();
    bumpCanvasClearKey();
  };

  return { triggerRun, triggerSubmit, triggerReset };
}
