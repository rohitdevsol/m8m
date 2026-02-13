"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { httpSchema } from "@repo/types";
import { BaseExecutionNode } from "@/features/nodes/basenodes/base-execution-node";
import { HttpRequestDialog, HttpRequestFormValues } from "./dialog";
import z from "zod";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { ExecutionNodeWrapper } from "@/components/react-flow/execution-node-wrapper";

type HttpNodeData = z.infer<typeof httpSchema> & {
  status?: NodeStatus;
  runError?: string | null;
  runOutput?: string | null;
};

type HttpRequestNodeType = Node<HttpNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = props.data;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: \n${nodeData.endpoint}`
    : "Not configured";

  const name = nodeData.name;
  const nodeStatus = nodeData.status || "initial";
  const error = nodeData.runError;

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: HttpRequestFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };
  return (
    <>
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <ExecutionNodeWrapper
        status={nodeStatus}
        error={error}
        output={nodeData.runOutput}
      >
        <BaseExecutionNode
          {...props}
          id={props.id}
          status={nodeStatus}
          name={
            name
              ? "HTTP Request" + (nodeData.name ? ` - ${nodeData.name}` : "")
              : "HTTP Request"
          }
          description={description}
          icon={GlobeIcon}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </ExecutionNodeWrapper>
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
