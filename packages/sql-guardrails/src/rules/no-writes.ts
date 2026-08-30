import type { GuardrailRule } from '../types';

const WRITE_KEYWORDS = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE', 'REPLACE', 'MERGE'];

export const noWrites: GuardrailRule = (ast, _sql, _schema) => {
  const reasons: string[] = [];
  const astObj = ast as { type?: string; keyword?: string; table?: { table?: string } };

  const stmtType = astObj.type?.toUpperCase() || '';
  const keyword = astObj.keyword?.toUpperCase() || '';
  if (WRITE_KEYWORDS.includes(stmtType) || WRITE_KEYWORDS.includes(keyword)) {
    const display = astObj.type || astObj.keyword;
    reasons.push(`Statement type "${display}" is not allowed. Only SELECT queries are permitted.`);
  }

  return reasons;
};