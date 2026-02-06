import type { NodeExecutor } from "./registry/executor-registry";

//function to execute an http node
export const manualTriggerHandler = async (data: NodeExecutor) => {
  return new Promise((resolve) => {
    resolve(data.context);
  });
};
