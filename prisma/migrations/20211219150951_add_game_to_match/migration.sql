/*
  Warnings:

  - Added the required column `createdAt` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameid` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gameid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
