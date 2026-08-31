import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Shield,
  Database,
  Brain,
  Zap,
  Lock,
  ArrowUpRight,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — Copy */}
            <div className="flex flex-col items-start text-left">
              <div className="mb-6 inline-flex items-center rounded-full border border-primary/10 bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
                Runs entirely in your browser
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Ask your data
                <br />
                a question.
                <br />
                <span className="text-primary">Get an answer.</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl">
                Upload a CSV, Excel file, or SQLite database. Ask questions in
                plain English. Get interactive charts — instantly.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-2 px-8">
                  <Link href="/workspace">
                    <Upload className="size-4" />
                    Get started
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#features">Learn more</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="size-3.5 fill-primary text-primary" />
                  <span>Privacy-first</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="size-3.5 fill-primary text-primary" />
                  <span>No sign-up</span>
                </div>
              </div>
            </div>

            {/* Right — Mockup */}
            <div className="relative block">
              {/* Stacked cards behind */}
              <div className="absolute -bottom-3 -left-3 -right-3 -top-3 rounded-2xl border border-border/60 bg-muted/30" />
              <div className="absolute -bottom-6 -left-6 -right-6 -top-6 rounded-2xl border border-border/40 bg-muted/20" />
              {/* Main card */}
              <div className="relative rounded-2xl border bg-card p-6 shadow-2xl shadow-primary/5">
                {/* Window chrome */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-muted-foreground">
                    DataSense — query console
                  </span>
                </div>
                {/* Question bar */}
                <div className="mb-4 rounded-lg border bg-muted/50 px-4 py-3">
                  <p className="font-mono text-sm text-muted-foreground">
                    <span className="text-primary">Q:</span> What are my top 5
                    categories by revenue?
                  </p>
                </div>
                {/* SQL block */}
                <div className="mb-4 rounded-lg bg-muted/30 px-4 py-3">
                  <p className="font-mono text-xs leading-relaxed">
                    <span className="text-muted-foreground">SELECT</span>{" "}
                    category, <span className="text-muted-foreground">SUM</span>
                    (revenue) <span className="text-muted-foreground">
                      AS
                    </span>{" "}
                    total
                    <br />
                    <span className="text-muted-foreground">FROM</span> sales
                    <br />
                    <span className="text-muted-foreground">GROUP BY</span>{" "}
                    category
                    <br />
                    <span className="text-muted-foreground">ORDER BY</span>{" "}
                    total <span className="text-muted-foreground">DESC</span>
                    <br />
                    <span className="text-muted-foreground">LIMIT</span> 5
                  </p>
                </div>
                {/* Guardrail badge */}
                <div className="mb-4 flex items-center gap-2 text-xs text-green-500">
                  <Shield className="size-3.5" />
                  <span>Guardrails passed — safe to execute</span>
                </div>
                {/* Mini chart mockup */}
                <div className="flex items-end gap-2 rounded-lg bg-muted/20 p-4">
                  {[
                    { label: "Electronics", h: "h-20" },
                    { label: "Clothing", h: "h-16" },
                    { label: "Home", h: "h-12" },
                    { label: "Sports", h: "h-9" },
                    { label: "Books", h: "h-6" },
                  ].map((bar) => (
                    <div
                      key={bar.label}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <div
                        className={`w-full rounded bg-primary/70 ${bar.h}`}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {bar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Glow */}
              <div className="absolute -inset-12 -z-10 bg-primary/5 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Built for privacy and power
          </h2>
          <p className="text-muted-foreground">
            Everything runs in your browser. No uploads to servers, no accounts
            required.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="group relative overflow-hidden border-border/50 bg-card/50 transition-colors hover:border-primary/30">
            <CardContent className="p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="size-5 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Client-side only</h3>
              <p className="text-sm text-muted-foreground">
                Your files are parsed and stored entirely in your browser using
                SQLite WASM. Nothing is ever sent to a server.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 bg-card/50 transition-colors hover:border-primary/30">
            <CardContent className="p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="size-5 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">AST guardrails</h3>
              <p className="text-sm text-muted-foreground">
                Every generated SQL is validated through AST parsing. No DROP,
                no INSERT, no schema changes — guaranteed.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/50 bg-card/50 transition-colors hover:border-primary/30">
            <CardContent className="p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Database className="size-5 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Full SQLite power</h3>
              <p className="text-sm text-muted-foreground">
                Run complex SQL queries with JOINs, aggregations, window
                functions, and more — all running on SQLite compiled to
                WebAssembly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Natural language to SQL
            </h2>
            <p className="mb-6 text-muted-foreground">
              Ask questions in plain English. DataSense uses LLMs to generate
              accurate SQL queries, validated through our AST guardrail engine
              before execution.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Brain className="size-4 text-primary" />
                Gemini and Groq support (BYOK)
              </li>
              <li className="flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                Schema-grounded prompt engineering
              </li>
              <li className="flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                Instant results with in-browser SQLite
              </li>
            </ul>
          </div>
          <div className="rounded-xl border bg-card/50 p-6">
            <div className="space-y-3">
              <div className="rounded-lg bg-muted/50 px-4 py-3 font-mono text-sm">
                <span className="text-muted-foreground">SELECT</span> category,{" "}
                <span className="text-muted-foreground">SUM</span>
                (revenue) <span className="text-muted-foreground">
                  FROM
                </span>{" "}
                sales <span className="text-muted-foreground">GROUP BY</span>{" "}
                category
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="size-3 text-green-500" />
                Guardrails passed — safe to execute
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-muted/30 px-3 py-2 text-center">
                  <div className="text-xs text-muted-foreground">
                    Electronics
                  </div>
                  <div className="font-mono text-sm font-medium">$24,390</div>
                </div>
                <div className="rounded-md bg-muted/30 px-3 py-2 text-center">
                  <div className="text-xs text-muted-foreground">Clothing</div>
                  <div className="font-mono text-sm font-medium">$18,720</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
