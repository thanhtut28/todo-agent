import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { markUserAsOnboarded } from "~/server/db/actions/user-actions";
import { createGettingStartedPage } from "~/server/db/actions/page-actions";
import { user as userSchema } from "~/server/db/schema";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const user = await db.query.user.findFirst({
    where: eq(userSchema.id, userId),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.hasOnboarded) {
    const page = await createGettingStartedPage(user.id);
    await markUserAsOnboarded(user.id);
    redirect(`/pages/${page.id}`);
  }

  redirect("/");
}
