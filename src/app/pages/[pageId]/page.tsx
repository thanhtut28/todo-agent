import PageTemplate from "~/components/templates/page-template";
import { db } from "~/server/db";
import { getCachedBlocks } from "~/server/db/queries";
import { pages as pageSchema, type BlockWithContent } from "~/server/db/schema";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;
  const blocks = await getCachedBlocks(pageId);

  return <PageTemplate pageId={pageId} blocks={blocks as BlockWithContent[]} />;
}
