import {
  EditorError,
  EditorLoading,
} from "@/features/editor/components/editor";
import { ExecutionLogs } from "@/features/executions/components/execution";
import { ExecutionHeader } from "@/features/executions/components/execution-header";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  params: Promise<{
    executionId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { executionId } = await params;
  prefetchExecution(executionId);
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <ExecutionHeader executionId={executionId} />
          <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
              <ExecutionLogs executionId={executionId} />
            </div>
          </div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
