import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-muted/50">
        <Database className="size-8 text-muted-foreground" />
      </div>
      <h1 className="mb-3 text-4xl font-bold tracking-tight">404</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        This page does not exist. Upload a dataset or head back to the home
        page.
      </p>

      <Link href="/" className="underline underline-offset-4 text-primary">
        Back to Home
      </Link>
    </div>
  );
}
