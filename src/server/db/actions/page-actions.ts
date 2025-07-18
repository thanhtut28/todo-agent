"use server";

import { db } from "..";
import { getPlaceholderBlock, placeholderPage } from "./dummy-data";
import { pages as pageSchema } from "../schema";
import { saveDraftIntoDb } from "./block-actions";

export async function createGettingStartedPage(userId: string) {
  try {
    const [page] = await db
      .insert(pageSchema)
      .values({
        ...placeholderPage,
        userId,
      })
      .returning();

    if (!page) throw new Error("Failed to create page");
    const placeholderBlock = getPlaceholderBlock(page.id);
    await saveDraftIntoDb(placeholderBlock);

    return page;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create page");
  }
}
