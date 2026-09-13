"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import AuthFormShell, { AuthField } from "@/components/auth/AuthFormShell";
import AuthDivider from "@/components/auth/AuthDivider";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { ApiError, useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(searchParams.get("error") || "");
  const [submitting, setSubmitting] = useState(false);

  const redirect = searchParams.get("redirect") || "/checkout";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      router.push(redirect);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof TypeError) {
        setError("Network error — could not reach the server. Check your connection.");
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      title="Welcome Back"
      subtitle="Sign in to continue to checkout and complete your Layer Craft House order."
      footer={
        <>
          New here?{" "}
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirect)}`}
            className="text-gold transition-colors hover:text-ivory"
          >
            Create an account
          </Link>
        </>
      }
    >
      <GoogleSignInButton redirectTo={redirect} />
      <AuthDivider />
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthField
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <AuthField
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthFormShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading sign in..." />}>
      <LoginForm />
    </Suspense>
  );
}
