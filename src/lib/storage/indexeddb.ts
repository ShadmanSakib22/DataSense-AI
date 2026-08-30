import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'datasense-ai';
const DB_VERSION = 1;

export interface DatasenseDB {
  datasets: {
    key: string;
    value: {
      id: string;
      name: string;
      dbBytes: Uint8Array;
      schema: unknown;
      createdAt: number;
    };
  };
  queryHistory: {
    key: number;
    value: {
      id: number;
      datasetId: string;
      question: string;
      sql: string;
      verdict: unknown;
      rowCount: number;
      timestamp: number;
    };
    indexes: { 'by-dataset': string };
  };
}

let dbPromise: Promise<IDBPDatabase<DatasenseDB>> | null = null;

function getDb(): Promise<IDBPDatabase<DatasenseDB>> {
  if (!dbPromise) {
    dbPromise = openDB<DatasenseDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('datasets')) {
          db.createObjectStore('datasets', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('queryHistory')) {
          const store = db.createObjectStore('queryHistory', {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('by-dataset', 'datasetId');
        }
      },
    });
  }
  return dbPromise;
}

export async function saveDataset(
  id: string,
  name: string,
  dbBytes: Uint8Array,
  schema: unknown
): Promise<void> {
  const db = await getDb();
  await db.put('datasets', {
    id,
    name,
    dbBytes,
    schema,
    createdAt: Date.now(),
  });
}

export async function loadDataset(id: string) {
  const db = await getDb();
  return db.get('datasets', id);
}

export async function deleteDataset(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('datasets', id);
}

export async function listDatasets() {
  const db = await getDb();
  return db.getAll('datasets');
}

export async function saveQueryHistory(entry: {
  datasetId: string;
  question: string;
  sql: string;
  verdict: unknown;
  rowCount: number;
}): Promise<number> {
  const db = await getDb();
  return db.add('queryHistory', {
    ...entry,
    id: 0,
    timestamp: Date.now(),
  }) as Promise<number>;
}

export async function loadQueryHistory(datasetId: string) {
  const db = await getDb();
  return db.getAllFromIndex('queryHistory', 'by-dataset', datasetId);
}
