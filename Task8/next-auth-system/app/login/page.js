"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "./actions";

const initialState = { error: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn">
      {pending ? "Logging in..." : "Login"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <main className="auth-wrapper">
      <div className="card">
        <h1>Login</h1>
        <form action={formAction} className="form">
          <input type="email" name="email" placeholder="Enter email" required className="input" />
          <input type="password" name="password" placeholder="Enter password" required className="input" />

          {state?.error && <p className="error">{state.error}</p>}

          <SubmitButton />
        </form>

        <p className="switch-text">
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}