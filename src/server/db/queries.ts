import { unstable_cache } from "next/cache";
import { db } from ".";

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
        },
      });
      return result;
    },

    ["blocks"],
    {
      tags: ["blocks"],
      revalidate: 3600,
    },
  )();
