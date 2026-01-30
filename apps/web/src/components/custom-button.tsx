"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const CustomButton = () => {
  const router = useRouter();
  return (
    <Button
      className=""
      variant={"destructive"}
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
              router.refresh();
            },
          },
        });
      }}
    >
      Logout
    </Button>
  );
};
