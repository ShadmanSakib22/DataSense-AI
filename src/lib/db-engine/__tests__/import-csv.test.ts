import { describe, it, expect } from 'vitest';
import { parseCsvFile } from '../import-csv';

describe('parseCsvFile', () => {
  it('parses CSV with headers', async () => {
    const csv = 'name,age,email\nAlice,30,alice@test.com\nBob,25,bob@test.com';
    const blob = new Blob([csv], { type: 'text/csv' });
    const file = new File([blob], 'test.csv', { type: 'text/csv' });

    const result = await parseCsvFile(file);
    expect(result.tableName).toBe('test');
    expect(result.columns).toHaveLength(3);
    expect(result.rows).toHaveLength(2);
  });

  it('detects numeric columns', async () => {
    const csv = 'id,value\n1,42\n2,100';
    const blob = new Blob([csv], { type: 'text/csv' });
    const file = new File([blob], 'data.csv', { type: 'text/csv' });

    const result = await parseCsvFile(file);
    expect(result.columns[0].type).toBe('REAL');
    expect(result.columns[1].type).toBe('REAL');
  });
});
