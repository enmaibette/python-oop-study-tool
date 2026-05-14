import { CustomTabs, TabsList, TabsTrigger, TabsContent } from '../../components/common/CustomTabs';
import { OutputTab } from './OutputTab';
import { TestCasesTab } from './TestCasesTab';
import type { ConsoleTab, TestCase } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CanvasTab } from '@/features/console/CanvasTab.tsx';

interface ConsolePanelProps {
  activeTab: ConsoleTab;
  onTabChange: (tab: ConsoleTab) => void;
  outputLines: string[];
  testCases: TestCase[];
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  canvas: boolean;
  challengeId: string;
}

export function ConsolePanel({
  activeTab,
  onTabChange,
  outputLines,
  testCases,
  onOpenChange,
  isOpen,
  canvas,
  challengeId,
}: ConsolePanelProps) {
  return (
    <div className="flex flex-col h-full bg-(--background) border-t border-(--border)">
      <CustomTabs
        value={activeTab}
        onValueChange={(v) => {
          if (!isOpen) onOpenChange(true);
          onTabChange(v as ConsoleTab);
        }}
        className="flex flex-col h-full"
      >
        <div className="flex items-center shrink-0">
          <TabsList variant="line" className="px-2 flex-1">
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="testcases">Test Cases</TabsTrigger>
            <TabsTrigger hidden={!canvas}  value="canvas">Canvas</TabsTrigger>
          </TabsList>
          <button
            type="button"
            aria-label="Close console panel"
            onClick={() => onOpenChange(!isOpen)}
            className="p-2 mr-1 text-(--muted) hover:text-(--text)"
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>

        {isOpen && (
          <>
            <TabsContent value="output" className="flex-1 min-h-0 overflow-hidden">
              <OutputTab outputLines={outputLines} />
            </TabsContent>

            <TabsContent value="testcases" className="flex-1 min-h-0 overflow-hidden">
              <TestCasesTab testCases={testCases} />
            </TabsContent>
            <TabsContent forceMount value={'canvas'} className="flex-1 min-h-0 overflow-hidden data-[state=inactive]:hidden">
              <CanvasTab clearKey={challengeId} />
            </TabsContent>
          </>
        )}
      </CustomTabs>
    </div>
  );
}
