"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const router = useRouter();
  const { loginSuccess } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    // Uses a ref (not state) because state updates aren't applied
    // synchronously — several rapid clicks can all fire before React
    // re-renders and disables the button, letting duplicate requests
    // slip through a state-only guard.
    if (submittingRef.current) return;
    submittingRef.current = true;

    setError("");
    setSubmitting(true);
    try {
      const res = await login(username, password);
      loginSuccess(res.data.accessToken);
      router.push("/products");
    } catch (err) {
      const status = err.response?.status;
      if (status === 400 || status === 401) {
        setError("That username or password isn't right.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white font-semibold mb-3">
            P
          </div>
          <h1 className="text-xl font-semibold">Sign in to Product Admin</h1>
          <p className="text-sm text-muted mt-1">Manage the product catalog</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-line rounded-xl p-6 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-danger-light text-danger text-sm px-3 py-2">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="w-full border border-line rounded-lg px-3 py-2 mb-4 text-sm focus:border-accent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full border border-line rounded-lg px-3 py-2 mb-5 text-sm focus:border-accent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {submitting && (
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-xs text-muted text-center mt-4">
          Demo credentials: emilys / emilyspass
        </p>
      </div>
    </div>
  );
}