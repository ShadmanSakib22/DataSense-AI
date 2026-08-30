import type { GuardrailRule } from '../types';

export const noMultiStatement: GuardrailRule = (_ast, sql, _schema) => {
  const reasons: string[] = [];
  const trimmed = sql.trim();
  const semicolons = trimmed.split(';').filter(s => s.trim().length > 0);
  if (semicolons.length > 1) {
    reasons.push('Multiple statements are not allowed. Only one SELECT query per execution.');
  }
  return reasons;
};