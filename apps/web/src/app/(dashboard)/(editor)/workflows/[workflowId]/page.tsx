import React from "react";

interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { workflowId } = await params;
  return (
    <div>
      <p>Workflows: {workflowId}</p>
    </div>
  );
};

export default Page;
