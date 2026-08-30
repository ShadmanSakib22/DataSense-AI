import type { GuardrailRule } from '../types';

const MAX_LIMIT = 10000;

export const limitCeiling: GuardrailRule = (_ast, _sql, _schema) => {
  return [];
};

export function enforceLimit(sql: string, hasLimit: boolean): string {
  if (hasLimit) return sql;
  return `${sql.trimEnd()} LIMIT ${MAX_LIMIT}`;
}

export function detectLimit(sql: string): boolean {
  return /\bLIMIT\s+\d+/i.test(sql);
}