import { create } from 'zustand';

interface WorkerStore {
  worker: Worker | null;
  isReady: boolean;
  init: () => void;
}

export const useWorkerStore = create<WorkerStore>((set, get) => ({
worker: null,
isReady: false,
init: () => {
  if(get().worker) return;
  const w = new Worker(
    new URL('../workers/pyodide.worker.tsx', import.meta.url),
    { type: "module"}
  );
  w.postMessage({ type: 'init' });
  w.addEventListener('message', (event) => {
    if (event.data.type === 'ready') set({ isReady: true });
  });
  set({worker: w})
  },
}));