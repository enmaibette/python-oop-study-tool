import type { FileTreeItem } from '@/types';

function insertNode(tree: FileTreeItem[], parentPath: string, node: FileTreeItem, prefix: string): FileTreeItem[] {
  if (parentPath === '') return [...tree, node];

  const slashIdx = parentPath.indexOf('/');
  const firstName = slashIdx === -1 ? parentPath : parentPath.slice(0, slashIdx);
  const restPath = slashIdx === -1 ? '' : parentPath.slice(slashIdx + 1);
  const fullFolderPath = prefix ? `${prefix}/${firstName}` : firstName;

  const existingIdx = tree.findIndex((n) => n.type === 'folder' && n.name === firstName);

  if (existingIdx !== -1) {
    const existing = tree[existingIdx] as FileTreeItem & { type: 'folder' };
    const updated = tree.slice();
    updated[existingIdx] = { ...existing, children: insertNode(existing.children, restPath, node, fullFolderPath) };
    return updated;
  }

  const newFolder: FileTreeItem = {
    type: 'folder',
    name: firstName,
    path: fullFolderPath,
    children: insertNode([], restPath, node, fullFolderPath),
  };
  return [...tree, newFolder];
}

export function insertNodeInTree(tree: FileTreeItem[], parentPath: string, node: FileTreeItem): FileTreeItem[] {
  return insertNode(tree, parentPath, node, '');
}

export function removeNodeFromTree(tree: FileTreeItem[], path: string): FileTreeItem[] {
  return tree
    .filter((item) => item.path !== path)
    .map((item) =>
      item.type === 'folder'
        ? { ...item, children: removeNodeFromTree(item.children, path) }
        : item
    );
}

export function renameNodeInTree(tree: FileTreeItem[], path: string, newName: string): FileTreeItem[] {
  return tree.map((item) => {
    if (item.path === path) return { ...item, name: newName };
    if (item.type === 'folder') {
      return { ...item, children: renameNodeInTree(item.children, path, newName) };
    }
    return item;
  });
}
