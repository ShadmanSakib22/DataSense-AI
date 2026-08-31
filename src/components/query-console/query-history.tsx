'use client';

import { Clock, RotateCcw, Trash2, X } from 'lucide-react';
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
  onSelect: (question: string, sql: string) => void;
  onDelete?: (id: number) => void;
  onClear?: () => void;
}

export function QueryHistory({ entries, onSelect, onDelete, onClear }: QueryHistoryProps) {
  const sortedEntries = [...entries].reverse();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Queries
          </h3>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-3" />
            Clear
          </button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">No queries yet.</p>
      ) : (
        <div className="space-y-1">
          {sortedEntries.map(entry => (
            <div
              key={entry.id}
              className="group flex items-start gap-2 rounded-md px-3 py-2 text-xs transition-colors hover:bg-muted/30"
            >
              <button
                onClick={() => onSelect(entry.question, entry.sql)}
                className="flex min-w-0 flex-1 items-start gap-2 text-left"
              >
                <RotateCcw className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                <p className="truncate">{entry.question}</p>
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(entry.id)}
                  className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
