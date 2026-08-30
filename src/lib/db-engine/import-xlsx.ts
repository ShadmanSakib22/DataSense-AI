import type { ParseResult } from './import-csv';

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

export async function parseXlsxFile(file: File): Promise<ParseResult[]> {
  const XLSX = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  const results: ParseResult[] = [];

  for (const sheetName of workbook.Sheets) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: null,
      raw: false,
    });

    if (data.length === 0) continue;

    const headers = Object.keys(data[0]);

    const columns = headers.map(h => {
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

    const tableName = sheetName.replace(/[^a-zA-Z0-9_]/g, '_');
    results.push({ tableName, columns, rows });
  }

  return results;
}
