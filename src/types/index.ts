export type TestCaseStatus = 'pending' | 'pass' | 'fail';
export type ConsoleTab = 'output' | 'testcases' | 'canvas';

export interface TestCase {
  id: string;
  title: string;
  expected: string;
  got: string;
  status: TestCaseStatus;
}

export interface Hint {
  id: string;
  text: string;
}
export interface StarterCode {
  path: string;
  content: string;
}
export interface Challenge {
  id: string;
  title: string;
  canvas: boolean;
  descriptionMarkdown: string;
  starterCode: StarterCode[];
  hints: Hint[];
  testCases: TestCase[];
  testCasesPy: string;
}

export type FileTreeItem = {
  name: string
  path: string
} & (
  | {type: 'file'; children?: never}
  | {type: 'folder'; children: FileTreeItem[]}
  )
