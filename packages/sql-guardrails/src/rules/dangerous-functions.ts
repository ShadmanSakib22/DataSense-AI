import type { GuardrailRule } from '../types';

const DANGEROUS_FUNCTIONS = [
  'load_extension', 'readfile', 'writefile', 'glob',
  'randomblob', 'zeroblob', 'likelihood', 'unlikely',
  'total_changes', 'scratch_path',
];

export const dangerousFunctions: GuardrailRule = (_ast, sql, _schema) => {
  const reasons: string[] = [];
  const lowerSql = sql.toLowerCase();
  for (const fn of DANGEROUS_FUNCTIONS) {
    if (lowerSql.includes(fn + '(')) {
      reasons.push(`Function "${fn}" is not allowed for security reasons.`);
    }
  }
  return reasons;
};