export interface Message {
  id: string;
  conversationId: string;
  content: string;
  author: MessageAuthor;
  timestamp: Date;
  tokens?: number;
  latency?: number;
  isStreaming?: boolean;
}

export interface MessageAuthor {
  type: 'user' | 'ai';
  name: string;
  model?: string;
}

export interface Conversation {
  id: string;
  title: string;
  models: string[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AiModel {
  id: string;
  name: string;
  color: string;
}

export const AI_MODELS: Record<string, AiModel> = {
  'claude':   { id: 'claude',   name: 'Claude',   color: 'var(--model-claude)' },
  'gpt-4':    { id: 'gpt-4',    name: 'GPT-4',    color: 'var(--model-gpt)' },
  'gemini':   { id: 'gemini',   name: 'Gemini',   color: 'var(--model-gemini)' },
  'mistral':  { id: 'mistral',  name: 'Mistral',  color: 'var(--model-mistral)' },
  'llama':    { id: 'llama',    name: 'LLaMA',    color: 'var(--model-llama)' },
  'deepseek': { id: 'deepseek', name: 'DeepSeek', color: 'var(--model-deepseek)' },
};

export function getModelColor(modelId: string): string {
  return AI_MODELS[modelId]?.color ?? 'var(--model-custom)';
}
