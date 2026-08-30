export function extractSql(response: string): string | null {
  const fencedMatch = response.match(/```(?:sql)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fencedMatch) {
    return cleanSql(fencedMatch[1]);
  }

  const lines = response.split('\n');
  const sqlLines: string[] = [];
  let inSql = false;

  for (const line of lines) {
    const trimmed = line.trim().toUpperCase();
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
      inSql = true;
    }
    if (inSql) {
      sqlLines.push(line);
      if (trimmed.endsWith(';')) break;
    }
  }

  if (sqlLines.length > 0) {
    return cleanSql(sqlLines.join('\n'));
  }

  const selectMatch = response.match(/(SELECT[\s\S]+?)(?:;|$)/i);
  if (selectMatch) {
    return cleanSql(selectMatch[1]);
  }

  return null;
}

function cleanSql(sql: string): string {
  return sql
    .replace(/```/g, '')
    .replace(/;/g, '')
    .trim();
}
