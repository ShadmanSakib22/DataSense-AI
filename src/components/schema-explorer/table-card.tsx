'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TableSchema } from '@/lib/db-engine/types';

interface TableCardProps {
  table: TableSchema;
}

export function TableCard({ table }: TableCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border/50 bg-card/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/30"
      >
        {expanded ? (
          <ChevronDown className="size-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-3.5 text-muted-foreground" />
        )}
        <span className="font-medium">{table.name}</span>
        <Badge variant="secondary" className="ml-auto text-xs">
          {table.rowCount.toLocaleString()} rows
        </Badge>
      </button>
      {expanded && (
        <div className="border-t border-border/50 px-3 py-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="pb-1.5 text-left text-xs font-medium">Column</th>
                <th className="pb-1.5 text-left text-xs font-medium">Type</th>
                <th className="pb-1.5 text-center text-xs font-medium">PK</th>
              </tr>
            </thead>
            <tbody>
              {table.columns.map(col => (
                <tr key={col.name} className="border-t border-border/30">
                  <td className="py-1 font-mono text-xs">{col.name}</td>
                  <td className="py-1 text-xs text-muted-foreground">{col.type}</td>
                  <td className="py-1 text-center">
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
