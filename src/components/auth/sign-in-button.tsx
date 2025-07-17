"use client";
import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";

export default function SignInButton() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        authClient.signIn.social({
          provider: "google",
        })
      }
    >
      Login With Google
    </Button>
  );
}
