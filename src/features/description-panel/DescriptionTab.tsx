import type { Challenge } from '@/types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface DescriptionTabProps {
  challenge: Challenge;
}

export function DescriptionTab({ challenge }: DescriptionTabProps) {
  const markdown = challenge.descriptionMarkdown
    .replace(/!\[([^\]]*)]\(([^)]+)\)/g, (match, alt, src) => {
      const filename = src.split('/').pop() ?? src;
      const url = challenge.descriptionImages[filename];
      return url ? `![${alt}](${url})` : match;
    });

  return (
    <div className="p-4 space-y-5">
        <MarkdownRenderer>{markdown}</MarkdownRenderer>
    </div>
  );
}
