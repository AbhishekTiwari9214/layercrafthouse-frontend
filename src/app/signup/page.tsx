"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import AuthFormShell, { AuthField } from "@/components/auth/AuthFormShell";
import AuthDivider from "@/components/auth/AuthDivider";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { ApiError, useAuth } from "@/context/AuthContext";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirect = searchParams.get("redirect") || "/checkout";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signup(name, email, password);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFormShell
      title="Create Account"
      subtitle="Join Layer Craft House to save your details and checkout your duffel."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="text-gold transition-colors hover:text-ivory"
          >
            Sign in
          </Link>
        </>
      }
    >
      <GoogleSignInButton redirectTo={redirect} label="Sign up with Google" />
      <AuthDivider label="or sign up with email" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthField
          label="Full Name"
          id="name"
          value={name}
          onChange={setName}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthFormShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading sign up..." />}>
      <SignupForm />
    </Suspense>
  );
}
