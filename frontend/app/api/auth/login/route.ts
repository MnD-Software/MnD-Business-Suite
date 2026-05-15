import { NextResponse } from "next/server";
import { backendUrl, cookieSecure } from "@/lib/env";
import { fetchBackend } from "@/lib/backend-fetch";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const doLogin = () =>
      fetchBackend(
        `${backendUrl()}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        25000
      );

    let res: Response;
    try {
      res = await doLogin();
    } catch (error) {
      const isTimeout = error instanceof Error && error.message.includes("timed out");
      if (!isTimeout) throw error;
      // Retry once to absorb cold-start or transient upstream latency.
      res = await doLogin();
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(data ?? { error: "Login failed" }, { status: res.status });
    }

    const out = NextResponse.json({ ok: true });
    out.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: cookieSecure(),
      path: "/",
      maxAge: 60 * 15,
    });
    out.cookies.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: cookieSecure(),
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    out.cookies.set("org_slug", body.org_slug ?? "", {
      httpOnly: true,
      sameSite: "lax",
      secure: cookieSecure(),
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return out;
  } catch (error) {
    const isTimeout = error instanceof Error && error.message.includes("timed out");
    return NextResponse.json({ error: isTimeout ? "Backend request timed out" : "Login error" }, { status: isTimeout ? 504 : 502 });
  }
}

