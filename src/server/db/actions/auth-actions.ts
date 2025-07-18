import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { db } from "..";
import { user as userSchema } from "../schema";

export async function signInWithGoogle() {
  try {
    await auth.api.signInSocial({
      headers: await headers(),
      body: {
        provider: "google",
        // callbackURL: "/api/sign-in",
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error("Something went wrong while signing in");
  }
}

export async function markUserAsOnboarded(userId: string) {
  await db
    .update(userSchema)
    .set({ hasOnboarded: true })
    .where(eq(userSchema.id, userId));
}
