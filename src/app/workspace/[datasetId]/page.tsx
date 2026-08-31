"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { sendMessage, initWorker } from "@/lib/db-engine/sqljs-manager";
import {
  loadDataset,
  loadQueryHistory,
  saveQueryHistory,
  deleteQueryHistoryEntry,
  clearQueryHistory,
  clearAllData,
  deleteDataset,
} from "@/lib/storage/indexeddb";
import { SchemaExplorer } from "@/components/schema-explorer/schema-explorer";
import { QueryConsole } from "@/components/query-console/query-console";
import { QueryHistory } from "@/components/query-console/query-history";
import { BYOKPanel } from "@/components/byok/byok-panel";
import { GeminiProvider } from "@/lib/llm/providers/gemini";
import { GroqProvider } from "@/lib/llm/providers/groq";
import { buildSchemaGroundedPrompt } from "@/lib/llm/prompt-builder";
import { extractSql } from "@/lib/llm/sql-extractor";
import { validateSql } from "sql-guardrails";
import {
  suggestChartType,
  prepareChartData,
  type ChartType,
} from "@/lib/chart-defaults";
import { ChartTypePicker } from "@/components/charts/chart-type-picker";
import { ChartBar } from "@/components/charts/chart-bar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Database, History, Trash2 } from "lucide-react";
import type { SchemaInfo, GuardrailVerdict } from "@/lib/db-engine/types";
import type { LLMProvider, LLMProviderName } from "@/lib/llm/types";
import type { ChartConfig } from "@/components/ui/chart";

