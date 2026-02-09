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
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
    };

    const stripeObject = body?.data?.object ?? {};
    await prisma.$transaction(async (tx) => {
      const execution = await tx.execution.create({
        data: {
          workflowId,
          status: "PENDING",
          triggerData: {
            ...stripeObject,
            meta: formData,
            raw: body,
          },
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
    console.log("Stripe webhook error: ", error);
    return NextResponse.json({
      success: false,
      error: "Failed to process Stripe event",
      status: 500,
    });
  }
}
