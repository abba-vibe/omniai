export type ProviderId = "anthropic" | "openai" | "google" | "qwen" | "kimi" | "ollama";

export interface ModelDefinition {
  id: string;
  label: string;
  contextWindow: number;
  supportsVision: boolean;
  supportsTools: boolean;
}

export interface ProviderDefinition {
  id: ProviderId;
  name: string;
  description: string;
  iconPath: string;
  sdkPackage: string;
  baseURL?: string;
  supportsTools: boolean;
  supportsVision: boolean;
  supportsStreaming: boolean;
  models: ModelDefinition[];
  /** No API key needed (e.g. Ollama local) */
  requiresApiKey?: boolean;
  /** URL input instead of API key (e.g. Ollama) */
  requiresBaseUrl?: boolean;
  /** Link to get a free API key */
  freeKeyUrl?: string;
  /** Human-readable free tier note */
  freeKeyNote?: string;
}

export interface ProviderConfigClient {
  providerId: ProviderId;
  isActive: boolean;
  lastTestedAt: string | null;
  lastTestSuccess: boolean | null;
  hasKey: boolean;
  customBaseUrl?: string | null;
}
