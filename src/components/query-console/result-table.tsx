'use client';

import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div className="space-y-2">
      <div className="overflow-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col} className="font-mono text-xs">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j} className="font-mono text-xs">
                    {cell === null ? (
                      <span className="text-muted-foreground italic">NULL</span>
                    ) : typeof cell === 'number' ? (
                      cell.toLocaleString()
                    ) : (
                      String(cell)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {rows.length > maxRows && (
        <p className="text-xs text-muted-foreground">
          Showing {maxRows} of {rows.length.toLocaleString()} rows
        </p>
      )}
    </div>
  );
}
