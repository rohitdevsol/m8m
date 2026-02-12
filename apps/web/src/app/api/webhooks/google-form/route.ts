import { snapshotWorkflow } from "@repo/common";
import { prisma } from "@repo/database";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workflowId = url.searchParams.get("workflowId");
    if (!workflowId) {
      return NextResponse.json({
        success: false,
        error: "Missing required query parameter: workflowId",
        status: 400,
      });
    }
    const body = await req.json();
    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };

    await prisma.$transaction(async (tx) => {
      const workflow = await tx.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });

      const snapshot = snapshotWorkflow(workflow.nodes, workflow.connections);

      const execution = await tx.execution.create({
        data: {
          workflowId,
          status: "PENDING",
          triggerData: formData,

          workflowSnapshotNodes: snapshot.nodes,
          workflowSnapshotConnections: snapshot.connections,
        },
      });

      await tx.executionQueue.create({
        data: {
          executionId: execution.id,
        },
      });
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Google form webhook error: ", error);
    return NextResponse.json({
      success: false,
      error: "Failed to process Google Form Submission",
      status: 500,
    });
  }
}
