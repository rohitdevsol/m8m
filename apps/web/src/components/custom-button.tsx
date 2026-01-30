"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export const CustomButton = () => {
  return (
    <Button
      className=""
      variant={"destructive"}
      onClick={async () => {
        await authClient.signOut();
      }}
    >
      Logout
    </Button>
  );
};
