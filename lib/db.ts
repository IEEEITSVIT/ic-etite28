import "server-only";

// Client for the D1 gateway Worker (workers/d1-gateway). All SQL is parameterised.

type Row = Record<string, unknown>;
export type Statement = { sql: string; params?: unknown[] };

const GATEWAY_URL = process.env.D1_GATEWAY_URL?.replace(/\/+$/, "");
const GATEWAY_SECRET = process.env.D1_GATEWAY_SECRET;

export function isDbConfigured(): boolean {
  return Boolean(GATEWAY_URL && GATEWAY_SECRET);
}

async function call<T>(path: "/query" | "/batch", body: unknown): Promise<T> {
  if (!GATEWAY_URL || !GATEWAY_SECRET) {
    throw new Error("Database is not configured (set D1_GATEWAY_URL and D1_GATEWAY_SECRET).");
  }
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${GATEWAY_SECRET}` },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string } & T;
  if (!res.ok) throw new Error(`D1 error: ${data.error ?? res.statusText}`);
  return data;
}

// D1 rejects `undefined` bindings; normalise to null and booleans to 0/1.
const norm = (params: unknown[] = []) =>
  params.map((p) => (p === undefined ? null : typeof p === "boolean" ? (p ? 1 : 0) : p));

export async function all<T = Row>(sql: string, params?: unknown[]): Promise<T[]> {
  const data = await call<{ results: T[] }>("/query", { sql, params: norm(params) });
  return data.results ?? [];
}

export async function first<T = Row>(sql: string, params?: unknown[]): Promise<T | null> {
  const rows = await all<T>(sql, params);
  return rows[0] ?? null;
}

export async function run(sql: string, params?: unknown[]): Promise<{ changes: number }> {
  const data = await call<{ meta?: { changes?: number } }>("/query", { sql, params: norm(params) });
  return { changes: data.meta?.changes ?? 0 };
}

// Runs statements atomically (D1 batches are a single transaction).
export async function batch(statements: Statement[]): Promise<Row[][]> {
  if (statements.length === 0) return [];
  const data = await call<{ results: { results: Row[] }[] }>("/batch", {
    statements: statements.map((s) => ({ sql: s.sql, params: norm(s.params) })),
  });
  return data.results.map((r) => r.results ?? []);
}

// Large writes split into several transactions (D1 caps statements per batch).
export async function batchChunked(statements: Statement[], size = 50): Promise<void> {
  for (let i = 0; i < statements.length; i += size) await batch(statements.slice(i, i + size));
}

export const now = () => new Date().toISOString();

export function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
