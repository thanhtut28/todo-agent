import { unstable_cache } from "next/cache";
import { db } from ".";
import type { BlockWithContent } from "./schema";

export const getCachedBlocks = async (pageId: string) =>
  await unstable_cache(
    async () => {
      const result = await db.query.blocks.findMany({
        where: (blocks, { eq }) => eq(blocks.pageId, Number(pageId)),
        with: {
          checkboxes: true,
          headings: true,
          links: true,
          paragraphs: true,
          listItems: true,
          page: true,
        },
        orderBy: (blocks, { asc }) => asc(blocks.displayOrder),
      });

      return result;
    },

    ["blocks", pageId],
    {
      tags: ["blocks", pageId],
      revalidate: 1,
    },
  )();

//! Not used yet
export function sortBlocksByDisplayOrder(
  blocks: BlockWithContent[],
): BlockWithContent[] {
  const _blocks = blocks
    .map((block) => {
      return {
        ...block,
        paragraphs: block.paragraphs.sort(
          (a, b) => b.displayOrder - a.displayOrder,
        ),
        links: block.links.sort((a, b) => b.displayOrder - a.displayOrder),
        checkboxes: block.checkboxes.sort(
          (a, b) => b.displayOrder - a.displayOrder,
        ),
        headings: block.headings.sort(
          (a, b) => b.displayOrder - a.displayOrder,
        ),
        listItems: block.listItems.sort(
          (a, b) => b.displayOrder - a.displayOrder,
        ),
      };
    })
    .sort((a, b) => b.displayOrder - a.displayOrder);

  return _blocks;
}
