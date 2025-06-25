/*
  Warnings:

  - You are about to drop the column `opponent` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `opponentImage` on the `Match` table. All the data in the column will be lost.
  - Added the required column `teamId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "opponent",
DROP COLUMN "opponentImage",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "crestUrl" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
