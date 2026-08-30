export type ChartType = 'area' | 'bar' | 'line' | 'pie' | 'radar' | 'radial';

export function suggestChartType(
  columns: string[],
  rows: unknown[][]
): ChartType {
  if (rows.length === 0) return 'bar';
  if (columns.length < 2) return 'bar';

  const secondColSample = rows.slice(0, 20).map(r => r[1]);
  const isNumeric = secondColSample.every(v => typeof v === 'number' || v === null);
  const firstColSample = rows.slice(0, 20).map(r => r[0]);
  const isDateLike = firstColSample.every(v => {
    if (typeof v !== 'string') return false;
    return !isNaN(Date.parse(v));
  });

  if (isDateLike && isNumeric) return 'line';
  if (rows.length <= 8 && isNumeric) return 'pie';
  if (columns.length >= 3 && isNumeric) return 'radar';
  return 'bar';
}

export function prepareChartData(
  columns: string[],
  rows: unknown[][],
  chartType: ChartType
): Record<string, unknown>[] {
  if (chartType === 'pie') {
    return rows.slice(0, 10).map((row, i) => ({
      name: String(row[0]),
      value: typeof row[1] === 'number' ? row[1] : 0,
      fill: `var(--chart-${(i % 5) + 1})`,
    }));
  }

  if (chartType === 'radar') {
    return rows.slice(0, 8).map(row => {
      const entry: Record<string, unknown> = { subject: String(row[0]) };
      for (let i = 1; i < columns.length; i++) {
        entry[columns[i]] = typeof row[i] === 'number' ? row[i] : 0;
      }
      return entry;
    });
  }

  return rows.map(row => {
    const entry: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      entry[col] = row[i];
    });
    return entry;
  });
}
