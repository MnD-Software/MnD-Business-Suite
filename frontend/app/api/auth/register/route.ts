import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/env";
import { fetchBackend } from "@/lib/backend-fetch";

export async function POST(req: Request) {
  const body = await req.json();
  let res: Response;
  try {
    res = await fetchBackend(`${backendUrl()}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.message.includes("timed out");
    return NextResponse.json({ error: isTimeout ? "Backend request timed out" : "Registration failed" }, { status: isTimeout ? 504 : 502 });
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) return NextResponse.json(data ?? { error: "Registration failed" }, { status: res.status });

  return NextResponse.json(data);
}
