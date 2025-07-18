"use server";

import { revalidateTag } from "next/cache";
import { db } from "..";
import { eq } from "drizzle-orm";
import { listItems as listSchema } from "../schema";

export async function updateListItemText(id: number, text: string) {
  try {
    await db.update(listSchema).set({ text }).where(eq(listSchema.id, id));

    revalidateTag("blocks");
    return { success: true, message: "List item text updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update list item text" };
  }
}
