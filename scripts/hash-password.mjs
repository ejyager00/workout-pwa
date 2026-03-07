#!/usr/bin/env node
/**
 * Generate a peppered password hash for manual DB insertion.
 *
 * Usage:
 *   node scripts/hash-password.mjs <password> <pepper>
 *
 * Then update the DB:
 *   npx wrangler d1 execute workout-pwa-db --remote \
 *     --command "UPDATE users SET password_hash='<hash>' WHERE username='<you>'"
 */

import { webcrypto } from "node:crypto";

const ITERATIONS = 100_000;
const KEY_LENGTH = 32;

const [, , password, pepper] = process.argv;

if (!password || !pepper) {
  console.error("Usage: node scripts/hash-password.mjs <password> <pepper>");
  process.exit(1);
}

const enc = new TextEncoder();
const salt = webcrypto.getRandomValues(new Uint8Array(16));

const keyMaterial = await webcrypto.subtle.importKey(
  "raw",
  enc.encode(password),
  "PBKDF2",
  false,
  ["deriveBits"]
);

const stretched = await webcrypto.subtle.deriveBits(
  { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
  keyMaterial,
  KEY_LENGTH * 8
);

const hmacKey = await webcrypto.subtle.importKey(
  "raw",
  enc.encode(pepper),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign"]
);

const finalHash = await webcrypto.subtle.sign("HMAC", hmacKey, stretched);

const b64salt = btoa(String.fromCharCode(...salt));
const b64hash = btoa(String.fromCharCode(...new Uint8Array(finalHash)));

console.log(`pbkdf2-hmac:sha256:${ITERATIONS}:${b64salt}:${b64hash}`);
