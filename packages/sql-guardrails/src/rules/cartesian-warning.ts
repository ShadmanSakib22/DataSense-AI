import type { GuardrailRule } from '../types';

export const cartesianWarning: GuardrailRule = (_ast, sql, _schema) => {
  const reasons: string[] = [];
  const lowerSql = sql.toLowerCase();

  if (lowerSql.includes(',') && lowerSql.includes('from')) {
    const fromMatch = lowerSql.match(/from\s+(.+?)(?:where|group|order|limit|$)/s);
    if (fromMatch) {
      const tableList = fromMatch[1].trim();
      if (tableList.includes(',') && !tableList.includes('join')) {
        reasons.push('Warning: Query may produce a cartesian product. Consider using JOIN with a ON clause.');
      }
    }
  }

  return reasons;
};