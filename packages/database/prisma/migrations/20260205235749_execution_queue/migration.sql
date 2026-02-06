-- CreateTable
CREATE TABLE "ExecutionQueue" (
    "executionId" TEXT NOT NULL,

    CONSTRAINT "ExecutionQueue_pkey" PRIMARY KEY ("executionId")
);

-- AddForeignKey
ALTER TABLE "ExecutionQueue" ADD CONSTRAINT "ExecutionQueue_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "Execution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
