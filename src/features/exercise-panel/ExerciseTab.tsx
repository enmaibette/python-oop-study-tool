import { useMemo } from 'react';
import type { Challenge } from '@/types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ExerciseTabProps {
  challenge: Challenge;
}

export function ExerciseTab({ challenge }: ExerciseTabProps) {
  const markdown = useMemo(
    () =>
      challenge.exerciseMarkdown.replace(/!\[([^\]]*)]\(([^)]+)\)/g, (match, alt, src) => {
        const filename = src.split('/').pop() ?? src;
        const url = challenge.exerciseImages[filename];
        return url ? `![${alt}](${url})` : match;
      }),
    [challenge.exerciseMarkdown, challenge.exerciseImages],
  );

  return (
    <div className="p-4 space-y-5">
        <MarkdownRenderer>{markdown}</MarkdownRenderer>
    </div>
  );
}
