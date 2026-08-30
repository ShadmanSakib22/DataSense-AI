import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Upload, Shield, Database, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">DataSense AI</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Ask questions. Get answers. From your data.
            </h2>
            <p className="text-lg text-muted-foreground">
              Upload a CSV, Excel file, or SQLite database. Ask questions in plain English.
              Get interactive charts. Your data never leaves your browser.
            </p>
          </div>

          <Button asChild size="lg" className="gap-2">
            <Link href="/upload">
              <Upload className="size-4" />
              Upload Data
            </Link>
          </Button>

          <div className="mx-auto grid max-w-lg grid-cols-3 gap-6 pt-8 text-sm">
            <div className="flex flex-col items-center gap-2">
              <Shield className="size-8 text-primary" />
              <p className="font-medium">Client-side only</p>
              <p className="text-muted-foreground">Files never leave your browser</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Brain className="size-8 text-primary" />
              <p className="font-medium">AST guardrails</p>
              <p className="text-muted-foreground">Real SQL validation, not regex</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Database className="size-8 text-primary" />
              <p className="font-medium">SQLite power</p>
              <p className="text-muted-foreground">Full SQL in your browser</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
