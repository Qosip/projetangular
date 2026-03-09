export type ChatMode = 'normal' | 'search' | 'deep-thinking' | 'creative';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  author: MessageAuthor;
  timestamp: Date;
  tokens?: number;
  latency?: number;
  isStreaming?: boolean;
  mode?: ChatMode;
  attachment?: Attachment;
}

export interface Attachment {
  type: 'image' | 'file';
  name: string;
}

export interface MessageAuthor {
  type: 'user' | 'ai' | 'system';
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
  icon: string;
}

export const AI_MODELS: Record<string, AiModel> = {
  'claude':   { id: 'claude',   name: 'Claude',   color: 'var(--model-claude)',   icon: 'C' },
  'gpt-4':    { id: 'gpt-4',    name: 'GPT-4',    color: 'var(--model-gpt)',      icon: 'G' },
  'gemini':   { id: 'gemini',   name: 'Gemini',   color: 'var(--model-gemini)',   icon: 'Ge' },
  'mistral':  { id: 'mistral',  name: 'Mistral',  color: 'var(--model-mistral)',  icon: 'M' },
  'llama':    { id: 'llama',    name: 'LLaMA',    color: 'var(--model-llama)',    icon: 'L' },
  'deepseek': { id: 'deepseek', name: 'DeepSeek', color: 'var(--model-deepseek)', icon: 'D' },
};

export const ALL_MODEL_IDS = Object.keys(AI_MODELS);

export function getModelColor(modelId: string): string {
  return AI_MODELS[modelId]?.color ?? 'var(--model-custom)';
}
