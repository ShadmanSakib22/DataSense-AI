'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUpload } from '@/components/upload/file-upload';
import { UploadProgress } from '@/components/upload/upload-progress';
import { sendMessage, initWorker } from '@/lib/db-engine/sqljs-manager';
import { parseCsvFile } from '@/lib/db-engine/import-csv';
import { parseXlsxFile } from '@/lib/db-engine/import-xlsx';
import { saveDataset } from '@/lib/storage/indexeddb';
import { AlertTriangle } from 'lucide-react';

export default function WorkspaceIndexPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | undefined>();

  const handleFile = useCallback(
    async (file: File) => {
      const ext = file.name.split('.').pop()?.toLowerCase();

      try {
        initWorker();
        setStatus('Initializing database engine...');
        setProgress(10);

        if (ext === 'csv') {
          setStatus('Parsing CSV file...');
          setProgress(30);
          const result = await parseCsvFile(file);

          setStatus(`Loading ${result.tableName} into database...`);
          setProgress(60);
          await sendMessage('import-csv', result);
        } else if (ext === 'xlsx' || ext === 'xls') {
          setStatus('Parsing Excel file...');
          setProgress(30);
          const results = await parseXlsxFile(file);

          for (let i = 0; i < results.length; i++) {
            const r = results[i];
            setStatus(`Loading sheet ${i + 1}/${results.length}: ${r.tableName}...`);
            setProgress(30 + Math.floor((i / results.length) * 50));
            await sendMessage('import-xlsx', r);
          }
        } else if (ext === 'db' || ext === 'sqlite') {
          setStatus('Reading database file...');
          setProgress(30);
          const buffer = await file.arrayBuffer();
          const bytes = new Uint8Array(buffer);

          setStatus('Loading SQLite database...');
          setProgress(60);
          await sendMessage('init-bytes', { bytes });
        } else if (ext === 'sql') {
          setStatus('Reading SQL dump...');
          setProgress(30);
          const sql = await file.text();

          setStatus('Executing SQL dump...');
          setProgress(60);
          await sendMessage('init-sql', { sql });
        } else {
          throw new Error(`Unsupported file type: .${ext}`);
        }

        setStatus('Retrieving schema...');
        setProgress(80);
        const schemaResponse = await sendMessage('schema', null);

        setStatus('Saving to IndexedDB...');
        setProgress(90);
        const exportResponse = await sendMessage('export', null);
        const datasetId = crypto.randomUUID();

        if (exportResponse.type === 'exported') {
          const { bytes } = exportResponse.payload as { bytes: Uint8Array };
          await saveDataset(datasetId, file.name, bytes, schemaResponse.payload);
        }

        setProgress(100);
        setStatus('Done! Redirecting...');

        router.push(`/workspace/${datasetId}`);
      } catch (err) {
        setStatus(`Error: ${String(err)}`);
        setProgress(undefined);
      }
    },
    [router]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl space-y-6">
          <Alert>
            <AlertTriangle className="size-4" />
            <AlertDescription>
              No dataset loaded. Upload a file to get started.
            </AlertDescription>
          </Alert>

          {status ? (
            <UploadProgress status={status} progress={progress} />
          ) : (
            <FileUpload onFileSelected={handleFile} />
          )}
        </div>
      </main>
    </div>
  );
}
