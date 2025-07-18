"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "..";
import { checkboxes as checkboxSchema } from "../schema";

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

export async function updateCheckboxText(id: number, text: string) {
  try {
    await db
      .update(checkboxSchema)
      .set({ text })
      .where(eq(checkboxSchema.id, id));

    revalidateTag("blocks");
    return { success: true, message: "Checkbox text updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update checkbox text" };
  }
}

export async function deleteCheckbox(id: number) {
  try {
    await db.delete(checkboxSchema).where(eq(checkboxSchema.id, id));

    revalidateTag("blocks");
    return { success: true, message: "Checkbox deleted successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete checkbox" };
  }
}
