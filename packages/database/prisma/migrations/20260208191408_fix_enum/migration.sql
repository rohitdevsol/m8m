/*
  Warnings:

  - The values [INTIAL] on the enum `NodeRunStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NodeRunStatus_new" AS ENUM ('INITIAL', 'ERROR', 'SUCCESS', 'LOADING', 'SKIPPED');
ALTER TABLE "NodeRun" ALTER COLUMN "status" TYPE "NodeRunStatus_new" USING ("status"::text::"NodeRunStatus_new");
ALTER TYPE "NodeRunStatus" RENAME TO "NodeRunStatus_old";
ALTER TYPE "NodeRunStatus_new" RENAME TO "NodeRunStatus";
DROP TYPE "public"."NodeRunStatus_old";
COMMIT;
