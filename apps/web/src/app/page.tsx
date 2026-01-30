import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { prisma } from "@repo/database";

export default async function IndexPage() {
  await requireAuth();
  const users = await caller.findUsers();

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
