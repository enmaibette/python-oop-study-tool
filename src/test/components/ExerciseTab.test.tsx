import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExerciseTab } from '@/features/exercise-panel/ExerciseTab';
import type { Challenge } from '@/types';

const { MockShikiCodeBlock } = vi.hoisted(() => ({
  MockShikiCodeBlock: ({ code }: { code: string }) => <div data-testid="code-block">{code}</div>,
}));

vi.mock('@/features/exercise-panel/ShikiCodeBlock', () => ({
  ShikiCodeBlock: MockShikiCodeBlock,
}));

const exerciseMarkdown = [
  '## Exercise',
  '',
  'In this challenge, you will implement a basic `BankAccount` class.',
  '',
  '## Requirements',
  '',
  '- Create a class named `BankAccount`',
  '- Implement an `__init__` method that accepts an `owner` and `balance` parameter',
  '- Add a `deposit(amount)` method to add funds',
  '',
  '## Example',
  '',
  '```python',
  'account = BankAccount("Alice", 1000)',
  'account.deposit(500)',
  '```',
].join('\n');

const mockChallenge: Challenge = {
  id: '4',
  title: 'Create a Simple Bank Account Class',
  canvas: false,
  exerciseMarkdown,
  exerciseImages: {filename: '', url: ''},
  starterCode: [{ path: 'solution.py', content: 'class BankAccount:\n    pass\n' }],
  hints: [],
  testCases: [],
  testCasesPy: '',
  assets: [{path: '', url: ''}],
};

describe('ExerciseTab', () => {
  it('renders the challenge title', () => {
    render(<ExerciseTab challenge={mockChallenge} />);
    expect(
      screen.getByRole('heading', { name: 'Create a Simple Bank Account Class', level: 2 }),
    ).toBeInTheDocument();
  });

  it('renders the markdown exercise content', () => {
    render(<ExerciseTab challenge={mockChallenge} />);
    expect(screen.getByText((_, element) => element?.textContent === 'In this challenge, you will implement a basic BankAccount class.')).toBeInTheDocument();
  });

  it('renders markdown section headings', () => {
    render(<ExerciseTab challenge={mockChallenge} />);
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('renders requirement list items', () => {
    render(<ExerciseTab challenge={mockChallenge} />);
    expect(screen.getByText((_, element) => element?.textContent === 'Create a class named BankAccount')).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === 'Add a deposit(amount) method to add funds')).toBeInTheDocument();
  });

  it('renders fenced code blocks via ShikiCodeBlock', () => {
    render(<ExerciseTab challenge={mockChallenge} />);
    const codeBlock = screen.getByTestId('code-block');
    expect(codeBlock).toHaveTextContent('account = BankAccount("Alice", 1000)');
  });
});
