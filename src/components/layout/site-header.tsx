import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import { BotMessageSquare, Play, SquareText } from "lucide-react";

const header = () => {
  return (
    <header className="sticky top-0 z-50 bg-primary/10 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center text-lg font-semibold tracking-tight font-mono">
          <BotMessageSquare className="mr-1.5 size-5 text-primary" />
          <Link href="/">DataSense</Link>
          <span className="ml-2 text-sm font-normal text-muted-foreground hidden sm:inline">
            - Opensource Agent for Data Analysis
          </span>
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  size="icon"
                  variant="outline"
                  className="border border-foreground/60! text-foreground/60 hover:text-foreground/35 hover:border-foreground/35!"
                >
                  <a
                    href="https://github.com/ShadmanSakib22/DataSense-AI"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SquareText />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View on GitHub</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  size="icon"
                  variant="outline"
                  className="border border-primary/50! text-primary hover:text-primary/35 hover:border-primary/15!"
                >
                  <Link href="/workspace">
                    <Play />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Workspace</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default header;
