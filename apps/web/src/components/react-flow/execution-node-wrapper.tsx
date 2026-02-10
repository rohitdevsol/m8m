"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ReactNode } from "react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

type Props = {
  status?: NodeStatus;
  error?: string | null;
  children: ReactNode;
};

export function ExecutionNodeWrapper({ status, error, children }: Props) {
  if (status !== "error" || !error) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{children}</div>
        </TooltipTrigger>

        <TooltipContent side="right" className="max-w-xs text-sm">
          <div className="space-y-1">
            <p className="font-medium text-red-500">Node Failed</p>

            <pre className="text-xs whitespace-pre-wrap wrap-break-word">
              {error}
            </pre>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
