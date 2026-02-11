"use client";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { slackSchema } from "@repo/types";
import { SlackDialog, SlackFormValues } from "./dialog";
import z from "zod";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { BaseExecutionNode } from "@/features/nodes/basenodes/base-execution-node";

type SlackNodeData = z.infer<typeof slackSchema> & {
  status?: NodeStatus;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
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

  const handleSubmit = (values: SlackFormValues) => {
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
      <SlackDialog
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
            ? "Slack" + (nodeData.name ? ` - ${nodeData.name}` : "")
            : "Slack"
        }
        description={description}
        icon={"/slack.svg"}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";
