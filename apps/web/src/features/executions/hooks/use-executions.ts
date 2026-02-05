import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useExecutionsParams } from "./use-execution-params";

/**
 * Hook to fetch all the executions using suspense
 * CLIENT COMPONENT SIDE
 */
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();

  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

/**
 * Get a single execution
 */

export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};
