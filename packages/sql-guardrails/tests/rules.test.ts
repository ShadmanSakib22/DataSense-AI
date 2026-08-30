import { describe, it, expect } from 'vitest';
import { validateSql } from '../src/index';
import type { SchemaInfo } from '../src/types';

const testSchema: SchemaInfo = {
  tables: [
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'INTEGER', notnull: 0, pk: 1 },
        { name: 'name', type: 'TEXT', notnull: 0, pk: 0 },
        { name: 'email', type: 'TEXT', notnull: 0, pk: 0 },
      ],
      rowCount: 100,
    },
    {
      name: 'orders',
      columns: [
        { name: 'id', type: 'INTEGER', notnull: 0, pk: 1 },
        { name: 'user_id', type: 'INTEGER', notnull: 0, pk: 0 },
        { name: 'total', type: 'REAL', notnull: 0, pk: 0 },
      ],
      rowCount: 500,
    },
  ],
};

describe('guardrail rules', () => {
  it('allows safe SELECT', () => {
    const result = validateSql('SELECT name FROM users', testSchema);
    expect(result.safe).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it('rejects DELETE', () => {
    const result = validateSql('DELETE FROM users', testSchema);
    expect(result.safe).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('rejects INSERT', () => {
    const result = validateSql("INSERT INTO users (name) VALUES ('test')", testSchema);
    expect(result.safe).toBe(false);
  });

  it('rejects UPDATE', () => {
    const result = validateSql("UPDATE users SET name = 'test'", testSchema);
    expect(result.safe).toBe(false);
  });

  it('rejects DROP TABLE', () => {
    const result = validateSql('DROP TABLE users', testSchema);
    expect(result.safe).toBe(false);
  });

  it('rejects CREATE TABLE', () => {
    const result = validateSql('CREATE TABLE test (id INTEGER)', testSchema);
    expect(result.safe).toBe(false);
  });

  it('rejects multi-statement', () => {
    const result = validateSql('SELECT * FROM users; SELECT * FROM orders', testSchema);
    expect(result.safe).toBe(false);
  });

  it('rejects unknown table', () => {
    const result = validateSql('SELECT * FROM nonexistent', testSchema);
    expect(result.safe).toBe(false);
  });

  it('rejects unknown column', () => {
    const result = validateSql('SELECT nonexistent FROM users', testSchema);
    expect(result.safe).toBe(false);
  });

  it('injects LIMIT when missing', () => {
    const result = validateSql('SELECT * FROM users', testSchema);
    expect(result.sanitizedSql.toLowerCase()).toContain('limit');
  });

  it('preserves existing LIMIT', () => {
    const result = validateSql('SELECT * FROM users LIMIT 10', testSchema);
    expect(result.sanitizedSql).toContain('10');
  });

  it('warns on cartesian join', () => {
    const result = validateSql('SELECT * FROM users, orders', testSchema);
    expect(result.safe).toBe(true);
    expect(result.reasons.some(r => r.toLowerCase().includes('cartesian'))).toBe(true);
  });

  it('rejects dangerous functions', () => {
    const result = validateSql("SELECT load_extension('evil')", testSchema);
    expect(result.safe).toBe(false);
  });

  it('rejects PRAGMA', () => {
    const result = validateSql('PRAGMA table_info(users)', testSchema);
    expect(result.safe).toBe(false);
  });
});