// Executes parameterised SQL against D1 for the ic-ETITE'28 portal.
// Only the Next.js server holds GATEWAY_SECRET; nothing here is reachable without it.

interface Env {
  DB: D1Database;
  GATEWAY_SECRET: string;
}

type Statement = { sql: string; params?: unknown[] };

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const auth = request.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!env.GATEWAY_SECRET || !timingSafeEqual(token, env.GATEWAY_SECRET)) {
      return json({ error: "Unauthorized" }, 401);
    }

    const path = new URL(request.url).pathname;
    let body: { statements?: Statement[] } & Statement;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    try {
      if (path === "/query") {
        const res = await env.DB.prepare(body.sql).bind(...(body.params ?? [])).all();
        return json({ results: res.results, meta: res.meta });
      }
      if (path === "/batch") {
        const statements = (body.statements ?? []).map((s) => env.DB.prepare(s.sql).bind(...(s.params ?? [])));
        if (statements.length === 0) return json({ results: [] });
        const res = await env.DB.batch(statements);
        return json({ results: res.map((r) => ({ results: r.results, meta: r.meta })) });
      }
      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : String(err) }, 400);
    }
  },
};
