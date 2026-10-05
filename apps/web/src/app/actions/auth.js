"use server";

import { cookies } from "next/headers";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@gform/database";

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function verifyGoogleTokenAndLogin(credential) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Invalid token payload");
    }

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { email: payload.email },
      update: {
        name: payload.name,
        avatarUrl: payload.picture,
      },
      create: {
        email: payload.email,
        name: payload.name,
        avatarUrl: payload.picture,
      },
    });

    // Set secure HTTP-only cookie
    // In production, you would issue a signed JWT. Storing user ID directly is just for the structural scaffold.
    const cookieStore = await cookies();
    cookieStore.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, user };
  } catch (error) {
    console.error("Auth Error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}
