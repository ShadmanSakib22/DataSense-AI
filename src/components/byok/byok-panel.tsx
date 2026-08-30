'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Key, Trash2 } from 'lucide-react';
import type { LLMProviderName } from '@/lib/llm/types';

interface BYOKPanelProps {
  onKeySet: (provider: LLMProviderName, key: string) => void;
  onKeyClear: (provider: LLMProviderName) => void;
  activeProvider: LLMProviderName | null;
}

export function BYOKPanel({ onKeySet, onKeyClear, activeProvider }: BYOKPanelProps) {
  const [provider, setProvider] = useState<LLMProviderName>('gemini');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSave = useCallback(() => {
    if (key.trim()) {
      onKeySet(provider, key.trim());
      setKey('');
    }
  }, [key, provider, onKeySet]);

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Key className="size-4" />
        <h3 className="text-sm font-medium">API Key</h3>
      </div>

      <div className="flex gap-2">
        <select
          value={provider}
          onChange={e => setProvider(e.target.value as LLMProviderName)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="gemini">Google Gemini</option>
          <option value="groq">Groq</option>
        </select>

        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Paste your API key..."
            className="w-full rounded-md border bg-background px-3 py-1.5 pr-9 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        <Button onClick={handleSave} disabled={!key.trim()}>
          Save
        </Button>
      </div>

      {activeProvider && (
        <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
          <span className="text-xs">
            Active: <span className="font-medium capitalize">{activeProvider}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onKeyClear(activeProvider)}
            className="h-6 px-2 text-destructive"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Your key is stored in sessionStorage (gone when tab closes). No server sees it.
      </p>
    </div>
  );
}
