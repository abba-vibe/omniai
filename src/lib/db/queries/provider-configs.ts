import { db } from "../prisma";
import { encryptApiKey, decryptApiKey } from "@/lib/crypto/encryption";

export async function saveProviderKey(
  userId: string,
  providerId: string,
  apiKey: string,
  userSalt: string,
  customBaseUrl?: string | null
) {
  // Ollama has no real API key — store empty encrypted blob
  const keyToEncrypt = apiKey || "ollama";
  const encrypted = await encryptApiKey(keyToEncrypt, userSalt);

  return db.providerConfig.upsert({
    where: {
      userId_providerId: { userId, providerId },
    },
    update: {
      encryptedApiKey: encrypted.encryptedApiKey,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      customBaseUrl: customBaseUrl ?? null,
      isActive: true,
      updatedAt: new Date(),
    },
    create: {
      userId,
      providerId,
      encryptedApiKey: encrypted.encryptedApiKey,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      customBaseUrl: customBaseUrl ?? null,
    },
  });
}

export async function getDecryptedKey(
  userId: string,
  providerId: string,
  userSalt: string
): Promise<string | null> {
  const config = await db.providerConfig.findUnique({
    where: { userId_providerId: { userId, providerId } },
  });

  if (!config) return null;
  if (!config.encryptedApiKey) return null;

  return decryptApiKey(
    config.encryptedApiKey,
    config.iv,
    config.authTag,
    userSalt
  );
}

export async function getProviderConfigData(
  userId: string,
  providerId: string,
  userSalt: string
): Promise<{ apiKey: string | null; customBaseUrl: string | null } | null> {
  const config = await db.providerConfig.findUnique({
    where: { userId_providerId: { userId, providerId } },
  });

  if (!config) return null;

  let apiKey: string | null = null;
  if (config.encryptedApiKey) {
    apiKey = await decryptApiKey(
      config.encryptedApiKey,
      config.iv,
      config.authTag,
      userSalt
    );
  }

  return { apiKey, customBaseUrl: config.customBaseUrl ?? null };
}

export async function getAllDecryptedKeys(
  userId: string,
  userSalt: string
): Promise<Record<string, string>> {
  const configs = await db.providerConfig.findMany({
    where: { userId, isActive: true },
  });

  const keys: Record<string, string> = {};
  for (const config of configs) {
    if (config.encryptedApiKey) {
      keys[config.providerId] = await decryptApiKey(
        config.encryptedApiKey,
        config.iv,
        config.authTag,
        userSalt
      );
    }
  }

  return keys;
}

export async function deleteProviderKey(userId: string, providerId: string) {
  return db.providerConfig.deleteMany({
    where: { userId, providerId },
  });
}

export async function updateTestResult(
  userId: string,
  providerId: string,
  success: boolean
) {
  return db.providerConfig.update({
    where: { userId_providerId: { userId, providerId } },
    data: {
      lastTestedAt: new Date(),
      lastTestSuccess: success,
    },
  });
}
