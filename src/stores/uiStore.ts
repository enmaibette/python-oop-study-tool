import { create } from 'zustand';
import type { ConsoleTab, TestCase } from '@/types';

interface UIState {
  isLeftPanelOpen: boolean;
  consoleActiveTab: ConsoleTab;
  descriptionActiveTab: 'description' | 'hint';
  outputLines: string[];
  setLeftPanelOpen: (open: boolean) => void;
  setConsoleActiveTab: (tab: ConsoleTab) => void;
  setDescriptionActiveTab: (tab: 'description' | 'hint') => void;
  appendOutputLine: (line: string) => void;
  appendOutputLines: (lines: string[]) => void;
  clearOutput: () => void;
  isConsolePanelOpen: boolean;
  setConsolePanelOpen: (open: boolean) => void;
  testCaseResults: TestCase[];
  setTestCaseResults: (results: TestCase[]) => void;
  clearTestCaseResults: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLeftPanelOpen: true,
  consoleActiveTab: 'output',
  descriptionActiveTab: 'description',
  outputLines: [],
  isConsolePanelOpen: true,
  testCaseResults: [],

  setLeftPanelOpen: (open: boolean) => {
    set({ isLeftPanelOpen: open });
  },

  setConsoleActiveTab: (tab: ConsoleTab) => {
    set({ consoleActiveTab: tab });
  },

  setDescriptionActiveTab: (tab: 'description' | 'hint') => {
    set({ descriptionActiveTab: tab });
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
  clearTestCaseResults: () => {
    set({ testCaseResults: [] });
  },
}));
