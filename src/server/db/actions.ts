"use server";
import { eq } from "drizzle-orm";
import { db } from ".";
import {
  blocks as blockSchema,
  checkboxes as checkboxSchema,
  headings as headingSchema,
  type BlockWithContent,
} from "./schema";
import { revalidateTag } from "next/cache";
import { createPageFromAI, type AIGeneratedPage } from "../openai";

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

export async function generateStructuredContentWithAI(
  formData: FormData,
  pageId: string,
  lastBlockDisplayOrder: number,
): Promise<{ success: boolean; result?: BlockWithContent; error?: string }> {
  const prompt = formData.get("prompt") as string;

  if (!prompt) {
    return { success: false, error: "Prompt is required" };
  }

  try {
    const result = await createPageFromAI(
      prompt,
      pageId,
      lastBlockDisplayOrder,
    );
    console.log(result);

    return { success: true, result: result.result };
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate structured content, ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function saveDraftIntoDb(draft: BlockWithContent) {
  const createBlockValues = {
    text: draft.text,
    pageId: draft.pageId,
  };

  try {
    // Simulate a 3 second delay for db operation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await db.transaction(async (tx) => {
      const [block] = await tx
        .insert(blockSchema)
        .values(createBlockValues)
        .returning();

      for (const checkbox of draft.checkboxes) {
        const { id, ...rest } = checkbox;
        await tx.insert(checkboxSchema).values({
          ...rest,
          blockId: block!.id,
        });
      }
      for (const heading of draft.headings) {
        const { id, ...rest } = heading;
        await tx.insert(headingSchema).values({
          ...rest,
          blockId: block!.id,
        });
      }
    });

    revalidateTag("pages");
    revalidateTag("blocks");
    revalidateTag(`page-${draft.pageId}`);

    return { success: true, message: "Draft saved successfully" };
  } catch (e) {
    console.error(
      "Failed to save draft into the database",
      e instanceof Error ? e.message : "Unknown error",
    );
    return {
      success: false,
      message: `Failed to save draft, ${e instanceof Error ? e.message : "Unknown error"}`,
    };
  }
}

export async function deleteBlockFromDb(id: number, pageId: string) {
  try {
    await db.delete(blockSchema).where(eq(blockSchema.id, id));

    revalidateTag("blocks");
    revalidateTag("pages");
    revalidateTag(`page-${pageId}`);

    return { success: true, message: "Block deleted successfully" };
  } catch (e) {
    console.error(
      "Failed to delete block from the database",
      e instanceof Error ? e.message : "Unknown error",
    );
    return { success: false, message: "Failed to delete block" };
  }
}

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
