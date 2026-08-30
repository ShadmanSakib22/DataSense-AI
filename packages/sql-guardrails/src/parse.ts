import { Parser } from 'node-sql-parser';

const parser = new Parser();

export function parseSql(sql: string): unknown {
  const ast = parser.astify(sql, { database: 'SQLite' });
  return ast;
}
