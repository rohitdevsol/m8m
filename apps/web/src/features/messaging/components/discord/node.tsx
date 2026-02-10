"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { AVAILABLE_GEMINI_MODELS, discordSchema } from "@repo/types";
import { DiscordDialog, DiscordFormValues } from "./dialog";
import z from "zod";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";

type DiscordNodeData = z.infer<typeof discordSchema> & {
  status?: NodeStatus;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const nodeData = props.data;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50) + "..."}`
    : "Not configured";

  const name = nodeData.name;
  const nodeStatus = nodeData.status || "initial";

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: DiscordFormValues) => {
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
      <DiscordDialog
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
            ? "Discord" + (nodeData.name ? ` - ${nodeData.name}` : "")
            : "Discord"
        }
        description={description}
        icon={"/discord.svg"}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
