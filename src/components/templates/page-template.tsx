import { db } from "~/server/db";

export default async function PageTemplate() {
  const paragraphs = await db.query.paragraphs.findMany();

  return <div>This is a page template</div>;
}
