"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";

import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

type Props = NodeProps & {
  status?: NodeStatus;
};
export const StripeTriggerNode = memo((props: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = (props.data.status as NodeStatus) || "initial";

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={"/stripe.svg"}
        name="Stripe"
        description="When stripe event is captured"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";
