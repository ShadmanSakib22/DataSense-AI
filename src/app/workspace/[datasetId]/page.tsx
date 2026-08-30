'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { sendMessage, initWorker } from '@/lib/db-engine/sqljs-manager';
import { loadDataset, loadQueryHistory, saveQueryHistory } from '@/lib/storage/indexeddb';
import { SchemaExplorer } from '@/components/schema-explorer/schema-explorer';
import { QueryConsole } from '@/components/query-console/query-console';
import { QueryHistory } from '@/components/query-console/query-history';
import { BYOKPanel } from '@/components/byok/byok-panel';
import { GeminiProvider } from '@/lib/llm/providers/gemini';
import { GroqProvider } from '@/lib/llm/providers/groq';
import { buildSchemaGroundedPrompt } from '@/lib/llm/prompt-builder';
import { extractSql } from '@/lib/llm/sql-extractor';
import { validateSql } from 'sql-guardrails';
import { suggestChartType, prepareChartData, type ChartType } from '@/lib/chart-defaults';
import { ChartTypePicker } from '@/components/charts/chart-type-picker';
import { ChartBar } from '@/components/charts/chart-bar';
import type { SchemaInfo, GuardrailVerdict } from '@/lib/db-engine/types';
import type { LLMProvider, LLMProviderName } from '@/lib/llm/types';
import type { ChartConfig } from '@/components/ui/chart';

export default function WorkspacePage() {
  const params = useParams();
  const datasetId = params.datasetId as string;

  const [schema, setSchema] = useState<SchemaInfo>({ tables: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSql, setGeneratedSql] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<GuardrailVerdict | null>(null);
  const [resultColumns, setResultColumns] = useState<string[]>([]);
  const [resultRows, setResultRows] = useState<unknown[][]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [llmProvider, setLlmProvider] = useState<LLMProvider | null>(null);
  const [activeProvider, setActiveProvider] = useState<LLMProviderName | null>(null);
  const [chartType, setChartType] = useState<ChartType>('bar');

  useEffect(() => {
    async function load() {
      initWorker();

      const dataset = await loadDataset(datasetId);
      if (dataset) {
        await sendMessage('init-bytes', { bytes: dataset.dbBytes });
        const schemaResponse = await sendMessage('schema', null);
        if (schemaResponse.type === 'schema') {
          setSchema(schemaResponse.payload as SchemaInfo);
        }
      }

      const hist = await loadQueryHistory(datasetId);
      setHistory(hist);
    }
    load();
  }, [datasetId]);

  const handleKeySet = useCallback((provider: LLMProviderName, key: string) => {
    const p = provider === 'gemini' ? new GeminiProvider(key) : new GroqProvider(key);
    setLlmProvider(p);
    setActiveProvider(provider);
    sessionStorage.setItem(`llm_key_${provider}`, key);
  }, []);

  const handleKeyClear = useCallback(() => {
    setLlmProvider(null);
    setActiveProvider(null);
    sessionStorage.removeItem('llm_key_gemini');
    sessionStorage.removeItem('llm_key_groq');
  }, []);

  const handleSubmit = useCallback(
    async (question: string) => {
      if (!llmProvider) return;

      setIsLoading(true);
      setGeneratedSql(null);
      setVerdict(null);
      setResultColumns([]);
      setResultRows([]);

      try {
        const { system, user } = buildSchemaGroundedPrompt(question, schema);
        const response = await llmProvider.chat([
          { role: 'system', content: system },
          { role: 'user', content: user },
        ]);

        const sql = extractSql(response);
        if (!sql) {
          setGeneratedSql(null);
          setVerdict({ safe: false, reasons: ['Could not extract SQL from the response.'], sanitizedSql: '' });
          return;
        }

        setGeneratedSql(sql);

        const v = validateSql(sql, schema);
        setVerdict(v);

        if (v.safe) {
          const result = await sendMessage('exec', { sql: v.sanitizedSql });
          if (result.type === 'result') {
            const payload = result.payload as { columns: string[]; rows: unknown[][]; rowCount: number };
            setResultColumns(payload.columns);
            setResultRows(payload.rows);
            setChartType(suggestChartType(payload.columns, payload.rows));
          }
        }

        await saveQueryHistory({
          datasetId,
          question,
          sql,
          verdict: v,
          rowCount: resultRows.length,
        });

        const hist = await loadQueryHistory(datasetId);
        setHistory(hist);
      } catch (err) {
        setVerdict({ safe: false, reasons: [`LLM error: ${String(err)}`], sanitizedSql: '' });
      } finally {
        setIsLoading(false);
      }
    },
    [llmProvider, schema, datasetId, resultRows.length]
  );

  const handleRunQuery = useCallback(async () => {
    if (!verdict?.safe || !verdict.sanitizedSql) return;

    const result = await sendMessage('exec', { sql: verdict.sanitizedSql });
    if (result.type === 'result') {
      const payload = result.payload as { columns: string[]; rows: unknown[][]; rowCount: number };
      setResultColumns(payload.columns);
      setResultRows(payload.rows);
      setChartType(suggestChartType(payload.columns, payload.rows));
    }
  }, [verdict]);

  const chartData = prepareChartData(resultColumns, resultRows, chartType);

  const chartConfig: ChartConfig = resultColumns.slice(1).reduce((acc, col, i) => {
    acc[col] = { label: col, color: `var(--chart-${(i % 5) + 1})` };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="flex min-h-screen">
      <aside className="w-80 shrink-0 border-r p-4 space-y-6 overflow-y-auto">
        <h2 className="text-lg font-semibold">Workspace</h2>
        <SchemaExplorer schema={schema} />
        <BYOKPanel onKeySet={handleKeySet} onKeyClear={handleKeyClear} activeProvider={activeProvider} />
        <QueryHistory entries={history} onSelect={(sql) => {}} />
      </aside>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold">DataSense AI</h1>

        <QueryConsole
          onSubmit={handleSubmit}
          isLoading={isLoading}
          generatedSql={generatedSql}
          verdict={verdict}
          resultColumns={resultColumns}
          resultRows={resultRows}
          onRunQuery={handleRunQuery}
        />

        {resultColumns.length > 0 && chartData.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Visualization</h3>
              <ChartTypePicker value={chartType} onChange={setChartType} />
            </div>
            <ChartBar data={chartData} xKey={resultColumns[0]} yKeys={resultColumns.slice(1)} config={chartConfig} />
          </div>
        )}
      </main>
    </div>
  );
}
