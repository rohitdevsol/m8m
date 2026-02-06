/*
  Warnings:

  - You are about to drop the column `lockedAt` on the `Execution` table. All the data in the column will be lost.
  - You are about to drop the column `lockedBy` on the `Execution` table. All the data in the column will be lost.
  - You are about to drop the column `step` on the `Execution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Execution" DROP COLUMN "lockedAt",
DROP COLUMN "lockedBy",
DROP COLUMN "step";
