export interface Chat {
  id: number;
  title?: string;
  models: string[];
  rounds: number;
  processing: boolean;
  created_at: string;
}

export interface Message {
  id: number;
  chat_id: number;
  author: string;
  content: string;
  created_at: string;
}

export interface MessagesResponse {
  processing: boolean;
  messages: Message[];
}

export interface AiModel {
  id: string;
  name: string;
}

export interface ModelConfig {
  id: number;
  name: string;
  models: string[];
}

const MODEL_COLORS: Record<string, string> = {
  'gpt-4': 'var(--model-gpt)',
  'claude-3': 'var(--model-claude)',
  'mistral': 'var(--model-mistral)',
  'gemini': 'var(--model-gemini)',
  'llama': 'var(--model-llama)',
  'deepseek': 'var(--model-deepseek)',
};

export function getModelColor(modelId: string): string {
  return MODEL_COLORS[modelId] ?? 'var(--model-custom)';
}

export function getModelInitial(modelId: string): string {
  return modelId.substring(0, 2).toUpperCase();
}
