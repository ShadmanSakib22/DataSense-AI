"use client";

import { Database } from "lucide-react";
import { TableCard } from "./table-card";
import { Badge } from "@/components/ui/badge";
import type { SchemaInfo } from "@/lib/db-engine/types";

interface SchemaExplorerProps {
  schema: SchemaInfo;
}

export function SchemaExplorer({ schema }: SchemaExplorerProps) {
  if (schema.tables.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
        <Database className="size-8" />
        <p className="text-sm">No tables loaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Schema
        </h3>
        <Badge variant="secondary" className="text-xs">
          {schema.tables.length} table{schema.tables.length !== 1 ? "s" : ""}
        </Badge>
      </div>
      <div className="space-y-2">
        {schema.tables.map((table) => (
          <TableCard key={table.name} table={table} />
        ))}
      </div>
    </div>
  );
}
