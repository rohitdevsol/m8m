"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ReactNode, useMemo } from "react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

type Props = {
  status?: NodeStatus;
  error?: string | null;
  output?: unknown;
  children: ReactNode;
};

function formatOutputPreview(output: unknown): string {
  if (output === null || output === undefined) {
    return "No output";
  }

  if (typeof output === "string") {
    return output.length > 800 ? output.slice(0, 800) + "..." : output;
  }

  try {
    const json = JSON.stringify(output, null, 2);
    return json.length > 1200 ? json.slice(0, 1200) + "..." : json;
  } catch {
    return String(output);
  }
}

export function ExecutionNodeWrapper({
  status,
  error,
  output,
  children,
}: Props) {
  const preview = useMemo(() => {
    if (status === "success") {
      return formatOutputPreview(output);
    }
    return null;
  }, [status, output]);

  if (status === "error" && error) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{children}</div>
        </TooltipTrigger>

        <TooltipContent side="right" className="max-w-sm text-sm space-y-2">
          <p className="font-semibold text-red-500">Node Failed</p>

          <div className="max-h-52 overflow-auto rounded-md p-2 text-xs font-mono whitespace-pre-wrap break-words">
            {error}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (status === "success" && preview) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">{children}</div>
        </TooltipTrigger>

        <TooltipContent side="right" className="max-w-sm text-sm space-y-2">
          <p className="font-semibold text-green-600">Node Output</p>

          <div className="max-h-52 overflow-auto rounded-md p-2 text-xs font-mono whitespace-pre-wrap break-words">
            {preview}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <>{children}</>;
}
