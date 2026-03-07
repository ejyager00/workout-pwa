export interface User {
  id: string;
  username: string;
}

export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  JWT_SECRET: string;
  PASSWORD_PEPPER: string;
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_SITE_KEY: string;
  ASSETS: Fetcher;
  ENVIRONMENT?: string;
}
