export interface WorkerRequest {
  id: string;
  type: 'init-bytes' | 'init-sql' | 'import-csv' | 'import-xlsx' | 'exec' | 'export' | 'schema';
  payload: unknown;
}

export interface WorkerResponse {
  id: string;
  type: 'ready' | 'schema' | 'result' | 'error' | 'exported';
  payload: unknown;
}

export interface InitBytesPayload {
  bytes: Uint8Array;
}

export interface InitSqlPayload {
  sql: string;
}

export interface ImportCsvPayload {
  tableName: string;
  columns: { name: string; type: string }[];
  rows: unknown[][];
}

export interface ImportXlsxPayload {
  tableName: string;
  columns: { name: string; type: string }[];
  rows: unknown[][];
}

export interface ExecPayload {
  sql: string;
}

export interface SchemaPayload {
  tables: {
    name: string;
    columns: { name: string; type: string; notnull: number; pk: number }[];
    rowCount: number;
  }[];
}

export interface ResultPayload {
  columns: string[];
  rows: unknown[][];
  rowCount: number;
}

export interface ExportedPayload {
  bytes: Uint8Array;
}

export interface ColumnInfo {
  name: string;
  type: string;
  notnull: number;
  pk: number;
}

export interface TableSchema {
  name: string;
  columns: ColumnInfo[];
  rowCount: number;
}

export interface SchemaInfo {
  tables: TableSchema[];
}

export interface GuardrailVerdict {
  safe: boolean;
  reasons: string[];
  sanitizedSql: string;
}

export type GuardrailRule = (
  ast: unknown,
  sql: string,
  schema: SchemaInfo
) => string[];
