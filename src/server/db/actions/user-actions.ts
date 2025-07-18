import { eq } from "drizzle-orm";
import { db } from "..";
import { user as userSchema } from "../schema";

export async function markUserAsOnboarded(userId: string) {
  await db
    .update(userSchema)
    .set({ hasOnboarded: true })
    .where(eq(userSchema.id, userId));
}
