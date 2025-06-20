import PageTemplate from "~/components/templates/page-template";

export default async function Page({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;

  return <PageTemplate pageId={pageId} />;
}
