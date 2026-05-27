import React, { useEffect, useRef } from 'react';
import type { PanelImperativeHandle } from 'react-resizable-panels';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface SplitLayoutProps {
  isLeftPanelOpen: boolean;
  onLeftPanelOpenChange: (open: boolean) => void;
  isConsolePanelOpen: boolean;
  onConsolePanelOpenChange: (open: boolean) => void;
  exercisePanel: React.ReactNode;
  editorPanel: React.ReactNode;
  consolePanel: React.ReactNode;
}

export function SplitLayout({
  isLeftPanelOpen,
  onLeftPanelOpenChange,
  isConsolePanelOpen,
  onConsolePanelOpenChange,
  exercisePanel,
  editorPanel,
  consolePanel,
}: SplitLayoutProps) {
  const leftPanelRef = useRef<PanelImperativeHandle | null>(null);
  const consolePanelRef = useRef<PanelImperativeHandle | null>(null);


  useEffect(() => {
    const panel = leftPanelRef.current;
    if (!panel) return;
    if (isLeftPanelOpen && panel.isCollapsed()) panel.expand();
    if (!isLeftPanelOpen && !panel.isCollapsed()) panel.collapse();
  }, [isLeftPanelOpen]);

  useEffect(() => {
    const panel = consolePanelRef.current;
    if (!panel) return;
    if (isConsolePanelOpen && panel.isCollapsed()) panel.expand();
    if (!isConsolePanelOpen && !panel.isCollapsed()) panel.collapse();
  }, [isConsolePanelOpen]);

  return (
    <ResizablePanelGroup orientation={'horizontal'} className="h-full w-full">
      <ResizablePanel
        id="exercise-panel"
        panelRef={leftPanelRef}
        defaultSize={600}
        minSize={200}
        collapsible
        collapsedSize={30}
        onResize={(size) => {
          onLeftPanelOpenChange(size.inPixels > 32);
        }}
      >
        {exercisePanel}
      </ResizablePanel>
      <ResizableHandle withHandle />

      <ResizablePanel id="workspace-panel" minSize={300}>
        <ResizablePanelGroup orientation="vertical" className="h-full">
          <ResizablePanel minSize={30}>
            {editorPanel}
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            panelRef={consolePanelRef}
            defaultSize={300}
            collapsible
            minSize={200}
            collapsedSize={40}
            onResize={(size) => {
              onConsolePanelOpenChange(size.inPixels > 42);
            }}
            className="flex flex-col"
          >
            {consolePanel}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
