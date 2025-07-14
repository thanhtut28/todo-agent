"use server";

import { run } from "@openai/agents";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import {
  covertAIGeneratedContentToBlockWithContent,
  type FlattenBlockItem,
} from "~/lib/utils";

import type {
  BlockItemType,
  BlockItemVariantType,
  CreateNewBlockType,
} from "~/lib/types";
import { db } from ".";
import agent from "../agent/agent";
import { createPageFromAI } from "../openai";
import { blockGenerationOutput } from "./../agent/tool";
import {
  blocks as blockSchema,
  checkboxes as checkboxSchema,
  headings as headingSchema,
  links as linkSchema,
  listItems as listSchema,
  paragraphs as paragraphSchema,
  type BlockWithContent,
  type Checkbox,
  type Heading,
  type Link,
  type ListItem,
  type Paragraph,
} from "./schema";

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
      for (const paragraph of draft.paragraphs) {
        const { id, ...rest } = paragraph;
        await tx.insert(paragraphSchema).values({
          ...rest,
          blockId: block!.id,
        });
      }
      for (const listItem of draft.listItems) {
        const { id, ...rest } = listItem;
        await tx.insert(listSchema).values({
          ...rest,
          blockId: block!.id,
        });
      }
      for (const link of draft.links) {
        const { id, ...rest } = link;
        await tx.insert(linkSchema).values({
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

export async function createNewBlockItem({
  type,
  displayOrder,
  blockId,
  toUpdateItems,
}: {
  type: CreateNewBlockType;
  displayOrder: number;
  blockId: number;
  toUpdateItems: FlattenBlockItem[];
}): Promise<{
  success: boolean;
  message: string;
  result?: BlockItemType | undefined;
}> {
  let result: BlockItemType | undefined;
  if (displayOrder === 0)
    return { success: false, message: "Invalid display order" };

  try {
    await db.transaction(async (tx) => {
      switch (type) {
        case "checkbox":
          const [checkbox] = await tx
            .insert(checkboxSchema)
            .values({
              text: "",
              blockId,
              checked: false,
              createdAt: new Date(),
              updatedAt: null,
              color: "white",
              fontSize: "md",
              displayOrder: displayOrder + 1,
            })
            .returning();

          result = checkbox;
        //TODO: Add other block types
      }

      for (const item of toUpdateItems) {
        switch (item.variant) {
          case "checkbox":
            await tx
              .update(checkboxSchema)
              .set({
                displayOrder: item.item.displayOrder + 1,
              })
              .where(eq(checkboxSchema.id, item.item.id));
            break;
          case "heading":
            await tx
              .update(headingSchema)
              .set({
                displayOrder: item.item.displayOrder + 1,
              })
              .where(eq(headingSchema.id, item.item.id));
            break;
          case "paragraph":
            await tx
              .update(paragraphSchema)
              .set({
                displayOrder: item.item.displayOrder + 1,
              })
              .where(eq(paragraphSchema.id, item.item.id));
            break;
          case "list":
            await tx
              .update(listSchema)
              .set({
                displayOrder: item.item.displayOrder + 1,
              })
              .where(eq(listSchema.id, item.item.id));
            break;
          case "link":
            await tx
              .update(linkSchema)
              .set({
                displayOrder: item.item.displayOrder + 1,
              })
              .where(eq(linkSchema.id, item.item.id));
            break;
          default:
            break;
        }
      }

      revalidateTag("blocks");
      revalidateTag(`page-${blockId}`);
    });
    return {
      success: true,
      message: "Block item created successfully",
      result,
    };
  } catch (e) {
    console.error("Failed to create new block item", e);
    return { success: false, message: "Failed to create new block item" };
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

export async function updateBlockItem(
  id: number,
  item: BlockItemType,
  oldItemType: BlockItemVariantType,
  newItemType: BlockItemVariantType,
) {
  const { createdAt, updatedAt, ...rest } = item;

  async function insertNewItem(
    tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
    item: Omit<BlockItemType, "id">,
  ) {
    switch (newItemType) {
      case "checkbox":
        await tx.insert(checkboxSchema).values(item as Checkbox);
        break;
      case "heading":
        await tx.insert(headingSchema).values(item as Heading);
        break;
      case "paragraph":
        await tx.insert(paragraphSchema).values(item as Paragraph);
        break;
      case "list":
        await tx.insert(listSchema).values(item as ListItem);
        break;
      case "link":
        await tx.insert(linkSchema).values(item as Link);
        break;
      default:
        throw new Error(`Unsupported item type`);
    }
  }

  try {
    switch (oldItemType) {
      case "checkbox":
        if (newItemType === "checkbox") {
          await db
            .update(checkboxSchema)
            .set(rest)
            .where(eq(checkboxSchema.id, id));
        } else {
          await db.transaction(async (tx) => {
            await tx.delete(checkboxSchema).where(eq(checkboxSchema.id, id));
            await insertNewItem(tx, {
              ...rest,
              createdAt: new Date(),
              updatedAt: null,
            });
          });
        }
        break;
      case "heading":
        if (newItemType === "heading") {
          await db
            .update(headingSchema)
            .set(rest)
            .where(eq(headingSchema.id, id));
        } else {
          await db.transaction(async (tx) => {
            await tx.delete(headingSchema).where(eq(headingSchema.id, id));
            await insertNewItem(tx, {
              ...rest,
              createdAt: new Date(),
              updatedAt: null,
            });
          });
        }
        break;
      case "paragraph":
        if (newItemType === "paragraph") {
          await db
            .update(paragraphSchema)
            .set(rest)
            .where(eq(paragraphSchema.id, id));
        } else {
          await db.transaction(async (tx) => {
            await tx.delete(paragraphSchema).where(eq(paragraphSchema.id, id));
            await insertNewItem(tx, {
              ...rest,
              createdAt: new Date(),
              updatedAt: null,
            });
          });
        }
        break;
      case "list":
        if (newItemType === "list") {
          await db.update(listSchema).set(rest).where(eq(listSchema.id, id));
        } else {
          await db.transaction(async (tx) => {
            await tx.delete(listSchema).where(eq(listSchema.id, id));
            await insertNewItem(tx, {
              ...rest,
              createdAt: new Date(),
              updatedAt: null,
            });
          });
        }
        break;
      case "link":
        if (newItemType === "link") {
          await db.update(linkSchema).set(rest).where(eq(linkSchema.id, id));
        } else {
          await db.transaction(async (tx) => {
            await tx.delete(linkSchema).where(eq(linkSchema.id, id));
            await insertNewItem(tx, {
              ...rest,
              createdAt: new Date(),
              updatedAt: null,
            });
          });
        }
        break;
    }

    revalidateTag("blocks");

    return {
      success: true,
      message: `Block item updated successfully`,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: `Failed to update ${newItemType} item`,
    };
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

export async function updateBlock(items: FlattenBlockItem[]) {
  try {
    console.log("items", items);
    await db.transaction(async (tx) => {
      for (const item of items) {
        const { createdAt, updatedAt, ...rest } = item.item;
        switch (item.variant) {
          case "heading":
            await tx
              .update(headingSchema)
              .set({
                ...rest,
              } as Heading)
              .where(eq(headingSchema.id, item.item.id));
            break;
          case "checkbox":
            await tx
              .update(checkboxSchema)
              .set({
                ...rest,
              } as Checkbox)
              .where(eq(checkboxSchema.id, item.item.id));
            break;
          case "paragraph":
            await tx
              .update(paragraphSchema)
              .set({
                ...rest,
              } as Paragraph)
              .where(eq(paragraphSchema.id, item.item.id));
            break;
          case "list":
            await tx
              .update(listSchema)
              .set({
                ...rest,
              } as ListItem)
              .where(eq(listSchema.id, item.item.id));
            break;
          case "link":
            await tx
              .update(linkSchema)
              .set({
                ...rest,
              } as Link)
              .where(eq(linkSchema.id, item.item.id));
            break;
        }
      }
    });
  } catch (e) {
    console.error("Failed to update block", e);
  }

  revalidateTag("blocks");

  return { success: true, message: "Block updated successfully" };
}

//  ================================================ Agent ================================================

export async function generateBlocksWithAgent(
  formData: FormData,
  pageId: string,
  lastBlockDisplayOrder: number,
) {
  const prompt = formData.get("prompt") as string;

  if (!prompt) {
    return { success: false, error: "Prompt is required" };
  }

  try {
    const result = await run(agent, prompt, { stream: false });
    const jsonParsed = JSON.parse(result.finalOutput ?? "{}");
    const parsedResult = blockGenerationOutput.parse(jsonParsed);

    const blockWithContent = covertAIGeneratedContentToBlockWithContent(
      parsedResult,
      pageId,
      lastBlockDisplayOrder,
    );

    return { success: true, result: blockWithContent };
  } catch (error) {
    console.error("Error generating blocks with agent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function* generateBlocksWithAgentStream(
  prompt: string,
  pageId: string,
  lastBlockDisplayOrder: number,
) {
  try {
    const result = await run(agent, prompt, { stream: true });

    // Get the text stream for progressive text updates
    const textStream = result.toTextStream();
    let accumulatedText = "";

    // Stream text updates
    for await (const textChunk of textStream) {
      accumulatedText += textChunk;
      yield {
        type: "text_update",
        content: textChunk,
        accumulated: accumulatedText,
      };
    }

    // Wait for completion to ensure all output is flushed
    await result.completed;

    // Get final result after streaming is complete
    const finalOutput = result.finalOutput;
    if (finalOutput) {
      try {
        const jsonParsed = JSON.parse(finalOutput);
        const parsedResult = blockGenerationOutput.parse(jsonParsed);

        const blockWithContent = covertAIGeneratedContentToBlockWithContent(
          parsedResult,
          pageId,
          lastBlockDisplayOrder,
        );

        yield {
          type: "final_result",
          content: blockWithContent,
        };
      } catch (parseError) {
        console.error("Failed to parse final AI output:", {
          error: parseError,
          rawOutput: finalOutput,
        });
        yield {
          type: "error",
          content: `Failed to parse generated content: ${parseError instanceof Error ? parseError.message : "Unknown parsing error"}`,
        };
      }
    } else {
      // No final output received - this shouldn't happen normally
      yield {
        type: "error",
        content: "No final output received from AI agent",
      };
    }
  } catch (error) {
    yield {
      type: "error",
      content: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
