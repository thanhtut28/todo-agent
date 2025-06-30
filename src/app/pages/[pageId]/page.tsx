import PageTemplate from "~/components/templates/page-template";
import { getCachedBlocks } from "~/server/db/queries";
import type { BlockWithContent } from "~/server/db/schema";

export default async function Page({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;
  const blocks = await getCachedBlocks(pageId);

  return <PageTemplate pageId={pageId} blocks={blocks as BlockWithContent[]} />;
}
