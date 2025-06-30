"use server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from ".";
import { checkboxes as checkboxSchema } from "./schema";
import { revalidateTag } from "next/cache";
import { createPageFromAI } from "../openai";

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

export async function generatePageWithAI(formData: FormData) {
  const prompt = formData.get("prompt") as string;

  if (!prompt) {
    return;
  }

  try {
    const result = await createPageFromAI(prompt);
    console.log(result);

    // if (result.success && result.pageId) {
    //   redirect(`/page/${result.pageId}`);
    // }
  } catch (error) {
    console.error("Error in generatePageWithAI:", error);
  }
}
