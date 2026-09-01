"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Sparkles,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import { ResultTable } from "./result-table";
import type { GuardrailVerdict } from "@/lib/db-engine/types";
import type { LLMProviderName } from "@/lib/llm/types";

interface QueryConsoleProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  generatedSql: string | null;
  verdict: GuardrailVerdict | null;
  resultColumns: string[];
  resultRows: unknown[][];
  question?: string;
  llmResponse?: string | null;
  activeProvider?: LLMProviderName | null;
  headerActions?: React.ReactNode;
}

export function QueryConsole({
  onSubmit,
  isLoading,
  generatedSql,
  verdict,
  resultColumns,
  resultRows,
  question: displayQuestion,
  llmResponse,
  activeProvider,
  headerActions,
}: QueryConsoleProps) {
  const [question, setQuestion] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopySql = useCallback(() => {
    if (generatedSql) {
      navigator.clipboard.writeText(generatedSql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedSql]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (question.trim()) {
        onSubmit(question.trim());
        setQuestion("");
      }
    },
    [question, onSubmit],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card/50 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your data..."
            className="min-h-[80px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex items-center justify-between gap-2 border-t pt-3">
            <div className="flex gap-1 items-center">
              {headerActions}
              <div className="text-xs text-primary">
                {activeProvider
                  ? activeProvider.charAt(0).toUpperCase() +
                    activeProvider.slice(1)
                  : "No agent"}
              </div>
            </div>

            <div className="border border-primary/50 border-dashed p-1">
              <Button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {isLoading ? "Thinking..." : "Query"}
              </Button>
            </div>
          </div>
        </form>
        {!activeProvider && (
          <Alert variant="destructive" className="mt-3 py-2 leading-0">
            <AlertTriangle className="size-4" />
            <AlertDescription className="text-xs">
              No API key set. Click the brain icon to configure an LLM provider.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {llmResponse && !generatedSql && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Question</h4>
          </div>
          <pre className="overflow-auto rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
            <span className="font-semibold text-primary">Q.</span>{" "}
            {displayQuestion}
          </pre>
          <Alert variant="default" className="py-2">
            <AlertTriangle className="size-4" />
            <AlertDescription className="text-xs whitespace-pre-wrap">
              {llmResponse}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {generatedSql && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Question</h4>
          </div>
          <pre className="overflow-auto rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
            <span className="font-semibold text-primary">Q.</span>{" "}
            {displayQuestion}
          </pre>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Generated SQL</h4>
            {verdict?.safe ? (
              <Badge
                variant="default"
                className="gap-1 bg-green-600/10 text-green-500 hover:bg-green-600/10"
              >
                <Shield className="size-3" />
                Passed
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <ShieldAlert className="size-3" />
                Blocked
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto size-7 text-muted-foreground hover:text-foreground"
              onClick={handleCopySql}
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          </div>
          <pre className="overflow-auto rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
            {generatedSql}
          </pre>

          {verdict && verdict.reasons.length > 0 && (
            <div className="space-y-2">
              {verdict.reasons.map((reason, i) => (
                <Alert
                  key={i}
                  variant={
                    reason.toLowerCase().startsWith("warning")
                      ? "default"
                      : "destructive"
                  }
                  className="py-2"
                >
                  {reason.toLowerCase().startsWith("warning") ? (
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
        </div>
      )}

      {resultColumns.length > 0 && (
        <ResultTable columns={resultColumns} rows={resultRows} />
      )}
    </div>
  );
}
