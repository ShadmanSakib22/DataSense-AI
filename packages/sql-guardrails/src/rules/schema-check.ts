import type { GuardrailRule } from '../types';

export const schemaCheck: GuardrailRule = (ast, _sql, schema) => {
  const reasons: string[] = [];
  const tableNames = new Set(schema.tables.map(t => t.name.toLowerCase()));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const astObj = ast as Record<string, any>;

  const fromTables: Array<{ table?: string }> = [];
  if (Array.isArray(astObj.from)) {
    for (const entry of astObj.from) {
      if (entry && typeof entry.table === 'string') {
        fromTables.push({ table: entry.table });
      }
    }
  }
  if (Array.isArray(astObj.table)) {
    for (const entry of astObj.table) {
      if (entry && typeof entry.table === 'string') {
        fromTables.push({ table: entry.table });
      }
    }
  }

  for (const entry of fromTables) {
    if (entry.table && !tableNames.has(entry.table.toLowerCase())) {
      reasons.push(`Table "${entry.table}" does not exist in the loaded schema.`);
    }
  }

  const tableNameToColumns = new Map<string, Set<string>>();
  for (const table of schema.tables) {
    tableNameToColumns.set(
      table.name.toLowerCase(),
      new Set(table.columns.map(c => c.name.toLowerCase()))
    );
  }

  if (Array.isArray(astObj.columns)) {
    for (const col of astObj.columns) {
      const colExpr = col?.expr;
      if (colExpr?.column && colExpr.column !== '*') {
        const tableName = colExpr.table
          ? colExpr.table.toLowerCase()
          : fromTables[0]?.table?.toLowerCase();
        if (tableName) {
          const cols = tableNameToColumns.get(tableName);
          if (cols && !cols.has(colExpr.column.toLowerCase())) {
            reasons.push(`Column "${colExpr.column}" does not exist in table "${tableName}".`);
          }
        }
      }
    }
  }

  return reasons;
};