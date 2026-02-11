import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { toast } from "sonner";

export const SocialButtons = ({ isPending }: { isPending: boolean }) => {
  const handleGithub = async () => {
    await authClient.signIn.social(
      { provider: "github" },
      {
        onSuccess: () => {},
        onError: (error: any) => {
          console.log(error);
          toast.error("Something went wrong", error);
        },
      },
    );
  };

  const handleGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onSuccess: () => {},

        onError: (error: any) => {
          console.log(error);
          toast.error("Something went wrong ", error);
        },
      },
    );
  };
  return (
    <>
      <Button
        variant="outline"
        className="w-full flex justify-center items-center"
        type="button"
        disabled={isPending}
        onClick={handleGithub}
      >
        <Image src={"./github.svg"} alt="GitHub" height={20} width={20} />
        Continue with GitHub
      </Button>
      <Button
        variant="outline"
        className="w-full flex justify-center items-center"
        type="button"
        onClick={handleGoogle}
        disabled={isPending}
      >
        <Image src={"./google.svg"} alt="GitHub" height={20} width={20} />
        Continue with Google
      </Button>
    </>
  );
};
