"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signupAction } from "./actions";

const initialState = { error: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn">
      {pending ? "Creating account..." : "Sign Up"}
    </button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <main className="auth-wrapper">
      <div className="card">
        <h1>Create Account</h1>
        <form action={formAction} className="form">
          <input type="email" name="email" placeholder="Enter email" required className="input" />
          <input type="password" name="password" placeholder="Enter password" required className="input" />

          {state?.error && <p className="error">{state.error}</p>}

          <SubmitButton />
        </form>

        <p className="switch-text">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}