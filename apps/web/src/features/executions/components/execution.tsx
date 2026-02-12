"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useMemo, useState } from "react";
import { ReactFlow, Background, Panel } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { nodeComponents } from "@/config/node-components";
import {
  useLiveExecution,
  useSuspenseExecution,
} from "../hooks/use-executions";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { ExecutionStatus, NodeType } from "@/config/node-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle2Icon,
  ClockIcon,
  FileExclamationPointIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const ExecutionLoading = () => {
  return <LoadingView message="Loading execution..." />;
};

export const ExecutionError = () => {
  return <ErrorView message="Error loading execution" />;
};

function asObject(value: unknown): Record<string, any> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, any>;
  }

  return {};
}

function parsePosition(pos: any) {
  if (
    pos &&
    typeof pos === "object" &&
    typeof pos.x === "number" &&
    typeof pos.y === "number"
  ) {
    return pos;
  }

  return { x: 0, y: 0 };
}
export const ExecutionPreview = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useLiveExecution(executionId);

  const nodes = useMemo(() => {
    return (execution.workflowSnapshotNodes as any[]).map((dbNode) => {
      const run = execution.nodeRuns.find((r) => r.nodeId === dbNode.id);

      const safeData = asObject(dbNode.data);

      return {
        id: dbNode.id,
        type: NodeType[dbNode.type as NodeType],
        position: parsePosition(dbNode.position),

        data: {
          ...safeData,
          status: (run?.status ?? "PENDING").toLowerCase() as NodeStatus,
          runError: run?.error || null,
        },
      };
    });
  }, [execution]);

  const edges = (execution.workflowSnapshotConnections as any[]).map((c) => ({
    id: c.id,

    source: c.fromNodeId,
    target: c.toNodeId,

    sourceHandle: c.fromOutput,
    targetHandle: c.toInput,
  }));

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeComponents}
        fitView
        proOptions={{ hideAttribution: true }}
        snapGrid={[10, 10]}
        snapToGrid
      >
        <Background />

        <Panel position="top-right">
          <Link
            prefetch
            className="text-white dark:text-black text-sm hover:underline border py-2 px-3 bg-primary  rounded-md"
            href={`/executions/${executionId}/logs`}
          >
            View Logs
          </Link>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const ExecutionLogs = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useSuspenseExecution(executionId);
  const [showStackTrace, setShowStackTrace] = useState(false);

  const duration = execution.completedAt
    ? Math.round(
        new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime(),
      ) / 1000
    : null;

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
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getStatusIcon(execution.status)}
          <div>
            <CardTitle>
              {execution.status?.charAt(0)?.toUpperCase() +
                execution?.status?.slice(1)?.toLowerCase()}
            </CardTitle>
            <CardDescription>
              Execution for {execution.workflow.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Workflow
            </p>
            <Link
              prefetch
              className="text-sm hover:underline text-primary"
              href={`/workflows/${execution.workflowId}`}
            >
              {execution.workflow.name}
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">
              {execution.status?.charAt(0)?.toUpperCase() +
                execution?.status?.slice(1)?.toLowerCase()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Started</p>
            <p className="text-sm">
              {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
            </p>
          </div>

          {execution.completedAt ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-sm">
                {formatDistanceToNow(execution.completedAt, {
                  addSuffix: true,
                })}
              </p>
            </div>
          ) : null}

          {duration !== null ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="text-sm">{duration}s</p>
            </div>
          ) : null}

          {execution.id ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Execution ID
              </p>
              <p className="text-sm">{execution.id}</p>
            </div>
          ) : null}
        </div>
        {execution.error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
            <div>
              <p className="text-sm font-medium text-red-900 mb-2">Error</p>
              <p className="text-sm text-red-800 font-mono overflow-auto pb-3">
                {execution.error}
              </p>
            </div>

            {execution.errorStack && (
              <Collapsible
                open={showStackTrace}
                onOpenChange={setShowStackTrace}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="text-red-900 hover:bg-red-100"
                  >
                    {showStackTrace ? "Hide stack trace" : "Show stack trace"}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <pre className="text-sm font-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100 rounded">
                    {execution.errorStack}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        {execution.output && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Output</p>
            <pre className="text-xs font-mono overflow-auto">
              {JSON.stringify(execution.output, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
