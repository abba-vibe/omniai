export type ProviderId = "anthropic" | "openai" | "google" | "qwen" | "kimi";

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
}

export interface ProviderConfigClient {
  providerId: ProviderId;
  isActive: boolean;
  lastTestedAt: string | null;
  lastTestSuccess: boolean | null;
  hasKey: boolean;
}
