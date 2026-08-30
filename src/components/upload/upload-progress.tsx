'use client';

import { Loader2 } from 'lucide-react';

interface UploadProgressProps {
  status: string;
  progress?: number;
}

export function UploadProgress({ status, progress }: UploadProgressProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Loader2 className="size-8 animate-spin text-primary" />
      <div className="text-center">
        <p className="font-medium">{status}</p>
        {progress !== undefined && (
          <div className="mt-2 h-2 w-64 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
