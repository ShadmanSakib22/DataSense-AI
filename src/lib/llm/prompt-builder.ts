import type { SchemaInfo } from '../db-engine/types';

export function buildSchemaGroundedPrompt(
  question: string,
  schema: SchemaInfo
): { system: string; user: string } {
  const schemaDescription = schema.tables
    .map(t => {
      const cols = t.columns.map(c => `  - ${c.name} (${c.type})`).join('\n');
      return `Table: ${t.name} (${t.rowCount} rows)\n${cols}`;
    })
    .join('\n\n');

  const system = `You are a SQL expert. Convert natural language questions to SQLite queries.

Rules:
- ONLY output the SQL query, nothing else
- Use SQLite dialect
- Use table and column names exactly as provided in the schema
- Do not use semicolons
- Do not use DELETE, INSERT, UPDATE, DROP, CREATE, ALTER, or TRUNCATE
- If the question cannot be answered with a SELECT query, explain why instead of writing SQL

Schema:
${schemaDescription}

Examples:
Question: "Show all users"
SQL: SELECT * FROM users

Question: "Count orders per user"
SQL: SELECT user_id, COUNT(*) as order_count FROM orders GROUP BY user_id

Question: "Average total by user"
SQL: SELECT user_id, AVG(total) as avg_total FROM orders GROUP BY user_id`;

  const user = question;

  return { system, user };
}
