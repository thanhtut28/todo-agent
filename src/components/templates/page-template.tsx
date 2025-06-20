import { getCachedBlocks } from "~/server/db/queries";
import Block from "../item/block";
import type { BlockWithContent } from "~/server/db/schema";

interface Props {
  pageId: string;
}

export default async function PageTemplate({ pageId }: Props) {
  const blocks = await getCachedBlocks(pageId);

  return (
    <>
      {blocks.map((block) => (
        <Block key={block.id} block={block as BlockWithContent} />
      ))}
    </>
  );
}
