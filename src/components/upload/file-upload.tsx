'use client';

import * as React from 'react';
import { useCallback, useState } from 'react';
import { Upload, FileText, Database, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.xls', '.db', '.sqlite', '.sql'];
const MAX_SIZE_MB = 100;

export function FileUpload({ onFileSelected, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    setError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`);
      return false;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      setError(`File too large (${sizeMB.toFixed(1)}MB). Maximum: ${MAX_SIZE_MB}MB.`);
      return false;
    }
    return true;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        onFileSelected(file);
      }
    },
    [onFileSelected, validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
        onFileSelected(file);
      }
      e.target.value = '';
    },
    [onFileSelected, validateFile]
  );

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <Upload className="mb-4 size-10 text-muted-foreground" />
        <p className="mb-2 text-lg font-medium">
          Drop your file here, or{' '}
          <label className="cursor-pointer text-primary underline underline-offset-4 hover:text-primary/80">
            browse
            <input
              type="file"
              className="sr-only"
              accept={ACCEPTED_EXTENSIONS.join(',')}
              onChange={handleInputChange}
              disabled={disabled}
            />
          </label>
        </p>
        <p className="text-sm text-muted-foreground">
          CSV, Excel (.xlsx), SQLite (.db/.sqlite), or SQL dump — up to {MAX_SIZE_MB}MB
        </p>
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
