"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { AVAILABLE_GEMINI_MODELS, geminiSchema, httpSchema } from "@repo/types";
import { BaseExecutionNode } from "../base-execution-node";
import { GeminiDialog, GeminiRequestFormValues } from "./dialog";
import z from "zod";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { ExecutionNodeWrapper } from "@/components/react-flow/execution-node-wrapper";

type GeminiNodeData = z.infer<typeof geminiSchema> & {
  status?: NodeStatus;
  runError?: string | null;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const nodeData = props.data;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes, setEdges } = useReactFlow();

  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_GEMINI_MODELS[0]}: \n${nodeData.userPrompt.slice(0, 50) + "..."}`
    : "Not configured";

  const name = nodeData.name;
  const nodeStatus = nodeData.status || "initial";
  const error = nodeData.runError;

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: GeminiRequestFormValues) => {
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
      <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <ExecutionNodeWrapper status={nodeStatus} error={error}>
        <BaseExecutionNode
          {...props}
          id={props.id}
          status={nodeStatus}
          name={
            name
              ? "Gemini" + (nodeData.name ? ` - ${nodeData.name}` : "")
              : "Gemini"
          }
          description={description}
          icon={"/gemini-color.svg"}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </ExecutionNodeWrapper>
    </>
  );
});

GeminiNode.displayName = "GeminiNode";
