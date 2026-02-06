import { NodeType, type Credential } from "@repo/database";
import { httpHandler } from "../http";
import { manualTriggerHandler } from "../manual";

export interface NodeExecutor {
  context: Record<string, unknown>;
  nodeId: string;
  inputs: Record<string, unknown>;
  credentials: Credential[];
}

export const executorRegistry: Record<
  NodeType,
  (data: NodeExecutor) => Promise<unknown>
> = {
  [NodeType.HTTP_REQUEST]: httpHandler,
  [NodeType.MANUAL_TRIGGER]: manualTriggerHandler,
  [NodeType.INITIAL]: manualTriggerHandler,
};

export const getExecutor = (type: NodeType) => {
  const executor = executorRegistry[type];

  if (!executor) {
    console.error(`No executor found for type ${type}`);
    return null;
  }

  return executor as (data: NodeExecutor) => Promise<unknown>;
};
