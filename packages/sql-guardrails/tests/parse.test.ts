import { describe, it, expect } from 'vitest';
import { parseSql } from '../src/parse';

describe('parseSql', () => {
  it('parses a valid SELECT statement', () => {
    const ast = parseSql('SELECT * FROM users');
    expect(ast).toBeDefined();
  });

  it('throws on invalid SQL', () => {
    expect(() => parseSql('NOT VALID SQL AT ALL')).toThrow();
  });

  it('parses SELECT with WHERE clause', () => {
    const ast = parseSql("SELECT name, age FROM users WHERE age > 18");
    expect(ast).toBeDefined();
  });
});
