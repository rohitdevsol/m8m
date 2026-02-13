"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { AVAILABLE_GROK_MODELS, grokSchema } from "@repo/types";
import { BaseExecutionNode } from "@/features/nodes/basenodes/base-execution-node";
import { GrokDialog, GrokFormRequestValues } from "./dialog";
import z from "zod";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { ExecutionNodeWrapper } from "@/components/react-flow/execution-node-wrapper";

type grokNodeData = z.infer<typeof grokSchema> & {
  status?: NodeStatus;
  runError?: string | null;
  runOutput?: string | null;
};

type grokNodeType = Node<grokNodeData>;

export const grokNode = memo((props: NodeProps<grokNodeType>) => {
  const nodeData = props.data;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_GROK_MODELS[0]}: \n${nodeData.userPrompt.slice(0, 50) + "..."}`
    : "Not configured";

  const name = nodeData.name;
  const nodeStatus = nodeData.status || "initial";
  const error = nodeData.runError;

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: GrokFormRequestValues) => {
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
      <GrokDialog
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
              ? "Grok" + (nodeData.name ? ` - ${nodeData.name}` : "")
              : "Grok"
          }
          description={description}
          icon={"/grok.svg"}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </ExecutionNodeWrapper>
    </>
  );
});

grokNode.displayName = "grokNode";
