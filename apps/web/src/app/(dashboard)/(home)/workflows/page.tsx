import { requireAuth } from "@/lib/auth-utils";
import React from "react";

const Page = async () => {
  await requireAuth();
  return (
    <>
      <h1>Workflows</h1>
    </>
  );
};

export default Page;
