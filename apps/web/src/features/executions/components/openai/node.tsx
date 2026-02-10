"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { AVAILABLE_OPENAI_MODELS, openaiSchema } from "@repo/types";
import { BaseExecutionNode } from "../base-execution-node";
import { OpenAIDialog, OpenAIFormRequestValues } from "./dialog";
import z from "zod";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

type OpenAINodeData = z.infer<typeof openaiSchema> & {
  status?: NodeStatus;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
  const nodeData = props.data;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes, setEdges } = useReactFlow();

  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_OPENAI_MODELS[0]}: \n${nodeData.userPrompt.slice(0, 50) + "..."}`
    : "Not configured";

  const name = nodeData.name;
  const nodeStatus = nodeData.status || "initial";

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: OpenAIFormRequestValues) => {
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
      <OpenAIDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        status={nodeStatus}
        name={
          name
            ? "OpenAI" + (nodeData.name ? ` - ${nodeData.name}` : "")
            : "OpenAI"
        }
        description={description}
        icon={"/openai.svg"}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

OpenAINode.displayName = "OpenAINode";
