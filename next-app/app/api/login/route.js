import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  // Replace with database validation
  if (username !== "admin" || password !== "123") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { username, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const response = NextResponse.json({ message: "Login successful" });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return response;
}
