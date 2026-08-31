'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, Shield, ShieldAlert, AlertTriangle } from 'lucide-react';
import { ResultTable } from './result-table';
import type { GuardrailVerdict } from '@/lib/db-engine/types';

interface QueryConsoleProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  generatedSql: string | null;
  verdict: GuardrailVerdict | null;
  resultColumns: string[];
  resultRows: unknown[][];
  onRunQuery: () => void;
  headerActions?: React.ReactNode;
}

export function QueryConsole({
  onSubmit,
  isLoading,
  generatedSql,
  verdict,
  resultColumns,
  resultRows,
  onRunQuery,
  headerActions,
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
      <div className="flex items-center justify-between">
        <form onSubmit={handleSubmit} className="flex-1 space-y-3">
          <Textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask a question about your data..."
            className="min-h-[80px] resize-none"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={isLoading || !question.trim()} className="gap-2">
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            {isLoading ? 'Thinking...' : 'Ask'}
          </Button>
        </form>
        {headerActions && (
          <div className="ml-3 flex items-center gap-1">
            {headerActions}
          </div>
        )}
      </div>

      {generatedSql && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Generated SQL</h4>
            {verdict?.safe ? (
              <Badge variant="default" className="gap-1 bg-green-600/10 text-green-500 hover:bg-green-600/10">
                <Shield className="size-3" />
                Passed
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <ShieldAlert className="size-3" />
                Blocked
              </Badge>
            )}
          </div>
          <pre className="overflow-auto rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed">
            {generatedSql}
          </pre>

          {verdict && verdict.reasons.length > 0 && (
            <div className="space-y-2">
              {verdict.reasons.map((reason, i) => (
                <Alert key={i} variant={reason.toLowerCase().startsWith('warning') ? 'default' : 'destructive'} className="py-2">
                  {reason.toLowerCase().startsWith('warning') ? (
                    <AlertTriangle className="size-4" />
                  ) : (
                    <ShieldAlert className="size-4" />
                  )}
                  <AlertDescription className="text-xs">
                    {reason}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {verdict?.safe && (
            <Button onClick={onRunQuery} variant="outline" size="sm" className="gap-2">
              <Play className="size-3" />
              Run Query
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
