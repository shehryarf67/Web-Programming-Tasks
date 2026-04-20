import Link from "next/link";

export default function HomePage() {
  return (
    <main className="auth-wrapper">
      <div className="card">
        <h1>Next.js Auth System</h1>
        <p>
          A simple authentication system using MongoDB, Mongoose, bcrypt,
          Server Actions, and cookies.
        </p>

        <div className="button-group">
          <Link href="/signup" className="btn">
            Sign Up
          </Link>
          <Link href="/login" className="btn secondary-btn">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}