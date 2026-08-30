import { describe, it, expect } from 'vitest';
import { extractSql } from '../sql-extractor';

describe('extractSql', () => {
  it('extracts SQL from fenced code block', () => {
    const response = 'Here is the query:\n```sql\nSELECT * FROM users\n```\nLet me know.';
    expect(extractSql(response)).toBe('SELECT * FROM users');
  });

  it('extracts SQL from plain text', () => {
    const response = 'SELECT name FROM users WHERE age > 18';
    expect(extractSql(response)).toBe('SELECT name FROM users WHERE age > 18');
  });

  it('returns null for non-SQL response', () => {
    const response = 'I cannot answer that question because it is not related to data.';
    expect(extractSql(response)).toBeNull();
  });

  it('removes semicolons', () => {
    const response = '```sql\nSELECT * FROM users;\n```';
    expect(extractSql(response)).toBe('SELECT * FROM users');
  });
});
