import { useEffect } from 'react';
import { useWorkerStore } from '@/stores/workerStore.ts';
import { useUIStore } from '@/stores/uiStore';

export function useWorkerMessages() {
  const workerRef = useWorkerStore((state) => state.worker);
  const appendOutputLine = useUIStore((state) => state.appendOutputLine);
  const appendOutputLines = useUIStore((state) => state.appendOutputLines);
  const setConsoleActiveTab = useUIStore((state) => state.setConsoleActiveTab);
  const setTestCaseResults = useUIStore((state) => state.setTestCaseResults);

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
}
