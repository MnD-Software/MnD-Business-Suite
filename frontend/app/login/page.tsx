"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center p-6 text-fg-subtle">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = useMemo(() => sp.get("next") ?? "/dashboard", [sp]);
  const [isRegister, setIsRegister] = useState(false);
  const [orgSlug, setOrgSlug] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [noticeType, setNoticeType] = useState<"error" | "success" | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNoticeType(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (password.length < 10) {
          throw new Error("Password must be at least 10 characters");
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            org_name: orgName,
            org_slug: orgSlug.toLowerCase().replace(/\s+/g, "-"),
            admin_email: email,
            admin_full_name: fullName,
            admin_password: password,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const msg = data?.error?.message ?? data?.error ?? "Registration failed";
          if (msg.includes("already exists") || msg.includes("unique")) {
            throw new Error("This company or email is already registered. Try a different slug or sign in.");
          }
          throw new Error(msg);
        }

        router.push(`/login?next=${encodeURIComponent(next)}`);
        setIsRegister(false);
        setPassword("");
        setConfirmPassword("");
        setError("Registration successful! Please sign in.");
        setNoticeType("success");
      } else {
        const normalizedOrgSlug = orgSlug.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ org_slug: normalizedOrgSlug, email: normalizedEmail, password }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error?.message ?? data?.error ?? "Login failed");
        }

        router.prefetch(next as any);
        router.push(next as any);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error during login";
      setError(message);
      setNoticeType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <Logo />
          <div className="text-left">
            <div className="text-lg font-semibold text-fg">{isRegister ? "Create your company" : "Secure SME workspace"}</div>
          </div>
        </div>

        <Card className="p-6">
          <form
              key={isRegister ? "register" : "login"}
              onSubmit={onSubmit}
              className="space-y-3"
            >
              {isRegister && (
                <>
                  <div>
                    <div className="mb-1 text-xs text-fg-subtle">Company Name</div>
                    <Input
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="My Company Ltd"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-fg-subtle">Company Slug</div>
                    <Input
                      value={orgSlug}
                      onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                      placeholder="my-company"
                      title="Lowercase letters, numbers, and hyphens only"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-fg-subtle">Your Full Name</div>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                      autoComplete="off"
                    />
                  </div>
                </>
              )}
              {!isRegister && (
                <div>
                  <div className="mb-1 text-xs text-fg-subtle">Organization slug</div>
                  <Input value={orgSlug} onChange={(e) => setOrgSlug(e.target.value)} placeholder="my-company" autoComplete="off" required />
                </div>
              )}
              <div>
                <div className="mb-1 text-xs text-fg-subtle">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" type="email" required autoComplete="off" />
              </div>
              <div>
                <div className="mb-1 text-xs text-fg-subtle">Password</div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="************"
                  required
                  minLength={isRegister ? 10 : 1}
                  autoComplete="off"
                />
              </div>
              {isRegister && (
                <div>
                  <div className="mb-1 text-xs text-fg-subtle">Confirm Password</div>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="************"
                    required
                    minLength={10}
                    autoComplete="off"
                  />
                </div>
              )}
              {error && (
                <div
                  className={
                    noticeType === "success"
                      ? "rounded-2xl border border-green-500/45 bg-green-500/15 p-3 text-sm font-medium text-green-700"
                      : "rounded-2xl border border-red-500/45 bg-red-500/15 p-3 text-sm font-medium text-red-700"
                  }
                >
                  {error}
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (isRegister ? "Creating account..." : "Signing in...") : (isRegister ? "Create Company" : "Sign in")}
              </Button>
            </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-sm text-fg-subtle hover:text-fg underline"
            >
              {isRegister ? "Already have an account? Sign in" : "Don't have a company? Register your organization"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
