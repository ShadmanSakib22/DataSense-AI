export type { TableSchema, ColumnInfo, SchemaInfo, GuardrailVerdict, GuardrailRule } from './types';

import { parseSql } from './parse';
import { allRules } from './rules';
import { enforceLimit, detectLimit } from './rules/limit-ceiling';
import type { SchemaInfo, GuardrailVerdict } from './types';

export function validateSql(sql: string, schema: SchemaInfo): GuardrailVerdict {
  const reasons: string[] = [];

  let ast: unknown;
  try {
    ast = parseSql(sql);
  } catch (err) {
    return {
      safe: false,
      reasons: [`SQL parsing failed: ${String(err)}`],
      sanitizedSql: sql,
    };
  }

  for (const rule of allRules) {
    const ruleReasons = rule(ast, sql, schema);
    reasons.push(...ruleReasons);
  }

  const hasLimit = detectLimit(sql);
  const sanitizedSql = enforceLimit(sql, hasLimit);

  return {
    safe: reasons.filter(r => !r.toLowerCase().startsWith('warning')).length === 0,
    reasons,
    sanitizedSql,
  };
}
