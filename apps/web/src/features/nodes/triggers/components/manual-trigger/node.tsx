"use client";

import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "@/features/nodes/basenodes/base-trigger-node";
import { ManualTriggerDialog } from "./dialog";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

type Props = NodeProps & {
  status?: NodeStatus;
};

export const ManualTriggerNode = memo((props: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = (props.data.status as NodeStatus) || "initial";

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute Workflow'"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
