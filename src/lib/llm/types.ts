export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMProvider {
  name: string;
  chat(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<string>;
  streamChat(messages: LLMMessage[], options?: LLMCompletionOptions): AsyncGenerator<string>;
  listModels(): Promise<string[]>;
}

export type LLMProviderName = 'gemini' | 'groq';
