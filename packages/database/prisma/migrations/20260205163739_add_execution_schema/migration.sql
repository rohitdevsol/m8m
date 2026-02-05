/*
  Warnings:

  - You are about to drop the `WorkflowRun` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED');

-- DropForeignKey
ALTER TABLE "WorkflowRun" DROP CONSTRAINT "WorkflowRun_workflowId_fkey";

-- DropTable
DROP TABLE "WorkflowRun";

-- CreateTable
CREATE TABLE "Execution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "errorStack" TEXT,
    "output" JSONB,
    "step" INTEGER NOT NULL DEFAULT 1,
    "lockedBy" TEXT,
    "lockedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Execution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
