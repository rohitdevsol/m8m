// execution-runner.ts

import { prisma } from "@repo/database";
import { runDag } from "./dag-runner";
import { toJsonSafe } from "./utils/json";
import { serializeError } from "./utils/error";

export async function runExecution(executionId: string) {
  const execution = await prisma.execution.findUnique({
    where: { id: executionId },
    include: {
      workflow: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  if (execution.status === "FAILED") return;

  const nodes = execution.workflowSnapshotNodes as any[];
  const edges = execution.workflowSnapshotConnections as any[];

  if (!nodes.length) throw new Error("No nodes");
  if (!edges.length) throw new Error("No edges");

  await prisma.execution.update({
    where: { id: executionId },
    data: {
      status: "RUNNING",
      startedAt: new Date(),
    },
  });

  try {
    const context = await runDag(
      execution.id,
      nodes,
      edges,
      execution.workflow.user,
      execution.triggerData,
    );

    await prisma.execution.update({
      where: { id: executionId },
      data: {
        status: "SUCCESS",
        completedAt: new Date(),
        output: toJsonSafe(context),
      },
    });

    return context;
  } catch (err) {
    console.error("[Execution Failed]", err);

    const serialized = serializeError(err);

    await prisma.execution.update({
      where: { id: executionId },
      data: {
        status: "FAILED",
        error: serialized.message,
        errorStack: serialized.stack
          ? serialized.stack
          : serialized.raw
            ? JSON.stringify(serialized.raw, null, 2)
            : null,
        completedAt: new Date(),
      },
    });

    throw err;
  }
}
