import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { ExercisePanel } from '@/features/exercise-panel/ExercisePanel';
import { ConsolePanel } from '@/features/console/ConsolePanel';
import { useChallenge } from '@/hooks/useChallenge';
import { useChallengeStore } from '@/stores/challengeStore';
import { useUIStore } from '@/stores/uiStore';
import { useWorkerMessages } from '@/hooks/useWorkerMessages';
import { EditorPanel } from '@/features/editor/EditorPanel.tsx';

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>();

  const setActiveChallenge = useChallengeStore((state) => state.setActiveChallenge);

  const isLeftPanelOpen = useUIStore((state) => state.isLeftPanelOpen);
  const setLeftPanelOpen = useUIStore((state) => state.setLeftPanelOpen);
  const consoleActiveTab = useUIStore((state) => state.consoleActiveTab);
  const setConsoleActiveTab = useUIStore((state) => state.setConsoleActiveTab);
  const outputLines = useUIStore((state) => state.outputLines);
  const setConsolePanelOpen = useUIStore((state) => state.setConsolePanelOpen);
  const isConsolePanelOpen = useUIStore((state) => state.isConsolePanelOpen);
  const clearOutput = useUIStore((state) => state.clearOutput);
  const setTestCaseResults = useUIStore((state) => state.setTestCaseResults);

  const challenge = useChallenge(id);
  const testCases = useUIStore((state) => state.testCaseResults);

  useWorkerMessages();

  useEffect(() => {
    if (id && challenge) {
      clearOutput();
      setActiveChallenge(id);
      setTestCaseResults(challenge.testCases);
    }
  }, [id, challenge, setActiveChallenge]);

  // Redirect to home if challenge not found
  if (!id || !challenge) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <SplitLayout
        isLeftPanelOpen={isLeftPanelOpen}
        onLeftPanelOpenChange={setLeftPanelOpen}
        isConsolePanelOpen={isConsolePanelOpen}
        onConsolePanelOpenChange={setConsolePanelOpen}
        exercisePanel={
          <ExercisePanel
            challenge={challenge}
            onOpenChange={setLeftPanelOpen}
            isOpen={isLeftPanelOpen}
          />
        }
        editorPanel={<EditorPanel />}
          consolePanel={
            <ConsolePanel
              activeTab={consoleActiveTab}
              onTabChange={setConsoleActiveTab}
              outputLines={outputLines}
              testCases={testCases}
              onOpenChange={setConsolePanelOpen}
              isOpen={isConsolePanelOpen}
              canvas={challenge.canvas}
              challengeId={id}
            />
          }
      />
    </div>
  );
}
