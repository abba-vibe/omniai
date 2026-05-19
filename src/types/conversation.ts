import type { ProviderId } from "./provider";

export interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
  lastProviderId?: ProviderId | null;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  providerId: ProviderId | null;
  modelId: string | null;
  toolCalls: unknown | null;
  toolResults: unknown | null;
  metadata: MessageMetadata | null;
  parentId: string | null;
  createdAt: string;
}

export interface MessageMetadata {
  promptTokens?: number;
  completionTokens?: number;
  latencyMs?: number;
  costEstimate?: number;
}