export default function WorkspacePage() {
  const params = useParams();
  const datasetId = params.datasetId as string;

  const [schema, setSchema] = useState<SchemaInfo>({ tables: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSql, setGeneratedSql] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<GuardrailVerdict | null>(null);
  const [resultColumns, setResultColumns] = useState<string[]>([]);
  const [resultRows, setResultRows] = useState<unknown[][]>([]);
  const [lastQuestion, setLastQuestion] = useState("");
  const [llmResponse, setLlmResponse] = useState<string | null>(null);
  const [history, setHistory] = useState<
    {
      id: number;
      question: string;
      sql: string;
      verdict: GuardrailVerdict;
      rowCount: number;
      timestamp: number;
    }[]
  >([]);
  const [llmProvider, setLlmProvider] = useState<LLMProvider | null>(null);
  const [activeProvider, setActiveProvider] = useState<LLMProviderName | null>(
    null,
  );
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [aiOpen, setAiOpen] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);

  useEffect(() => {
    async function load() {
      initWorker();

      const dataset = await loadDataset(datasetId);
      if (dataset) {
        await sendMessage("init-bytes", { bytes: dataset.dbBytes });
        const schemaResponse = await sendMessage("schema", null);
        if (schemaResponse.type === "schema") {
          setSchema(schemaResponse.payload as SchemaInfo);
        }
      }

      const hist = await loadQueryHistory(datasetId);
      setHistory(hist);

      // Restore API key from localStorage
      const savedGeminiKey = localStorage.getItem("llm_key_gemini");
      const savedGroqKey = localStorage.getItem("llm_key_groq");
      if (savedGeminiKey) {
        setLlmProvider(new GeminiProvider(savedGeminiKey));
        setActiveProvider("gemini");
      } else if (savedGroqKey) {
        setLlmProvider(new GroqProvider(savedGroqKey));
        setActiveProvider("groq");
      }
    }
    load();
  }, [datasetId]);

  const handleKeySet = useCallback((provider: LLMProviderName, key: string) => {
    const p =
      provider === "gemini" ? new GeminiProvider(key) : new GroqProvider(key);
    setLlmProvider(p);
    setActiveProvider(provider);
    localStorage.setItem(`llm_key_${provider}`, key);
  }, []);

  const handleKeyClear = useCallback(() => {
    setLlmProvider(null);
    setActiveProvider(null);
    localStorage.removeItem("llm_key_gemini");
    localStorage.removeItem("llm_key_groq");
  }, []);

  const handleClearHistory = useCallback(async () => {
    await clearQueryHistory(datasetId);
    setHistory([]);
  }, [datasetId]);

  const handleDeleteHistoryEntry = useCallback(async (id: number) => {
    await deleteQueryHistoryEntry(id);
    setHistory(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const handleDeleteDataset = useCallback(async () => {
    if (confirm("Delete this dataset? This cannot be undone.")) {
      await deleteDataset(datasetId);
      window.location.href = "/";
    }
  }, [datasetId]);

  const handleClearAllData = useCallback(async () => {
    if (confirm("Clear all data? This will delete all datasets and history.")) {
      await clearAllData();
      window.location.href = "/";
    }
  }, []);

  const handleSubmit = useCallback(
    async (question: string) => {
      if (!llmProvider) {
        setVerdict({
          safe: false,
          reasons: [
            "Please set an API key first. Click the brain icon to configure.",
          ],
          sanitizedSql: "",
        });
        return;
      }

      setIsLoading(true);
      setLastQuestion(question);
      setGeneratedSql(null);
      setVerdict(null);
      setResultColumns([]);
      setResultRows([]);
      setLlmResponse(null);

      try {
        const { system, user } = buildSchemaGroundedPrompt(question, schema);
        const response = await llmProvider.chat([
          { role: "system", content: system },
          { role: "user", content: user },
        ]);

        const sql = extractSql(response);
        if (!sql) {
          setLlmResponse(response);
          return;
        }

        setGeneratedSql(sql);

        const v = validateSql(sql, schema);
        setVerdict(v);

        let executedRowCount = 0;

        if (v.safe) {
          const result = await sendMessage("exec", { sql: v.sanitizedSql });
          if (result.type === "result") {
            const payload = result.payload as {
              columns: string[];
              rows: unknown[][];
              rowCount: number;
            };
            setResultColumns(payload.columns);
            setResultRows(payload.rows);
            executedRowCount = payload.rows.length;
            setChartType(suggestChartType(payload.columns, payload.rows));
          }
        }

        await saveQueryHistory({
          datasetId,
          question,
          sql,
          verdict: v,
          rowCount: executedRowCount,
        });

        const hist = await loadQueryHistory(datasetId);
        setHistory(hist);
      } catch (err) {
        console.error("AI query failed:", err);
        setVerdict({
          safe: false,
          reasons: [`LLM error: ${String(err)}`],
          sanitizedSql: "",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [llmProvider, schema, datasetId],
  );

  const handleSelectHistory = useCallback(async (question: string, sql: string) => {
    setIsLoading(true);
    setLastQuestion(question);
    setGeneratedSql(sql);
    setResultColumns([]);
    setResultRows([]);

    try {
      const v = validateSql(sql, schema);
      setVerdict(v);

      if (v.safe) {
        const result = await sendMessage("exec", { sql: v.sanitizedSql });
        if (result.type === "result") {
          const payload = result.payload as {
            columns: string[];
            rows: unknown[][];
            rowCount: number;
          };
          setResultColumns(payload.columns);
          setResultRows(payload.rows);
          setChartType(suggestChartType(payload.columns, payload.rows));
        }
      }
    } catch (err) {
      setVerdict({
        safe: false,
        reasons: [`Error: ${String(err)}`],
        sanitizedSql: "",
      });
    } finally {
      setIsLoading(false);
    }
  }, [schema]);

  const chartData = prepareChartData(resultColumns, resultRows, chartType);

  const chartConfig: ChartConfig = resultColumns
    .slice(1)
    .reduce((acc, col, i) => {
      acc[col] = { label: col, color: `var(--chart-${(i % 5) + 1})` };
      return acc;
    }, {} as ChartConfig);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <QueryConsole
            onSubmit={handleSubmit}
            isLoading={isLoading}
            generatedSql={generatedSql}
            verdict={verdict}
            resultColumns={resultColumns}
            resultRows={resultRows}
            question={lastQuestion}
            llmResponse={llmResponse}
            headerActions={
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 text-muted-foreground hover:text-foreground"
                      onClick={() => setAiOpen(true)}
                    >
                      <Brain className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>AI & API Key</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 text-muted-foreground hover:text-foreground"
                      onClick={() => setSchemaOpen(true)}
                    >
                      <Database className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Table details</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 text-muted-foreground hover:text-foreground"
                      onClick={() => setDataOpen(true)}
                    >
                      <History className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>History & Data</TooltipContent>
                </Tooltip>
              </>
            }
          />

          {resultColumns.length > 0 && chartData.length > 0 && (
            <div className="space-y-4 rounded-xl border bg-card/50 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Visualization</h3>
                <ChartTypePicker value={chartType} onChange={setChartType} />
              </div>
              <ChartBar
                data={chartData}
                xKey={resultColumns[0]}
                yKeys={resultColumns.slice(1)}
                config={chartConfig}
              />
            </div>
          )}
        </div>
      </div>

      {/* AI / API Key modal */}
      <Sheet open={aiOpen} onOpenChange={setAiOpen}>
        <SheetContent
          className="w-full lg:w-1/2 p-0"
          showCloseButton={false}
        >
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle>AI & API Key</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100dvh-4rem)]">
            <div className="p-6">
              <BYOKPanel
                onKeySet={handleKeySet}
                onKeyClear={handleKeyClear}
                activeProvider={activeProvider}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Schema / Table details modal */}
      <Sheet open={schemaOpen} onOpenChange={setSchemaOpen}>
        <SheetContent
          className="w-full lg:w-1/2 p-0"
          showCloseButton={false}
        >
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle>Table details</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100dvh-4rem)]">
            <div className="p-6">
              <SchemaExplorer schema={schema} />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* History & Data modal */}
      <Sheet open={dataOpen} onOpenChange={setDataOpen}>
        <SheetContent
          className="w-full lg:w-1/2 p-0 flex flex-col"
          showCloseButton={false}
        >
          <SheetHeader className="border-b px-6 py-4 shrink-0">
            <SheetTitle>History & Data</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-6">
              <Tabs defaultValue="history">
                <TabsList className="w-full">
                  <TabsTrigger value="history" className="flex-1">
                    <History className="size-3.5" />
                    History
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex-1">
                    <Database className="size-3.5" />
                    Data
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="history" className="mt-4">
                  <QueryHistory
                    entries={history}
                    onSelect={handleSelectHistory}
                    onDelete={handleDeleteHistoryEntry}
                    onClear={handleClearHistory}
                  />
                </TabsContent>
                <TabsContent value="data" className="mt-4">
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h4 className="text-sm font-medium">Dataset Actions</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Permanently delete this dataset and all its data.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteDataset}
                        className="w-full"
                      >
                        <Trash2 className="size-3.5 mr-2" />
                        Delete Dataset
                      </Button>
                    </div>
                    <div className="rounded-md border p-4">
                      <h4 className="text-sm font-medium">Danger Zone</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Clear all datasets and query history from this browser.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearAllData}
                        className="w-full"
                      >
                        <Trash2 className="size-3.5 mr-2" />
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
