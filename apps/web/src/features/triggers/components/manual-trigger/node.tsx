"use client";

import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo } from "react";

import { BaseTriggerNode } from "../base-trigger-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
  //   const nodeData = props.data as HttpRequestNodeData;
  //   const description = nodeData?.endpoint
  //     ? `${nodeData.method || "GET"}:${nodeData.endpoint}`
  //     : "Not configured";
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute Workflow'"
        //status
        // onSettings={handlOpenSettings}
        // onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
