import { CustomButton } from "@/components/custom-button";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

export default async function IndexPage() {
  await requireAuth();
  const users = await caller.findUsers();

  return (
    <div>
      <h1>Hello World</h1>
      <CustomButton />
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
