'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Key } from 'lucide-react';
import type { TableSchema } from '@/lib/db-engine/types';

interface TableCardProps {
  table: TableSchema;
}

export function TableCard({ table }: TableCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border bg-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted/50"
      >
        {expanded ? (
          <ChevronDown className="size-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground" />
        )}
        <span className="font-medium">{table.name}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {table.rowCount.toLocaleString()} rows
        </span>
      </button>
      {expanded && (
        <div className="border-t px-4 py-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="pb-2 text-left font-medium">Column</th>
                <th className="pb-2 text-left font-medium">Type</th>
                <th className="pb-2 text-center font-medium">PK</th>
              </tr>
            </thead>
            <tbody>
              {table.columns.map(col => (
                <tr key={col.name} className="border-t border-border/50">
                  <td className="py-1.5 font-mono text-xs">{col.name}</td>
                  <td className="py-1.5 text-xs text-muted-foreground">{col.type}</td>
                  <td className="py-1.5 text-center">
                    {col.pk ? <Key className="mx-auto size-3 text-amber-500" /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
