import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PageTemplate from "~/components/templates/page-template";
import { auth } from "~/lib/auth";
import { getCachedBlocks } from "~/server/db/queries";
import { type BlockWithContent } from "~/server/db/schema";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { pageId } = await params;
  const blocks = await getCachedBlocks(pageId);

  const userId = session?.user.id;
  const pageUserId = blocks?.[0]?.page.userId;
  const isAuthorized = userId && userId === pageUserId;

  if (!session || !isAuthorized) {
    redirect("/");
  }

  return <PageTemplate pageId={pageId} blocks={blocks as BlockWithContent[]} />;
}
