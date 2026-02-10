"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-execution-params";
import {
  CheckCircle2Icon,
  ClockIcon,
  FileExclamationPointIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Execution } from "@repo/database";
import { ExecutionStatus } from "@/config/node-types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export const ExecutionsHeader = () => {
  return (
    <>
      <EntityHeader
        title="Executions"
        description="View your workflow executions history"
      />
    </>
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();
  return (
    <EntityPagination
      disabled={executions.isFetching}
      page={executions.data.page}
      totalPages={executions.data?.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading executions" />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Loading executions" />;
};

export const ExecutionsEmpty = () => {
  return (
    <>
      <EmptyView
        message="There are no executions available yet.
        Get started by executing a workflow"
      />
    </>
  );
};

export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
        new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime(),
      ) / 1000
    : null;

  const subtitle = (
    <div className="flex relative items-center  w-full min-w-5xl">
      <div>
        {data.workflow.name} &bull; Started{" "}
        {formatDistanceToNow(data.startedAt, { addSuffix: true })}{" "}
        {duration !== null && <>&bull; Took {duration} seconds</>}
      </div>
      <Link
        prefetch
        href={`/executions/${data.id}/logs`}
        className="absolute right-0 bottom-0.75 ml-auto text-sm font-semibold hover:underline hover:text-primary"
      >
        Inspect Logs
      </Link>
    </div>
  );

  const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
      case ExecutionStatus.SUCCESS:
        return <CheckCircle2Icon className="size-5 text-green-600" />;
      case ExecutionStatus.FAILED:
        return <XCircleIcon className="size-5 text-red-600" />;
      case ExecutionStatus.PENDING:
        return <FileExclamationPointIcon className="size-5 text-yellow-600" />;
      case ExecutionStatus.RUNNING:
        return <Loader2Icon className="size-5 animate-spin text-blue-600" />;
      default:
        return <ClockIcon className="size-5 text-muted-foreground" />;
    }
  };
  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={
        data.status?.charAt(0)?.toUpperCase() +
        data?.status?.slice(1)?.toLowerCase()
      }
      subtitle={subtitle}
      image={
        <>
          <div className="size-8 flex items-center justify-center">
            {getStatusIcon(data.status)}
          </div>
        </>
      }
    />
  );
};
