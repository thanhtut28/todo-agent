"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "..";
import { headings as headingSchema } from "../schema";

export async function updateHeadingText(id: number, text: string) {
  try {
    await db
      .update(headingSchema)
      .set({ text })
      .where(eq(headingSchema.id, id));

    revalidateTag("blocks");
    return { success: true, message: "Heading updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update heading" };
  }
}
