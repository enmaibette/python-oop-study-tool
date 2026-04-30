import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, render, act } from '@testing-library/react';
import React from 'react';

const { mockDestroy, MockEditorView, mockEditorStateCreate, capturedOnChangeHolder } =
  vi.hoisted(() => {
    const mockDestroy = vi.fn();
    const capturedOnChangeHolder: { current: ((v: string) => void) | null } = { current: null };
    const MockEditorView = vi.fn(function (this: { destroy: typeof mockDestroy }) {
      this.destroy = mockDestroy;
    });
    const mockEditorStateCreate = vi.fn(() => ({ __type: 'MockEditorState' }));
    return { mockDestroy, MockEditorView, mockEditorStateCreate, capturedOnChangeHolder };
  });

vi.mock('@/lib/codemirrorExtensions', () => ({
  buildExtensions: vi.fn((onChange: (value: string) => void) => {
    capturedOnChangeHolder.current = onChange;
    return ['__mock_extension__'];
  }),
}));

vi.mock('@codemirror/state', () => ({
  EditorState: { create: mockEditorStateCreate },
}));

vi.mock('@codemirror/view', () => ({
  EditorView: MockEditorView,
}));

import { useCodeMirror } from '@/features/editor/useCodeMirror';

// Wrapper component that attaches the ref to a real DOM element on mount
function EditorWrapper(props: { initialDoc: string; onChange: (v: string) => void }) {
  const { containerRef } = useCodeMirror(props);
  return React.createElement('div', { ref: containerRef });
}

beforeEach(() => {
  vi.clearAllMocks();
  capturedOnChangeHolder.current = null;
});

describe('useCodeMirror — return shape', () => {
  it('returns an object with a containerRef property', () => {
    const { result } = renderHook(() =>
      useCodeMirror({ initialDoc: '', onChange: vi.fn() }),
    );
    expect(result.current).toHaveProperty('containerRef');
  });

  it('containerRef is a React ref object (has a "current" key)', () => {
    const { result } = renderHook(() =>
      useCodeMirror({ initialDoc: '', onChange: vi.fn() }),
    );
    expect(result.current.containerRef).toHaveProperty('current');
  });

  it('containerRef.current is null on initial render (no DOM element assigned)', () => {
    const { result } = renderHook(() =>
      useCodeMirror({ initialDoc: '', onChange: vi.fn() }),
    );
    expect(result.current.containerRef.current).toBeNull();
  });
});

describe('useCodeMirror — EditorView construction', () => {
  it('does NOT construct an EditorView when containerRef.current is null', () => {
    renderHook(() => useCodeMirror({ initialDoc: '', onChange: vi.fn() }));
    expect(MockEditorView).not.toHaveBeenCalled();
  });

  it('constructs an EditorView when a container element is present', () => {
    render(React.createElement(EditorWrapper, { initialDoc: 'hello', onChange: vi.fn() }));
    expect(MockEditorView).toHaveBeenCalledTimes(1);
  });

  it('passes the initialDoc to EditorState.create', () => {
    render(React.createElement(EditorWrapper, { initialDoc: 'def foo(): pass', onChange: vi.fn() }));
    expect(mockEditorStateCreate).toHaveBeenCalledWith(
      expect.objectContaining({ doc: 'def foo(): pass' }),
    );
  });

  it('passes the container element as the EditorView parent option', () => {
    const { container } = render(
      React.createElement(EditorWrapper, { initialDoc: '', onChange: vi.fn() }),
    );
    const div = container.firstChild as HTMLDivElement;
    expect(MockEditorView).toHaveBeenCalledWith(
      expect.objectContaining({ parent: div }),
    );
  });
});

describe('useCodeMirror — EditorView.destroy on unmount', () => {
  it('calls EditorView.destroy when the component unmounts', () => {
    const { unmount } = render(
      React.createElement(EditorWrapper, { initialDoc: 'start', onChange: vi.fn() }),
    );
    vi.clearAllMocks();
    unmount();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });
});

describe('useCodeMirror — onChange wiring', () => {
  it('wires the onChange callback through buildExtensions', () => {
    const onChange = vi.fn();
    render(React.createElement(EditorWrapper, { initialDoc: 'init', onChange }));
    act(() => {
      capturedOnChangeHolder.current?.('hello');
    });
    expect(onChange).toHaveBeenCalledWith('hello');
  });

  it('the captured onChange callback can be invoked multiple times', () => {
    const onChange = vi.fn();
    render(React.createElement(EditorWrapper, { initialDoc: 'init', onChange }));
    act(() => {
      capturedOnChangeHolder.current?.('line 1');
      capturedOnChangeHolder.current?.('line 2');
    });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 'line 1');
    expect(onChange).toHaveBeenNthCalledWith(2, 'line 2');
  });

  it('routes onChange calls through onChangeRef — updated callback is used without re-creating the editor', () => {
    const firstOnChange = vi.fn();
    const secondOnChange = vi.fn();

    function Wrapper({ cb }: { cb: (v: string) => void }) {
      const { containerRef } = useCodeMirror({ initialDoc: 'same', onChange: cb });
      return React.createElement('div', { ref: containerRef });
    }

    const { rerender } = render(React.createElement(Wrapper, { cb: firstOnChange }));
    const constructorCallsBefore = (MockEditorView as ReturnType<typeof vi.fn>).mock.calls.length;

    rerender(React.createElement(Wrapper, { cb: secondOnChange }));
    const constructorCallsAfter = (MockEditorView as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(constructorCallsAfter).toBe(constructorCallsBefore);

    act(() => {
      capturedOnChangeHolder.current?.('typed text');
    });

    expect(secondOnChange).toHaveBeenCalledWith('typed text');
    expect(firstOnChange).not.toHaveBeenCalled();
  });
});
