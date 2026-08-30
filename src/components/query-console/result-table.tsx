'use client';

import { useMemo } from 'react';

interface ResultTableProps {
  columns: string[];
  rows: unknown[][];
  maxRows?: number;
}

export function ResultTable({ columns, rows, maxRows = 1000 }: ResultTableProps) {
  const displayRows = useMemo(() => rows.slice(0, maxRows), [rows, maxRows]);

  if (columns.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">No results</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map(col => (
              <th key={col} className="whitespace-nowrap px-4 py-2 text-left font-mono text-xs font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, i) => (
            <tr key={i} className="border-b border-border/50">
              {row.map((cell, j) => (
                <td key={j} className="whitespace-nowrap px-4 py-2 font-mono text-xs">
                  {cell === null ? (
                    <span className="text-muted-foreground italic">NULL</span>
                  ) : typeof cell === 'number' ? (
                    cell.toLocaleString()
                  ) : (
                    String(cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > maxRows && (
        <p className="px-4 py-2 text-xs text-muted-foreground">
          Showing {maxRows} of {rows.length.toLocaleString()} rows
        </p>
      )}
    </div>
  );
}
