import { FileTreeItem } from '@/types';
import { openDB } from 'idb';

const DB_NAME = 'pyoop_db';
const STORE = 'challenge_store'
export interface FileSystemRecord {
  files: Record<string, string>;
  fileTree: FileTreeItem[];
}

function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db)  {
      db.createObjectStore(STORE)
    }
  })
}

export async function loadFilesystem(challengeId: string): Promise<FileSystemRecord | undefined> {
  const db = await getDB()
  return db.get(STORE, challengeId)
}
export async function saveFilesystem(challengeId: string, fileSystemRecord: FileSystemRecord) {
  const db = await getDB()
  await db.put(STORE, fileSystemRecord, challengeId)
}
export async function loadBinaryFiles(challengeId: string): Promise<Record<string, ArrayBuffer> | undefined> {
  const db = await getDB()
  return db.get(STORE, `${challengeId}:binary`)
}
export async function saveBinaryFiles(challengeId: string, binaryFiles: Record<string, ArrayBuffer>) {
  const db = await getDB()
  await db.put(STORE, binaryFiles, `${challengeId}:binary`)
}
export async function deleteFilesystem(challengeId: string) {
  const db = await getDB()
  await db.delete(STORE, challengeId)
}
export async function deleteBinaryFiles(challengeId: string) {
  const db = await getDB()
  await db.delete(STORE, `${challengeId}:binary`)
}