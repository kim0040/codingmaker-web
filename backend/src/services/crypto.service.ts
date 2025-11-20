import crypto from "node:crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = process.env.CIPHER_KEY ?? "";

if (!KEY) {
  throw new Error("CIPHER_KEY is not set in environment variables");
}

const KEY_BUFFER = Buffer.from(KEY, "hex");

if (KEY_BUFFER.length !== 32) {
  throw new Error("CIPHER_KEY must be a 32-byte hex string (64 hex characters)");
}

/**
 * AES-256-CBC 암호화 (Random IV)
 * @param value 평문
 * @returns "iv:ciphertext" 형식의 암호화된 문자열
 */
export function encrypt(value: string | null | undefined): string | null | undefined {
  if (!value) return value ?? null;

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * AES-256-CBC 복호화
 * @param value "iv:ciphertext" 형식의 암호화된 문자열
 * @returns 복호화된 평문
 */
export function decrypt(value: string | null | undefined): string | null | undefined {
  if (!value) return value ?? null;
  if (!value.includes(":")) return value;

  const [ivHex, cipherHex] = value.split(":");
  if (!ivHex || !cipherHex) {
    throw new Error("Invalid encrypted value format. Expected iv:ciphertext");
  }

  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(cipherHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString("utf8");
}

/**
 * 객체의 여러 필드를 일괄 암호화
 */
export function encryptFields<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
): T {
  const clone = { ...data };
  for (const field of fields) {
    const fieldValue = clone[field];
    if (typeof fieldValue === "string" && fieldValue) {
      clone[field] = encrypt(fieldValue) as T[keyof T];
    }
  }
  return clone;
}

/**
 * 객체의 여러 필드를 일괄 복호화
 */
export function decryptFields<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
): T {
  const clone = { ...data };
  for (const field of fields) {
    const fieldValue = clone[field];
    if (typeof fieldValue === "string" && fieldValue) {
      clone[field] = decrypt(fieldValue) as T[keyof T];
    }
  }
  return clone;
}
