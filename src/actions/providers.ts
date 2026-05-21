"use server";

import { requireAuth } from "@/lib/auth";
import { getUserWithConfigs } from "@/lib/db/queries/users";
import {
  saveProviderKey,
  deleteProviderKey,
  getDecryptedKey,
  getProviderConfigData,
  updateTestResult,
} from "@/lib/db/queries/provider-configs";
import { PROVIDER_CATALOG } from "@/lib/ai/providers";
import { db } from "@/lib/db/prisma";
import type { ProviderConfigClient } from "@/types/provider";

export async function getProviderConfigs(): Promise<ProviderConfigClient[]> {
  const userId = await requireAuth();
  const user = await getUserWithConfigs(userId);
  if (!user) return [];

  return user.providerConfigs.map((c) => ({
    providerId: c.providerId as ProviderConfigClient["providerId"],
    isActive: c.isActive,
    lastTestedAt: c.lastTestedAt?.toISOString() ?? null,
    lastTestSuccess: c.lastTestSuccess,
    hasKey: true,
    customBaseUrl: (c as { customBaseUrl?: string | null }).customBaseUrl ?? null,
  }));
}

export async function saveApiKey(
  providerId: string,
  apiKey: string,
  customBaseUrl?: string
) {
  const userId = await requireAuth();
  const user = await getUserWithConfigs(userId);
  if (!user) throw new Error("User not found");

  if (!PROVIDER_CATALOG[providerId]) {
    throw new Error(`Unknown provider: ${providerId}`);
  }

  await saveProviderKey(userId, providerId, apiKey, user.encryptionSalt, customBaseUrl);
  return { success: true };
}

export async function removeApiKey(providerId: string) {
  const userId = await requireAuth();
  await deleteProviderKey(userId, providerId);
  return { success: true };
}

export async function testApiKey(providerId: string) {
  const userId = await requireAuth();
  const user = await getUserWithConfigs(userId);
  if (!user) throw new Error("User not found");

  const provider = PROVIDER_CATALOG[providerId];
  if (!provider) throw new Error(`Unknown provider: ${providerId}`);

  const configData = await getProviderConfigData(userId, providerId, user.encryptionSalt);
  if (!configData) throw new Error("No config for this provider");

  const { apiKey: key, customBaseUrl } = configData;

  try {
    let testUrl: string;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${key}`,
    };

    switch (providerId) {
      case "anthropic": {
        testUrl = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = key!;
        headers["anthropic-version"] = "2023-06-01";
        headers["Content-Type"] = "application/json";
        delete headers.Authorization;
        const res = await fetch(testUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: "claude-haiku-3-5-20241022",
            max_tokens: 1,
            messages: [{ role: "user", content: "hi" }],
          }),
        });
        if (!res.ok && res.status !== 400) throw new Error(`API returned ${res.status}`);
        break;
      }
      case "openai": {
        testUrl = "https://api.openai.com/v1/models";
        const res = await fetch(testUrl, { headers });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        break;
      }
      case "google": {
        testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const res = await fetch(testUrl);
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        break;
      }
      case "qwen": {
        testUrl = `${provider.baseURL}/models`;
        const res = await fetch(testUrl, { headers });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        break;
      }
      case "kimi": {
        testUrl = `${provider.baseURL}/models`;
        const res = await fetch(testUrl, { headers });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        break;
      }
      case "ollama": {
        const base = (customBaseUrl ?? "http://localhost:11434").replace(/\/$/, "");
        // Ollama health check: GET /api/tags lists available models
        const res = await fetch(`${base}/api/tags`, {
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error(`Ollama not reachable at ${base}`);
        const data = await res.json();
        const modelCount = data?.models?.length ?? 0;
        if (modelCount === 0) {
          throw new Error("Ollama running but no models pulled yet. Run: ollama pull llama3.2");
        }
        break;
      }
    }

    await updateTestResult(userId, providerId, true);
    return { success: true };
  } catch (error) {
    await updateTestResult(userId, providerId, false);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}
