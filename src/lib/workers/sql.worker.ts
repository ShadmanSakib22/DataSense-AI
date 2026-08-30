import initSqlJs, { type Database } from 'sql.js';
import type {
  WorkerRequest,
  WorkerResponse,
  InitBytesPayload,
  InitSqlPayload,
  ImportCsvPayload,
  ImportXlsxPayload,
  ExecPayload,
  SchemaPayload,
  TableSchema,
} from '../db-engine/types';

const ctx = self as unknown as DedicatedWorkerGlobalScope;
let db: Database | null = null;

const respond = (resp: WorkerResponse) => ctx.postMessage(resp);

async function initDb(): Promise<void> {
  if (db) return;
  const SQL = await initSqlJs({
    locateFile: (file: string) => `/sql-wasm.wasm`,
  });
  db = new SQL.Database();
}

function getSchema(): SchemaPayload {
  if (!db) return { tables: [] };

  const tablesResult = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  const tables: TableSchema[] = [];

  if (tablesResult.length > 0) {
    for (const row of tablesResult[0].values) {
      const tableName = row[0] as string;
      const pragmaResult = db.exec(`PRAGMA table_info("${tableName}")`);
      const columns = pragmaResult.length > 0
        ? pragmaResult[0].values.map((col: unknown[]) => ({
            name: col[1] as string,
            type: col[2] as string,
            notnull: col[3] as number,
            pk: col[4] as number,
          }))
        : [];

      const countResult = db.exec(`SELECT COUNT(*) FROM "${tableName}"`);
      const rowCount = countResult.length > 0 ? (countResult[0].values[0][0] as number) : 0;

      tables.push({ name: tableName, columns, rowCount });
    }
  }

  return { tables };
}

ctx.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, type, payload } = e.data;

  try {
    await initDb();

    switch (type) {
      case 'init-bytes': {
        const { bytes } = payload as InitBytesPayload;
        const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
        db = new SQL.Database(new Uint8Array(bytes));
        respond({ id, type: 'ready', payload: null });
        break;
      }

      case 'init-sql': {
        const { sql } = payload as InitSqlPayload;
        db!.run(sql);
        respond({ id, type: 'ready', payload: null });
        break;
      }

      case 'import-csv': {
        const { tableName, columns, rows } = payload as ImportCsvPayload;
        const colDefs = columns.map(c => `"${c.name}" ${c.type}`).join(', ');
        db!.run(`CREATE TABLE IF NOT EXISTS "${tableName}" (${colDefs})`);
        const placeholders = columns.map(() => '?').join(', ');
        const stmt = db!.prepare(`INSERT INTO "${tableName}" VALUES (${placeholders})`);
        for (const row of rows) {
          stmt.run(row);
        }
        stmt.free();
        respond({ id, type: 'ready', payload: null });
        break;
      }

      case 'import-xlsx': {
        const { tableName, columns, rows } = payload as ImportXlsxPayload;
        const colDefs = columns.map(c => `"${c.name}" ${c.type}`).join(', ');
        db!.run(`CREATE TABLE IF NOT EXISTS "${tableName}" (${colDefs})`);
        const placeholders = columns.map(() => '?').join(', ');
        const stmt = db!.prepare(`INSERT INTO "${tableName}" VALUES (${placeholders})`);
        for (const row of rows) {
          stmt.run(row);
        }
        stmt.free();
        respond({ id, type: 'ready', payload: null });
        break;
      }

      case 'exec': {
        const { sql } = payload as ExecPayload;
        const result = db!.exec(sql);
        if (result.length === 0) {
          respond({ id, type: 'result', payload: { columns: [], rows: [], rowCount: 0 } });
        } else {
          respond({
            id,
            type: 'result',
            payload: {
              columns: result[0].columns,
              rows: result[0].values,
              rowCount: result[0].values.length,
            },
          });
        }
        break;
      }

      case 'schema': {
        respond({ id, type: 'schema', payload: getSchema() });
        break;
      }

      case 'export': {
        const data = db!.export();
        respond({ id, type: 'exported', payload: { bytes: data } });
        break;
      }

      default:
        respond({ id, type: 'error', payload: `Unknown message type: ${type}` });
    }
  } catch (err) {
    respond({ id, type: 'error', payload: String(err) });
  }
};