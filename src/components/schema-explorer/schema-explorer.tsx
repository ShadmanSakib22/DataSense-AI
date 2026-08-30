'use client';

import { Database } from 'lucide-react';
import { TableCard } from './table-card';
import type { SchemaInfo } from '@/lib/db-engine/types';

interface SchemaExplorerProps {
  schema: SchemaInfo;
}

export function SchemaExplorer({ schema }: SchemaExplorerProps) {
  if (schema.tables.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <Database className="size-8" />
        <p>No tables loaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Schema — {schema.tables.length} table{schema.tables.length !== 1 ? 's' : ''}
      </h3>
      {schema.tables.map(table => (
        <TableCard key={table.name} table={table} />
      ))}
    </div>
  );
}
