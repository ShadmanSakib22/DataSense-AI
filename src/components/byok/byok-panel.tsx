"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Key, Trash2 } from "lucide-react";
import type { LLMProviderName } from "@/lib/llm/types";

interface BYOKPanelProps {
  onKeySet: (provider: LLMProviderName, key: string) => void;
  onKeyClear: (provider: LLMProviderName) => void;
  activeProvider: LLMProviderName | null;
}

export function BYOKPanel({
  onKeySet,
  onKeyClear,
  activeProvider,
}: BYOKPanelProps) {
  const [provider, setProvider] = useState<LLMProviderName>("gemini");
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSave = useCallback(() => {
    if (key.trim()) {
      onKeySet(provider, key.trim());
      setKey("");
    }
  }, [key, provider, onKeySet]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <Key className="size-3.5 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          API Key
        </h3>
      </div>

      <div className="space-y-2">
        <Select
          value={provider}
          onValueChange={(v) => setProvider(v as LLMProviderName)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini">Google Gemini</SelectItem>
            <SelectItem value="groq">Groq</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Paste your API key..."
              className="pr-9"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <Button onClick={handleSave} disabled={!key.trim()}>
            Save
          </Button>
        </div>
      </div>

      {activeProvider && (
        <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
          <span className="text-xs">
            Active:{" "}
            <span className="font-medium capitalize">{activeProvider}</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-destructive hover:text-destructive"
            onClick={() => onKeyClear(activeProvider)}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Your key is stored in localStorage (persists across sessions). <br /> No
        server sees it.
      </p>
    </div>
  );
}
