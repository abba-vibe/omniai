"use server";

import { requireAuth } from "@/lib/auth";
import { getUserWithConfigs } from "@/lib/db/queries/users";
import {
  saveProviderKey,
  deleteProviderKey,
  getDecryptedKey,
  updateTestResult,
} from "@/lib/db/queries/provider-configs";
import { PROVIDER_CATALOG } from "@/lib/ai/providers";
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
  }));
}

export async function saveApiKey(providerId: string, apiKey: string) {
  const userId = await requireAuth();
  const user = await getUserWithConfigs(userId);
  if (!user) throw new Error("User not found");

  if (!PROVIDER_CATALOG[providerId]) {
    throw new Error(`Unknown provider: ${providerId}`);
  }

  await saveProviderKey(userId, providerId, apiKey, user.encryptionSalt);
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

  const key = await getDecryptedKey(userId, providerId, user.encryptionSalt);
  if (!key) throw new Error("No key configured for this provider");

  const provider = PROVIDER_CATALOG[providerId];
  if (!provider) throw new Error(`Unknown provider: ${providerId}`);

  try {
    // Quick validation: make a minimal API call
    let testUrl: string;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${key}`,
    };

    switch (providerId) {
      case "anthropic":
        testUrl = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = key;
        headers["anthropic-version"] = "2023-06-01";
        headers["Content-Type"] = "application/json";
        delete headers.Authorization;
        // Send minimal request
        const anthropicRes = await fetch(testUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: "claude-haiku-3-5-20241022",
            max_tokens: 1,
            messages: [{ role: "user", content: "hi" }],
          }),
        });
        if (!anthropicRes.ok && anthropicRes.status !== 400) {
          throw new Error(`API returned ${anthropicRes.status}`);
        }
        break;

      case "openai":
        testUrl = "https://api.openai.com/v1/models";
        const openaiRes = await fetch(testUrl, { headers });
        if (!openaiRes.ok) throw new Error(`API returned ${openaiRes.status}`);
        break;

      case "google":
        testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const googleRes = await fetch(testUrl);
        if (!googleRes.ok) throw new Error(`API returned ${googleRes.status}`);
        break;

      case "qwen":
        testUrl = `${provider.baseURL}/models`;
        const qwenRes = await fetch(testUrl, { headers });
        if (!qwenRes.ok) throw new Error(`API returned ${qwenRes.status}`);
        break;

      case "kimi":
        testUrl = `${provider.baseURL}/models`;
        const kimiRes = await fetch(testUrl, { headers });
        if (!kimiRes.ok) throw new Error(`API returned ${kimiRes.status}`);
        break;
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
