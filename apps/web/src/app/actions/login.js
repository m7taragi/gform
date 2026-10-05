"use server";

import { cookies } from "next/headers";
import { prisma } from "@gform/database";
import { redirect } from "next/navigation";

export async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Simple hardcoded check for MVP, or query DB
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && user.password === password) {
    // Set a secure session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    
    redirect("/admin");
  }

  return { error: "Invalid credentials." };
}
