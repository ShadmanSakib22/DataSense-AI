import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  return (
    <a
      href="#top"
      className="fixed bottom-6 right-6 z-[9999] flex size-10 items-center justify-center rounded-full border bg-background/80 text-foreground shadow-lg backdrop-blur hover:bg-muted"
    >
      <ArrowUp className="size-4" />
    </a>
  );
}
