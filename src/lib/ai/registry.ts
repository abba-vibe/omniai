import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { PROVIDER_CATALOG } from "./providers";
import type { LanguageModel } from "ai";

/**
 * Build a language model instance for the given provider and model ID,
 * using the user's decrypted API key.
 */
export function buildModel(
  providerId: string,
  modelId: string,
  apiKey: string
): LanguageModel {
  switch (providerId) {
    case "anthropic": {
      const provider = createAnthropic({ apiKey });
      return provider(modelId);
    }
    case "openai": {
      const provider = createOpenAI({ apiKey });
      return provider(modelId);
    }
    case "google": {
      const provider = createGoogleGenerativeAI({ apiKey });
      return provider(modelId);
    }
    case "qwen": {
      const provider = createOpenAICompatible({
        name: "qwen",
        apiKey,
        baseURL: PROVIDER_CATALOG.qwen.baseURL!,
      });
      return provider(modelId);
    }
    case "kimi": {
      const provider = createOpenAICompatible({
        name: "kimi",
        apiKey,
        baseURL: PROVIDER_CATALOG.kimi.baseURL!,
      });
      return provider(modelId);
    }
    default:
      throw new Error(`Unsupported provider: ${providerId}`);
  }
}
