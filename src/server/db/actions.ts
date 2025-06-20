"use server";
import { eq } from "drizzle-orm";
import { db } from ".";
import { checkboxes as checkboxSchema } from "./schema";
import { revalidateTag } from "next/cache";

export async function updateCheckbox(checked: boolean, id: number) {
  try {
    await db
      .update(checkboxSchema)
      .set({ checked })
      .where(eq(checkboxSchema.id, id));

    revalidateTag("blocks");
    return { success: true, message: "Checkbox updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update checkbox" };
  }
}
