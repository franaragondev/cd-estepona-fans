/*
  Warnings:

  - You are about to drop the column `location` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "location" TEXT;
