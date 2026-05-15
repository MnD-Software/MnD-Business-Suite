import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/env";
import { fetchBackend } from "@/lib/backend-fetch";

async function handler(req: Request, ctx: { params: { path: string[] } }) {
  const p = ctx.params.path.join("/");
  const url = new URL(req.url);
  const target = `${backendUrl()}/api/v1/store/${p}${url.search}`;

  const headers = new Headers(req.headers);
  headers.set("accept", "application/json");
  headers.delete("host");

  const init: RequestInit = { method: req.method, headers, cache: "no-store" };
  if (req.method !== "GET" && req.method !== "HEAD") init.body = await req.text();

  try {
    const res = await fetchBackend(target, init);
    const contentType = res.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json") ? await res.json() : await res.text();
    return NextResponse.json(body, { status: res.status });
  } catch (error) {
    const isTimeout = error instanceof Error && error.message.includes("timed out");
    return NextResponse.json({ error: { message: isTimeout ? "Backend request timed out" : "Failed to connect to backend" } }, { status: isTimeout ? 504 : 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
