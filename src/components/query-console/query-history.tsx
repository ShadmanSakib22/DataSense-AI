'use client';

import { Clock, RotateCcw } from 'lucide-react';
import type { GuardrailVerdict } from '@/lib/db-engine/types';

interface HistoryEntry {
  id: number;
  question: string;
  sql: string;
  verdict: GuardrailVerdict;
  rowCount: number;
  timestamp: number;
}

interface QueryHistoryProps {
  entries: HistoryEntry[];
  onSelect: (sql: string) => void;
}

export function QueryHistory({ entries, onSelect }: QueryHistoryProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <Clock className="size-3.5 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Queries
        </h3>
      </div>
      <div className="space-y-1">
        {entries.slice(0, 10).map(entry => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry.sql)}
            className="flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-muted/30"
          >
            <RotateCcw className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate">{entry.question}</p>
              <p className="truncate font-mono text-muted-foreground">{entry.sql}</p>
            </div>
            <span className="shrink-0 text-muted-foreground">
              {entry.rowCount} rows
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
