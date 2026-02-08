import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { useExecutionsParams } from "./use-execution-params";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export const useCreateExecutionThroughManualTrigger = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.executions.createExecution.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow is queued`);

        queryClient.invalidateQueries(trpc.executions.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.executions.getOne.queryOptions({ id: data.id }),
        );

        router.push("/executions/" + data.id);
      },
      onError: (error) => {
        toast.error(`Failed to process workflow: ${error.message}`);
      },
    }),
  );
};

export const useLiveExecution = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.executions.getOne.queryOptions(
      { id },
      {
        refetchInterval: (query) => {
          const execution = query.state.data;
          if (!execution) return 1500;
          if (execution.status === "SUCCESS" || execution.status === "FAILED") {
            return false;
          }
          return 1500;
        },

        refetchOnWindowFocus: false,
      },
    ),
  );
};
