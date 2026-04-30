import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';

describe('DifficultyBadge', () => {
  it('renders "Easy" text', () => {
    render(<DifficultyBadge difficulty="Easy" />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('renders "Medium" text', () => {
    render(<DifficultyBadge difficulty="Medium" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders "Hard" text', () => {
    render(<DifficultyBadge difficulty="Hard" />);
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('renders Easy as a badge element', () => {
    const { container } = render(<DifficultyBadge difficulty="Easy" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Medium as a badge element', () => {
    const { container } = render(<DifficultyBadge difficulty="Medium" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Hard as a badge element', () => {
    const { container } = render(<DifficultyBadge difficulty="Hard" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
