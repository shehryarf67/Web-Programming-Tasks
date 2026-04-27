"use client";

import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }

    setLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "28px",
  },
  input: {
    padding: "10px",
    width: "220px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};