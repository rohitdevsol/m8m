"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useMemo } from "react";
import { ReactFlow, Background } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { nodeComponents } from "@/config/node-components";
import { useLiveExecution } from "../hooks/use-executions";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { NodeType } from "@/config/node-types";

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
    return execution.workflow.nodes.map((dbNode) => {
      const run = execution.nodeRuns.find((r) => r.nodeId === dbNode.id);

      const safeData = asObject(dbNode.data);

      return {
        id: dbNode.id,
        type: NodeType[dbNode.type],
        position: parsePosition(dbNode.position),

        data: {
          ...safeData,
          name: dbNode.name,
          status: (run?.status ?? "PENDING").toLowerCase() as NodeStatus,
        },
      };
    });
  }, [execution]);

  const edges = execution.workflow.connections.map((c) => ({
    id: c.id,

    source: c.fromNodeId,
    target: c.toNodeId,

    sourceHandle: c.fromOutput,
    targetHandle: c.toInput,
  }));

  return (
    <div className="w-full h-screen">
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
      </ReactFlow>
    </div>
  );
};
