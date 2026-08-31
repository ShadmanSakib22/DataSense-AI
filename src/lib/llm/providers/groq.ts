import type { LLMProvider, LLMMessage, LLMCompletionOptions } from '../types';

export class GroqProvider implements LLMProvider {
  name = 'groq';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<string> {
    const model = options?.model || 'openai/gpt-oss-120b';

    console.log('[groq] chat request:', { model, messageCount: messages.length });

    const res = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'groq',
        apiKey: this.apiKey,
        url: 'https://api.groq.com/openai/v1/chat/completions',
        payload: {
          model,
          messages,
          temperature: options?.temperature ?? 0.2,
          max_tokens: options?.maxTokens ?? 4096,
        },
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error('[groq] API error:', res.status, error);
      throw new Error(`Groq API error: ${res.status} ${JSON.stringify(error)}`);
    }

    const data = await res.json();
    console.log('[groq] response received');
    return data.choices?.[0]?.message?.content || '';
  }

  async *streamChat(messages: LLMMessage[], options?: LLMCompletionOptions): AsyncGenerator<string> {
    const model = options?.model || 'openai/gpt-oss-120b';

    const res = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'groq',
        apiKey: this.apiKey,
        url: 'https://api.groq.com/openai/v1/chat/completions',
        payload: {
          model,
          messages,
          temperature: options?.temperature ?? 0.2,
          max_tokens: options?.maxTokens ?? 4096,
          stream: true,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Groq API error: ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            const text = data.choices?.[0]?.delta?.content;
            if (text) yield text;
          } catch {
            // skip malformed chunks
          }
        }
      }
    }
  }

  async listModels(): Promise<string[]> {
    return ['openai/gpt-oss-120b', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];
  }
}
