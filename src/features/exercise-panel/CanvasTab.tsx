import { canvasDescriptionMarkdown } from '@/data/challenges';
import { MarkdownRenderer } from './MarkdownRenderer';

export function CanvasTab() {
  return (
    <div className="p-4 space-y-5">
      <div className="text-sm leading-relaxed text-(--text) space-y-4">
        <MarkdownRenderer>{canvasDescriptionMarkdown}</MarkdownRenderer>
      </div>
    </div>
  );
}
