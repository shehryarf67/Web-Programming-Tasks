"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setError("Please check your username and password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-4 py-10 text-slate-950">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:grid-cols-[1fr_420px]">
        <div className="flex min-h-[520px] flex-col justify-between bg-slate-950 p-8 text-white sm:p-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">
              Secure Area
            </p>
            <h1 className="mt-5 max-w-md text-4xl font-semibold leading-tight">
              Sign in to continue to your dashboard.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
              Use your account credentials to access the protected dashboard and
              verify the API-backed login flow.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-white">Protected route</p>
              <p className="mt-1 leading-6">Dashboard access is checked by middleware.</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-white">Demo login</p>
              <p className="mt-1 leading-6">Username: admin, password: 123</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col justify-center p-8 sm:p-10">
          <div>
            <p className="text-sm font-medium text-cyan-700">Welcome back</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Login</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Enter your credentials below to open the dashboard.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Username</span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                placeholder="admin"
                autoComplete="username"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                placeholder="123"
                autoComplete="current-password"
                required
              />
            </label>
          </div>

          {error ? (
            <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
