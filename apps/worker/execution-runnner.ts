import { prisma } from "@repo/database";
import { runDag } from "./dag-runner";

export async function runExecution(executionId: string) {
  const execution = await prisma.execution.findFirst({
    where: { id: executionId },
    include: {
      workflow: {
        include: {
          nodes: true,
          connections: true,
          user: {
            include: { credentials: true },
          },
        },
      },
    },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  if (execution.status === "FAILED") {
    return;
  }

  const nodes = execution.workflow.nodes;
  const edges = execution.workflow.connections;

  if (!nodes.length) throw new Error("No nodes");
  if (!edges.length) throw new Error("No edges");

  await prisma.execution.update({
    where: { id: executionId },
    data: {
      status: "RUNNING",
      startedAt: new Date(),
    },
  });

  await runDag(nodes, edges, execution.workflow.user.credentials);
}
