import { db } from "../prisma";
import { encryptApiKey, decryptApiKey } from "@/lib/crypto/encryption";

export async function saveProviderKey(
  userId: string,
  providerId: string,
  apiKey: string,
  userSalt: string
) {
  const encrypted = await encryptApiKey(apiKey, userSalt);

  return db.providerConfig.upsert({
    where: {
      userId_providerId: { userId, providerId },
    },
    update: {
      encryptedApiKey: encrypted.encryptedApiKey,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      isActive: true,
      updatedAt: new Date(),
    },
    create: {
      userId,
      providerId,
      encryptedApiKey: encrypted.encryptedApiKey,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
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

  return decryptApiKey(
    config.encryptedApiKey,
    config.iv,
    config.authTag,
    userSalt
  );
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
    keys[config.providerId] = await decryptApiKey(
      config.encryptedApiKey,
      config.iv,
      config.authTag,
      userSalt
    );
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
