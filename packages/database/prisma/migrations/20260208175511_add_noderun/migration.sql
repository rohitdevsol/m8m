-- CreateEnum
CREATE TYPE "NodeRunStatus" AS ENUM ('INTIAL', 'ERROR', 'SUCCESS', 'LOADING', 'SKIPPED');

-- CreateTable
CREATE TABLE "NodeRun" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "nodeName" TEXT NOT NULL,
    "status" "NodeRunStatus" NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NodeRun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NodeRun" ADD CONSTRAINT "NodeRun_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "Execution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
