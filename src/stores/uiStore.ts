import { create } from 'zustand';
import type { ConsoleTab, TestCase } from '@/types';

interface UIState {
  isLeftPanelOpen: boolean;
  consoleActiveTab: ConsoleTab;
  outputLines: string[];
  setLeftPanelOpen: (open: boolean) => void;
  setConsoleActiveTab: (tab: ConsoleTab) => void;
  appendOutputLine: (line: string) => void;
  appendOutputLines: (lines: string[]) => void;
  clearOutput: () => void;
  isConsolePanelOpen: boolean;
  setConsolePanelOpen: (open: boolean) => void;
  testCaseResults: TestCase[];
  setTestCaseResults: (results: TestCase[]) => void;
  canvasClearKey: number;
  bumpCanvasClearKey: () => void;
  isSubmitPopoverOpen: boolean;
  setSubmitPopoverOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLeftPanelOpen: true,
  consoleActiveTab: 'output',
  outputLines: [],
  isConsolePanelOpen: true,
  testCaseResults: [],
  canvasClearKey: 0,
  isSubmitPopoverOpen: false,

  setLeftPanelOpen: (open: boolean) => {
  set({ isLeftPanelOpen: open });
  },

  setConsoleActiveTab: (tab: ConsoleTab) => {
    set({ consoleActiveTab: tab });
  },

  appendOutputLine: (line: string) => {
    set((state) => ({ outputLines: [...state.outputLines, line] }));
  },
  appendOutputLines: (lines: string[]) => {
    set((state) => ({ outputLines: [...state.outputLines, ...lines] }));
  },

  clearOutput: () => {
    set({ outputLines: [] });
  },

  setConsolePanelOpen: (open: boolean) => {
    set({ isConsolePanelOpen: open });
  },

  setTestCaseResults: (results: TestCase[]) => {
    set({ testCaseResults: results });
  },

  bumpCanvasClearKey: () => {
    set((state) => ({ canvasClearKey: state.canvasClearKey + 1 }));
  },

  setSubmitPopoverOpen: (open: boolean) => {
    set({ isSubmitPopoverOpen: open });
  }
}));
