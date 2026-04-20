import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/logout/actions";

export default async function DashboardPage() {
  const userEmail = await getSession();

  if (!userEmail) {
    redirect("/login");
  }

  return (
    <main className="auth-wrapper">
      <div className="card">
        <h1>Dashboard</h1>
        <p className="welcome">Welcome, {userEmail}</p>
        <p>You are logged in and this route is protected.</p>

        <form action={logoutAction}>
          <button type="submit" className="btn logout-btn">
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}