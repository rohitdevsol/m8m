import {
  ExecutionsContainer,
  ExecutionsLoading,
  ExecutionsError,
  ExecutionsList,
} from "@/features/executions/components/executions";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs/server";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
type Props = {
  searchParams: Promise<SearchParams>;
};
const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await executionsParamsLoader(searchParams); // do not use this as validator
  //prefetch workflows here
  prefetchExecutions(params); // on server side
  return (
    <>
      <ExecutionsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<ExecutionsError />}>
            <Suspense fallback={<ExecutionsLoading />}>
              <ExecutionsList />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </ExecutionsContainer>
    </>
  );
};

export default Page;
