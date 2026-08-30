import Papa from 'papaparse';

export interface ParseResult {
  tableName: string;
  columns: { name: string; type: string }[];
  rows: unknown[][];
}

function inferType(values: unknown[]): string {
  for (const val of values) {
    if (val === '' || val === null || val === undefined) continue;
    if (typeof val === 'number') return 'REAL';
    const num = Number(val);
    if (!isNaN(num) && val !== '') return 'REAL';
    break;
  }
  return 'TEXT';
}

function sanitizeColumnName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^(\d)/, '_$1') || 'col';
}

export async function parseCsvFile(file: File): Promise<ParseResult> {
  const text = await file.text();
  const result = Papa.parse(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV parsing error: ${result.errors[0].message}`);
  }

  const headers = result.meta.fields || [];
  const data = result.data as Record<string, unknown>[];

  const columns = headers.map((h) => {
    const sampleValues = data.slice(0, 100).map(row => row[h]);
    return {
      name: sanitizeColumnName(h),
      type: inferType(sampleValues),
    };
  });

  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined || val === '') return null;
      if (typeof val === 'number') return val;
      const num = Number(val);
      if (!isNaN(num) && val !== '') return num;
      return String(val);
    })
  );

  const tableName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_');

  return { tableName, columns, rows };
}
