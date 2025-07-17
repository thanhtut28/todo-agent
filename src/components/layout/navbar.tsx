import SignInButton from "../auth/sign-in-button";
import UserAvatar from "../auth/user-avatar";
import type { User } from "better-auth";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!session;

  return (
    <header className="sticky top-0 z-50 bg-cyan-900/95 px-2 py-4 backdrop-blur supports-[backdrop-filter]:bg-cyan-900/60">
      <nav className="container mx-auto flex items-center justify-between">
        <h1>Todo Agent</h1>
        {isAuthenticated ? (
          <UserAvatar user={session.user as User} />
        ) : (
          <SignInButton />
        )}
      </nav>
    </header>
  );
}
