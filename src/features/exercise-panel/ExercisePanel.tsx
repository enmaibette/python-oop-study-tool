import { memo, useState, useEffect } from 'react';
import { X, FileText, Lightbulb, Palette } from 'lucide-react';
import { CustomTabs, TabsList, TabsTrigger, TabsContent } from '../../components/common/CustomTabs';
import { ExerciseTab } from './ExerciseTab';
import { HintTab } from './HintTab';
import { CanvasTab } from './CanvasTab';
import type { Challenge, ExerciseTab as ExerciseTabType } from '@/types';

interface ExercisePanelProps {
  challenge: Challenge;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}

export const ExercisePanel = memo(function ExercisePanel({
  challenge,
  onOpenChange,
  isOpen,
}: ExercisePanelProps) {
  const [activeTab, setActiveTab] = useState<ExerciseTabType>('exercise');

  useEffect(() => {
    setActiveTab('exercise');
  }, [challenge.id]);

  return (
    <div className="flex flex-col h-full bg-(--surface) border-r border-(--border)">
      <CustomTabs
        value={activeTab}
        orientation={isOpen ? 'horizontal' : 'vertical'}
        onValueChange={(v) => {
          if (!isOpen) onOpenChange(true);
          setActiveTab(v as ExerciseTabType);
        }}
        className="flex flex-col h-full"
      >
        <div
          className={
            isOpen
              ? 'flex items-center border-b border-(--border) shrink-0'
              : 'flex flex-col items-center py-1 shrink-0'
          }
        >
          <TabsList
            variant={isOpen ? 'line' : 'vertical'}
            className={
              isOpen ? 'px-2 flex-1 border-b-0' : 'flex flex-col h-auto bg-transparent gap-1 p-1'
            }
          >
            <TabsTrigger
              value="exercise"
              onClick={() => {
                if (!isOpen) {
                  onOpenChange(true);
                  setActiveTab('exercise');
                }
              }}
            >
              {isOpen ? 'Exercise' : <FileText className="h-4 w-4" />}
            </TabsTrigger>
            <TabsTrigger
              value="hint"
              onClick={() => {
                if (!isOpen) {
                  onOpenChange(true);
                  setActiveTab('hint');
                }
              }}
            >
              {isOpen ? 'Hint' : <Lightbulb className="h-4 w-4" />}
            </TabsTrigger>
            {challenge.canvas && (
              <TabsTrigger
                value="canvas"
                onClick={() => {
                  if (!isOpen) {
                    onOpenChange(true);
                    setActiveTab('canvas');
                  }
                }}
              >
                {isOpen ? 'Canvas' : <Palette className="h-4 w-4" />}
              </TabsTrigger>
            )}
          </TabsList>
          {isOpen && (
            <button
              type="button"
              aria-label="Close exercise panel"
              onClick={() => onOpenChange(false)}
              className="p-2 text-(--muted) hover:text-(--text)"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isOpen && (
          <>
            <TabsContent value="exercise" className="flex-1 overflow-y-auto">
              <ExerciseTab challenge={challenge} />
            </TabsContent>

            <TabsContent value="hint" className="flex-1 overflow-y-auto">
              <HintTab hints={challenge.hints} />
            </TabsContent>
            {challenge.canvas && (
              <TabsContent value="canvas" className="flex-1 overflow-y-auto">
                <CanvasTab />
              </TabsContent>
            )}
          </>
        )}
      </CustomTabs>
    </div>
  );
});
