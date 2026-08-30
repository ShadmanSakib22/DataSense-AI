export interface TableSchema {
  name: string;
  columns: ColumnInfo[];
  rowCount: number;
}

export interface ColumnInfo {
  name: string;
  type: string;
  notnull: number;
  pk: number;
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
