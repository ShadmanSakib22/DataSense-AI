'use client';

import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  status: string;
  progress?: number;
}

export function UploadProgress({ status, progress }: UploadProgressProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <Loader2 className="size-8 animate-spin text-primary" />
      <div className="w-full space-y-3 text-center">
        <p className="font-medium">{status}</p>
        {progress !== undefined && (
          <Progress value={progress} className="h-2" />
        )}
      </div>
    </div>
  );
}
