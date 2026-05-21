import type { ProviderDefinition } from "@/types/provider";

export const PROVIDER_CATALOG: Record<string, ProviderDefinition> = {
  google: {
    id: "google",
    name: "Gemini",
    description: "Google — free tier available",
    iconPath: "/providers/google.svg",
    sdkPackage: "@ai-sdk/google",
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    freeKeyUrl: "https://aistudio.google.com/app/apikey",
    freeKeyNote: "Free: 1,500 req/day · no billing required",
    models: [
      { id: "gemini-2.5-pro-preview-05-06", label: "Gemini 2.5 Pro", contextWindow: 1000000, supportsVision: true, supportsTools: true },
      { id: "gemini-2.5-flash-preview-05-20", label: "Gemini 2.5 Flash", contextWindow: 1000000, supportsVision: true, supportsTools: true },
      { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash", contextWindow: 1000000, supportsVision: true, supportsTools: true },
    ],
  },
  ollama: {
    id: "ollama",
    name: "Ollama",
    description: "Local models — runs on your machine",
    iconPath: "/providers/ollama.svg",
    sdkPackage: "@ai-sdk/openai-compatible",
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    requiresApiKey: false,
    requiresBaseUrl: true,
    freeKeyNote: "100% free · runs locally · no API key needed",
    models: [
      { id: "llama3.2", label: "Llama 3.2", contextWindow: 128000, supportsVision: false, supportsTools: false },
      { id: "llama3.1", label: "Llama 3.1", contextWindow: 128000, supportsVision: false, supportsTools: false },
      { id: "mistral", label: "Mistral 7B", contextWindow: 32000, supportsVision: false, supportsTools: false },
      { id: "codellama", label: "Code Llama", contextWindow: 16000, supportsVision: false, supportsTools: false },
      { id: "gemma2", label: "Gemma 2", contextWindow: 8000, supportsVision: false, supportsTools: false },
      { id: "qwen2.5", label: "Qwen 2.5 (local)", contextWindow: 128000, supportsVision: false, supportsTools: false },
      { id: "deepseek-r1", label: "DeepSeek R1", contextWindow: 64000, supportsVision: false, supportsTools: false },
    ],
  },
  anthropic: {
    id: "anthropic",
    name: "Claude",
    description: "Anthropic",
    iconPath: "/providers/anthropic.svg",
    sdkPackage: "@ai-sdk/anthropic",
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    models: [
      { id: "claude-sonnet-4-20250514", label: "Claude Sonnet 4", contextWindow: 200000, supportsVision: true, supportsTools: true },
      { id: "claude-opus-4-20250514", label: "Claude Opus 4", contextWindow: 200000, supportsVision: true, supportsTools: true },
      { id: "claude-haiku-3-5-20241022", label: "Claude 3.5 Haiku", contextWindow: 200000, supportsVision: true, supportsTools: true },
    ],
  },
  openai: {
    id: "openai",
    name: "ChatGPT",
    description: "OpenAI",
    iconPath: "/providers/openai.svg",
    sdkPackage: "@ai-sdk/openai",
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    models: [
      { id: "gpt-4.1", label: "GPT-4.1", contextWindow: 1000000, supportsVision: true, supportsTools: true },
      { id: "gpt-4o", label: "GPT-4o", contextWindow: 128000, supportsVision: true, supportsTools: true },
      { id: "gpt-4o-mini", label: "GPT-4o Mini", contextWindow: 128000, supportsVision: true, supportsTools: true },
    ],
  },
  qwen: {
    id: "qwen",
    name: "Qwen",
    description: "Alibaba — free credits on signup",
    iconPath: "/providers/qwen.svg",
    sdkPackage: "@ai-sdk/openai-compatible",
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    supportsTools: true,
    supportsVision: true,
    supportsStreaming: true,
    freeKeyUrl: "https://bailian.console.alibabacloud.com/",
    freeKeyNote: "Free credits on signup · no credit card needed",
    models: [
      { id: "qwen-max", label: "Qwen Max", contextWindow: 32000, supportsVision: true, supportsTools: true },
      { id: "qwen-plus", label: "Qwen Plus", contextWindow: 131072, supportsVision: true, supportsTools: true },
      { id: "qwen-turbo", label: "Qwen Turbo", contextWindow: 131072, supportsVision: false, supportsTools: true },
    ],
  },
  kimi: {
    id: "kimi",
    name: "Kimi",
    description: "Moonshot — free credits on signup",
    iconPath: "/providers/kimi.svg",
    sdkPackage: "@ai-sdk/openai-compatible",
    baseURL: "https://api.moonshot.ai/v1",
    supportsTools: true,
    supportsVision: false,
    supportsStreaming: true,
    freeKeyUrl: "https://platform.moonshot.cn/console/api-keys",
    freeKeyNote: "Free credits on signup · no credit card needed",
    models: [
      { id: "moonshot-v1-128k", label: "Kimi 128K", contextWindow: 128000, supportsVision: false, supportsTools: true },
      { id: "moonshot-v1-32k", label: "Kimi 32K", contextWindow: 32000, supportsVision: false, supportsTools: true },
      { id: "moonshot-v1-8k", label: "Kimi 8K", contextWindow: 8000, supportsVision: false, supportsTools: true },
    ],
  },
} as const;

export function getProvider(providerId: string): ProviderDefinition | undefined {
  return PROVIDER_CATALOG[providerId];
}

export function getAllProviders(): ProviderDefinition[] {
  return Object.values(PROVIDER_CATALOG);
}

export function getModel(providerId: string, modelId: string) {
  const provider = PROVIDER_CATALOG[providerId];
  if (!provider) return undefined;
  return provider.models.find((m) => m.id === modelId);
}
