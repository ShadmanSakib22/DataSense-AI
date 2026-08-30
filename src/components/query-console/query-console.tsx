'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Shield, ShieldAlert } from 'lucide-react';
import { ResultTable } from './result-table';
import { cn } from '@/lib/utils';
import type { GuardrailVerdict } from '@/lib/db-engine/types';

interface QueryConsoleProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  generatedSql: string | null;
  verdict: GuardrailVerdict | null;
  resultColumns: string[];
  resultRows: unknown[][];
  onRunQuery: () => void;
}

export function QueryConsole({
  onSubmit,
  isLoading,
  generatedSql,
  verdict,
  resultColumns,
  resultRows,
  onRunQuery,
}: QueryConsoleProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (question.trim()) {
        onSubmit(question.trim());
      }
    },
    [question, onSubmit]
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a question about your data..."
          className="min-h-[60px] flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Ask'}
        </Button>
      </form>

      {generatedSql && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Generated SQL</h4>
            {verdict?.safe ? (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <Shield className="size-3" /> Passed guardrails
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-destructive">
                <ShieldAlert className="size-3" /> Blocked
              </span>
            )}
          </div>
          <pre className="overflow-auto rounded-lg bg-muted p-4 font-mono text-xs">
            {generatedSql}
          </pre>

          {verdict && verdict.reasons.length > 0 && (
            <div className="space-y-1">
              {verdict.reasons.map((reason, i) => (
                <p
                  key={i}
                  className={cn(
                    'text-xs',
                    reason.toLowerCase().startsWith('warning')
                      ? 'text-amber-600'
                      : 'text-destructive'
                  )}
                >
                  {reason}
                </p>
              ))}
            </div>
          )}

          {verdict?.safe && (
            <Button onClick={onRunQuery} variant="outline" size="sm">
              <Play className="mr-1 size-3" /> Run Query
            </Button>
          )}
        </div>
      )}

      {resultColumns.length > 0 && (
        <ResultTable columns={resultColumns} rows={resultRows} />
      )}
    </div>
  );
}
