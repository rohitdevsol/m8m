interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

import React from "react";

const Page = async ({ params }: PageProps) => {
  const { credentialId } = await params;
  return (
    <div>
      <p>Credentials {credentialId}</p>
    </div>
  );
};

export default Page;
