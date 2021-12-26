/*
  Warnings:

  - You are about to drop the column `position` on the `LadderPosition` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameid]` on the table `Ladder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `points` to the `LadderPosition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ladder" ALTER COLUMN "gameid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "LadderPosition" DROP COLUMN "position",
ADD COLUMN     "points" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ladder_gameid_key" ON "Ladder"("gameid");

-- AddForeignKey
ALTER TABLE "Ladder" ADD CONSTRAINT "Ladder_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
