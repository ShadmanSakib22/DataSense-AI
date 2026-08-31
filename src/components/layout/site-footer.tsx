import { BotMessageSquare, ExternalLink, Shield, Lock } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2">
              <BotMessageSquare className="size-4 text-primary" />
              <span className="font-mono text-sm font-semibold tracking-tight">
                DataSense
              </span>
            </div>
            <p className="max-w-xs text-xs text-muted-foreground">
              Open-source natural language data analysis. Your data stays on
              your device.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Lock className="size-3" />
              <span>Client-side only</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <Shield className="size-3" />
              <span>AST guardrails</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 md:items-end">
            <a
              href="https://github.com/ShadmanSakib22/DataSense-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-3.5" />
              <span>ShadmanSakib22</span>
            </a>
            <span className="text-[10px] text-muted-foreground/60">
              © {new Date().getFullYear()} DataSense AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
