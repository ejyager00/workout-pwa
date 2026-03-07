/**
 * Password hashing and verification using SubtleCrypto (PBKDF2-SHA256 + HMAC pepper).
 * No Node.js crypto — works in the Cloudflare Workers runtime.
 *
 * Format: "pbkdf2-hmac:sha256:<iterations>:<base64salt>:<base64hmac>"
 * The pepper (a Worker secret) is applied as an HMAC-SHA256 key over the PBKDF2 output.
 * This means a DB-only compromise cannot be used for offline cracking without the pepper.
 */

const ITERATIONS = 100_000; // Cloudflare Workers WebCrypto caps PBKDF2 at 100,000
const HASH_ALG = "SHA-256";
const KEY_LENGTH = 32; // bytes

/**
 * Hash a password with PBKDF2-SHA256, then HMAC with the pepper.
 * Returns: "pbkdf2-hmac:sha256:<iterations>:<base64salt>:<base64hmac>"
 */
export async function hashPassword(password: string, pepper: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const stretched = await pbkdf2(password, salt, ITERATIONS);
  const hash = await hmacSha256(stretched, pepper);

  const b64salt = btoa(String.fromCharCode(...salt));
  const b64hash = btoa(String.fromCharCode(...new Uint8Array(hash)));

  return `pbkdf2-hmac:sha256:${ITERATIONS}:${b64salt}:${b64hash}`;
}

/**
 * Verify a password against a stored hash string.
 */
export async function verifyPassword(
  password: string,
  stored: string,
  pepper: string
): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 5 || parts[0] !== "pbkdf2-hmac" || parts[1] !== "sha256") {
    return false;
  }

  const iterations = parseInt(parts[2], 10);
  const salt = Uint8Array.from(atob(parts[3]), (c) => c.charCodeAt(0));
  const expectedHash = Uint8Array.from(atob(parts[4]), (c) => c.charCodeAt(0));

  const stretched = await pbkdf2(password, salt, iterations);
  const actualHash = await hmacSha256(stretched, pepper);

  // Constant-time comparison
  return timingSafeEqual(new Uint8Array(actualHash), expectedHash);
}

async function hmacSha256(data: ArrayBuffer, pepper: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(pepper),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, data);
}

async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: HASH_ALG,
      salt,
      iterations,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}
