"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "..";
import { paragraphs as paragraphSchema } from "../schema";

export async function updateParagraphText(id: number, text: string) {
  try {
    await db
      .update(paragraphSchema)
      .set({ text })
      .where(eq(paragraphSchema.id, id));

    revalidateTag("blocks");
    return { success: true, message: "Paragraph updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update paragraph" };
  }
}
