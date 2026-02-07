"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { httpSchema } from "@repo/types";
import { BaseExecutionNode } from "../base-execution-node";
import { HttpRequestDialog, HttpRequestFormValues } from "./dialog";
import z from "zod";

type HttpRequestNodeType = Node<z.infer<typeof httpSchema>>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = props.data;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes, setEdges } = useReactFlow();

  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: \n${nodeData.endpoint}`
    : "Not configured";

  const name = nodeData.name;
  const nodeStatus = "initial";

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
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
