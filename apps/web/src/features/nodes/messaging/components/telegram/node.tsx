"use client";

import { memo, useState } from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { telegramSchema } from "@repo/types";
import z from "zod";

import { TelegramDialog, TelegramFormValues } from "./dialog";

import { NodeStatus } from "@/components/react-flow/node-status-indicator";

import { BaseExecutionNode } from "@/features/nodes/basenodes/base-execution-node";

import { ExecutionNodeWrapper } from "@/components/react-flow/execution-node-wrapper";

type TelegramNodeData = z.infer<typeof telegramSchema> & {
  status?: NodeStatus;
  runError?: string | null;
};

type TelegramNodeType = Node<TelegramNodeData>;

export const TelegramNode = memo((props: NodeProps<TelegramNodeType>) => {
  const nodeData = props.data;

  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow();

  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  const name = nodeData.name;

  const status = nodeData.status || "initial";

  const error = nodeData.runError;

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: TelegramFormValues) => {
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
      <TelegramDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />

      <ExecutionNodeWrapper status={status} error={error}>
        <BaseExecutionNode
          {...props}
          id={props.id}
          status={status}
          name={name ? `Telegram - ${name}` : "Telegram"}
          description={description}
          icon={"/telegram.svg"}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
        />
      </ExecutionNodeWrapper>
    </>
  );
});

TelegramNode.displayName = "TelegramNode";
