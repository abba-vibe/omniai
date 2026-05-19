import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  hkdf,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";

function getMasterKey(): Buffer {
  const key = process.env.MASTER_ENCRYPTION_KEY;
  if (!key) {
    throw new Error("MASTER_ENCRYPTION_KEY environment variable is required");
  }
  return Buffer.from(key, "base64");
}

async function deriveUserKey(userSalt: string): Promise<Buffer> {
  const masterKey = getMasterKey();
  return new Promise((resolve, reject) => {
    hkdf(
      "sha256",
      masterKey,
      Buffer.from(userSalt, "base64"),
      "omniai-api-keys",
      32,
      (err, derivedKey) => {
        if (err) reject(err);
        else resolve(Buffer.from(derivedKey));
      }
    );
  });
}

export async function encryptApiKey(
  plaintext: string,
  userSalt: string
): Promise<{ encryptedApiKey: string; iv: string; authTag: string }> {
  const key = await deriveUserKey(userSalt);
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedApiKey: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

export async function decryptApiKey(
  encryptedApiKey: string,
  iv: string,
  authTag: string,
  userSalt: string
): Promise<string> {
  const key = await deriveUserKey(userSalt);
  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64"));
  return decipher.update(encryptedApiKey, "base64", "utf8") + decipher.final("utf8");
}

export function generateSalt(): string {
  return randomBytes(16).toString("base64");
}
