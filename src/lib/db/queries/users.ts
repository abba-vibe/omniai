import { db } from "../prisma";
import { generateSalt } from "@/lib/crypto/encryption";

export async function getOrCreateUser(clerkUserId: string, email: string) {
  return db.user.upsert({
    where: { id: clerkUserId },
    update: { email },
    create: {
      id: clerkUserId,
      email,
      encryptionSalt: generateSalt(),
    },
  });
}

export async function getUserWithConfigs(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      providerConfigs: true,
      mcpServers: true,
    },
  });
}
