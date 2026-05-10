import type { Challenge, Hint, TestCase } from '@/types';

interface ChallengeFiles {
  descriptionMarkdown?: string;
  hintsMarkdown?: string;
  exampleCodeFiles: Array<{ path: string; content: string }>;
  assetFiles: Array<{ path: string; url: string }>;
  testCasePy?: string;
}

const descriptionModules = import.meta.glob('./*/description.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const hintsModules = import.meta.glob('./*/hints.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const exampleCodeModules = import.meta.glob('./*/exampleCode/**', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const assetUrlModules = import.meta.glob('./*/exampleCode/**', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const testcaseModules = import.meta.glob('./*/testcase.py', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

function getFolderName(filePath: string): string {
  const folder = filePath.split('/')[1];
  if (!folder) throw new Error(`Invalid challenge file path: ${filePath}`);
  return folder;
}

function getPrefix(folderName: string): string {
  const match = folderName.match(/^(\d+)-/);
  if (!match) throw new Error(`Challenge folder name must start with a numeric prefix: ${folderName}`);
  return match[1];
}

function createChallengeFiles(): Map<string, ChallengeFiles> {
  const files = new Map<string, ChallengeFiles>();

  const getOrCreate = (folder: string) => {
    const existing = files.get(folder);
    if (existing) return existing;
    const created: ChallengeFiles = { exampleCodeFiles: [], assetFiles: [] };
    files.set(folder, created);
    return created;
  };

  for (const [filePath, content] of Object.entries(descriptionModules)) {
    getOrCreate(getFolderName(filePath)).descriptionMarkdown = content;
  }
  for (const [filePath, content] of Object.entries(hintsModules)) {
    getOrCreate(getFolderName(filePath)).hintsMarkdown = content;
  }
  for (const [filePath, content] of Object.entries(exampleCodeModules)) {
    if (filePath.endsWith('.py')) {
      getOrCreate(getFolderName(filePath)).exampleCodeFiles.push({ path: filePath, content });
    }
  }
  for (const [filePath, url] of Object.entries(assetUrlModules)) {
    if (!filePath.endsWith('.py')) {
      getOrCreate(getFolderName(filePath)).assetFiles.push({ path: filePath, url });
    }
  }
  for (const [filePath, content] of Object.entries(testcaseModules)) {
    getOrCreate(getFolderName(filePath)).testCasePy = content;
  }

  return files;
}

function parseFrontmatter(markdown: string): { frontmatter: Record<string, string>; body: string } {
  const lines = markdown.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') {
    throw new Error('Challenge description.md must start with frontmatter (---).');
  }

  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') { endIndex = i; break; }
  }
  if (endIndex === -1) throw new Error('Challenge description.md frontmatter is missing closing ---.');

  const frontmatter: Record<string, string> = {};
  for (const entry of lines.slice(1, endIndex)) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^([A-Za-z0-9_-]+)\s*:\s*(.+)$/);
    if (!match) continue;
    frontmatter[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
  }

  return { frontmatter, body: lines.slice(endIndex + 1).join('\n') };
}


function parseDescriptionDocument(markdown: string): { id: string; title: string; canvas: boolean; descriptionMarkdown: string } {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const { id, title, canvas} = frontmatter;
  if (!id || !title) {
    throw new Error('Challenge description.md is missing required metadata (id, title, canvas).');
  }
  return { id, title, canvas: Boolean(canvas),descriptionMarkdown: body.trim() };
}

function parseHints(markdown: string): Hint[] {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*•–—]\s+/.test(line))
    .map((line, index) => ({
      id: `h${index + 1}`,
      text: line.replace(/^[-*•–—]\s+/, '').trim(),
    }));
}

function parseTestCasesFromPy(pyContent: string): TestCase[] {
  const regex = /def (test_\w+)\(self\):\s*"""([\s\S]*?)"""/g;
  const results: TestCase[] = [];
  let match;
  while ((match = regex.exec(pyContent)) !== null) {
    const lines = match[2].trim().split('\n');
    const title = lines[0].trim();
    const expectedLine = lines.find((l) => l.includes('Expected:'));
    const expected = expectedLine ? expectedLine.split('Expected:')[1].trim() : '';
    results.push({ id: match[1], title, expected, got: '—', status: 'pending' });
  }
  return results;
}

function validateAndBuildChallenge(folderName: string, files: ChallengeFiles): Challenge {
  const prefix = getPrefix(folderName);
  if (!files.descriptionMarkdown) throw new Error(`Missing description.md for ${folderName}.`);
  if (!files.hintsMarkdown) throw new Error(`Missing hints.md for ${folderName}.`);
  if (!files.testCasePy) throw new Error(`Missing testcase.py for ${folderName}.`);
  if (files.exampleCodeFiles.length === 0) throw new Error(`Missing exampleCode/*.py for ${folderName}.`);

  const parsed = parseDescriptionDocument(files.descriptionMarkdown);
  if (parsed.id !== prefix) {
    throw new Error(`description.md id (${parsed.id}) does not match folder prefix (${prefix}) in ${folderName}.`);
  }

  const starterCode = files.exampleCodeFiles.map(f => ({
    path: f.path.replace(/^\.\//, '').replace(/\/exampleCode\//, '/'),
    content: f.content.replace(/\r\n/g, '\n').replace(/\r/g, '\n'),
  }));

  const assets = files.assetFiles.map(f => ({
    path: f.path.replace(/^\.\//, '').replace(/\/exampleCode\//, '/'),
    url: f.url,
  }));

  return {
    id: prefix,
    title: parsed.title,
    canvas: parsed.canvas,
    descriptionMarkdown: parsed.descriptionMarkdown,
    starterCode,
    hints: parseHints(files.hintsMarkdown),
    testCases: parseTestCasesFromPy(files.testCasePy),
    testCasesPy: files.testCasePy!,
    assets,
  };
}

const challengeFilesByFolder = createChallengeFiles();
const folderNames = [...challengeFilesByFolder.keys()].sort((a, b) => {
  const prefixA = Number.parseInt(getPrefix(a), 10);
  const prefixB = Number.parseInt(getPrefix(b), 10);
  return prefixA - prefixB || a.localeCompare(b);
});

const prefixes = new Set<string>();

export const challenges: Challenge[] = folderNames.map((folderName) => {
  const prefix = getPrefix(folderName);
  if (prefixes.has(prefix)) throw new Error(`Duplicate challenge prefix detected: ${prefix}`);
  prefixes.add(prefix);

  const files = challengeFilesByFolder.get(folderName);
  if (!files) throw new Error(`Missing files for challenge folder ${folderName}.`);

  return validateAndBuildChallenge(folderName, files);
});
