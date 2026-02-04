import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      userId: string;
      workflowId: string;
    };
  },
) {
  //   const params = request.nextUrl.searchParams;
  const { userId, workflowId } = params;

  //validate user Id

  //validate workflowId that belongs to the userId

  // put the fetched workflow in workflow Run

  // now we just let the kafka to handle all
}
