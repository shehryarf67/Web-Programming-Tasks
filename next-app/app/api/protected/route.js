import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({
      message: "Protected data",
      user: decoded,
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}