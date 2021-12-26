/*
  Warnings:

  - You are about to drop the column `biograpy` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Ladder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LadderPosition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ladder" DROP CONSTRAINT "Ladder_gameid_fkey";

-- DropForeignKey
ALTER TABLE "LadderPosition" DROP CONSTRAINT "LadderPosition_ladderid_fkey";

-- DropForeignKey
ALTER TABLE "LadderPosition" DROP CONSTRAINT "LadderPosition_playerid_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "biograpy";

-- DropTable
DROP TABLE "Ladder";

-- DropTable
DROP TABLE "LadderPosition";

-- CreateTable
CREATE TABLE "PlayerScore" (
    "id" SERIAL NOT NULL,
    "playerid" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "gameid" TEXT NOT NULL,

    CONSTRAINT "PlayerScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerScore" ADD CONSTRAINT "PlayerScore_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerScore" ADD CONSTRAINT "PlayerScore_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
