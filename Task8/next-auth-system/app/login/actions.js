"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { createSession } from "@/lib/auth";
import User from "@/models/User";

export async function loginAction(prevState, formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString().trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid email or password." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Invalid email or password." };
    }

    await createSession(user.email);
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/dashboard");
}