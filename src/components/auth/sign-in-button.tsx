"use client";
import { Button } from "../ui/button";
import { signIn } from "~/lib/auth-client";

export default function SignInButton() {
  const handleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/api/sign-in",
    });
  };

  return (
    <Button variant="outline" onClick={handleSignIn}>
      Login With Google
    </Button>
  );
}
