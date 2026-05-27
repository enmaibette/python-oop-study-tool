import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ShikiCodeBlock } from './ShikiCodeBlock';

interface MarkdownRendererProps {
  children: string;
}

const remarkPlugins = [remarkGfm];

const components: Components = {
  h1: ({ children }) => <h1 className="text-lg font-semibold text-(--text)">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-semibold text-(--text)">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold text-(--text)">{children}</h3>,
  ul: ({ children }) => <ul className="space-y-1.5 list-disc pl-5">{children}</ul>,
  thead: ({ children }) => <thead className="border-b border-(--border)">{children}</thead>,
  a: ( { href, children} ) => <a href={href} className={"text-blue-400 underline hover:text-blue-300"}>{children} </a>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-(--border) pl-4 text-(--muted) italic">
      {children}
    </blockquote>
  ),
  th: ({ children }) => (
    <th className="text-left font-semibold px-2 py-1 text-(--text-muted)">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-2 py-1 border-b border-(--border) align-top">{children}</td>
  ),
  code({ className, children }) {
    const lang = /language-(\w+)/.exec(className ?? '')?.[1];
    return lang === 'python' ? (
      <ShikiCodeBlock code={String(children).trim()} lang="python" />
    ) : (
      <code className="rounded bg-(--elevated) px-1 py-0.5 text-[0.9em]">{children}</code>
    );
  },
  img: ({ src, alt }) => (
    <img src={src} alt={alt ?? ''} className="max-w-full rounded my-2" />
  ),
};

export function MarkdownRenderer({ children }: MarkdownRendererProps) {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
}
