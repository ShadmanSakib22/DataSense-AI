export type { TableSchema, ColumnInfo, SchemaInfo, GuardrailVerdict, GuardrailRule } from './types';

export function validateSql(_sql: string, _schema: SchemaInfo): GuardrailVerdict {
  throw new Error('Not implemented');
}
