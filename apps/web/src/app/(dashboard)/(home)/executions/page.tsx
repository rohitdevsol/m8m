import { requireAuth } from "@/lib/auth-utils";
import React from "react";

const Page = async () => {
  await requireAuth();
  return <div>Executions</div>;
};

export default Page;
