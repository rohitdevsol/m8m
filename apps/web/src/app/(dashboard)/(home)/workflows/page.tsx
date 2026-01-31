import { prefetchWorkflows } from "@/features/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import React, { Suspense } from "react";
import {
  WorkflowsContainer,
  WorkflowsList,
} from "@/features/workflows/components/workflows";

const Page = async () => {
  await requireAuth();

  //prefetch workflows here
  prefetchWorkflows(); // on server side

  return (
    <>
      <WorkflowsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<p>Error Occured</p>}>
            <Suspense fallback={<p>Loading....</p>}>
              <WorkflowsList />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </WorkflowsContainer>
    </>
  );
};

export default Page;
