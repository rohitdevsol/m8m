"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";

import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

type Props = NodeProps & {
  status?: NodeStatus;
};
export const GoogleFormTriggerNode = memo((props: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = (props.data.status as NodeStatus) || "initial";

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={"/googleform.svg"}
        name="Google Form"
        description="When form is submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";
