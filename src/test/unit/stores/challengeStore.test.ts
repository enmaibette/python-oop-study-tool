import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useChallengeStore } from '@/stores/challengeStore';
import { challenges as staticChallenges } from '@/data/challenges';

vi.mock('@/lib/db', () => ({
  loadFilesystem: vi.fn().mockResolvedValue(null),
  saveFilesystem: vi.fn().mockResolvedValue(undefined),
}));

const initialState = {
  challenges: staticChallenges,
  activeChallengeId: null,
  editorContent: '',
  activeFilePath: null,
  openFilePaths: [],
  editorContentMap: {},
  fileTree: [],
};

beforeEach(() => {
  useChallengeStore.setState(initialState);
});

describe('challengeStore - initial state', () => {
  it('has 4 challenges', () => {
    const { challenges } = useChallengeStore.getState();
    expect(challenges).toHaveLength(4);
  });

  it('activeChallengeId is null', () => {
    const { activeChallengeId } = useChallengeStore.getState();
    expect(activeChallengeId).toBeNull();
  });

  it('editorContent is an empty string', () => {
    const { editorContent } = useChallengeStore.getState();
    expect(editorContent).toBe('');
  });
});

describe('challengeStore - setActiveChallenge', () => {
  it('sets activeChallengeId to "1"', async () => {
    await useChallengeStore.getState().setActiveChallenge('1');
    expect(useChallengeStore.getState().activeChallengeId).toBe('1');
  });

  it('populates editorContent with the challenge starter code when activating id "1"', async () => {
    await useChallengeStore.getState().setActiveChallenge('1');
    const { editorContent, challenges } = useChallengeStore.getState();
    const challenge1 = challenges.find((c) => c.id === '1')!;
    const firstFile = challenge1.starterCode[0];
    expect(editorContent).toBe(firstFile.content);
  });

  it('handles unknown id without crashing', () => {
    expect(() => {
      useChallengeStore.getState().setActiveChallenge('999');
    }).not.toThrow();
  });

  it('sets activeChallengeId even for an unknown id', async () => {
    await useChallengeStore.getState().setActiveChallenge('999');
    expect(useChallengeStore.getState().activeChallengeId).toBe('999');
  });

  it('sets editorContent to empty string when activating an unknown id', async () => {
    await useChallengeStore.getState().setActiveChallenge('999');
    expect(useChallengeStore.getState().editorContent).toBe('');
  });
});

describe('challengeStore - setEditorContent', () => {
  it('updates editorContent to the provided value', () => {
    useChallengeStore.getState().setEditorContent('foo');
    expect(useChallengeStore.getState().editorContent).toBe('foo');
  });

  it('can update editorContent multiple times', () => {
    useChallengeStore.getState().setEditorContent('first');
    useChallengeStore.getState().setEditorContent('second');
    expect(useChallengeStore.getState().editorContent).toBe('second');
  });
});

describe('challengeStore - resetEditorToStarter', () => {
  it('restores editorContent to the active challenge starterCode', async () => {
    await useChallengeStore.getState().setActiveChallenge('1');
    const { challenges, activeFilePath } = useChallengeStore.getState();
    const challenge1 = challenges.find((c) => c.id === '1')!;
    const map: Record<string, string> = {};
    for (const f of challenge1.starterCode) map[f.path] = f.content;
    const expectedContent = activeFilePath ? (map[activeFilePath] ?? '') : '';

    useChallengeStore.getState().setEditorContent('user modified content');
    useChallengeStore.getState().resetEditorToStarter();

    expect(useChallengeStore.getState().editorContent).toBe(expectedContent);
  });

  it('does nothing when no active challenge is set', () => {
    useChallengeStore.getState().setEditorContent('some content');
    useChallengeStore.getState().resetEditorToStarter();
    expect(useChallengeStore.getState().editorContent).toBe('some content');
  });
});
