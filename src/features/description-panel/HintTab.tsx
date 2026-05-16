import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { Hint } from '@/types';
import { MarkdownRenderer } from '@/features/description-panel/MarkdownRenderer.tsx';

interface HintTabProps {
  hints: Hint[];
}

export function HintTab({ hints }: HintTabProps) {
  if (hints.length === 0) {
    return (
      <div className="p-4 text-sm text-(--muted)">
        No hints available for this challenge.
      </div>
    );
  }

  return (
    <div className="p-4">
      <Accordion type="multiple" className="w-full">
        {hints.map((hint, index) => (
          <AccordionItem key={hint.id} value={hint.id}>
            <AccordionTrigger>
              <span className="text-sm">Hint {index + 1}</span>
            </AccordionTrigger>
            <AccordionContent>
              <MarkdownRenderer>
                {hint.text}
              </MarkdownRenderer>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
