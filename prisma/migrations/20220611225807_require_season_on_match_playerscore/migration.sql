/*
  Warnings:

  - Made the column `seasonid` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seasonid` on table `PlayerScore` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_seasonid_fkey";

-- DropForeignKey
ALTER TABLE "PlayerScore" DROP CONSTRAINT "PlayerScore_seasonid_fkey";

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "seasonid" SET NOT NULL;

-- AlterTable
ALTER TABLE "PlayerScore" ALTER COLUMN "seasonid" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_seasonid_fkey" FOREIGN KEY ("seasonid") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerScore" ADD CONSTRAINT "PlayerScore_seasonid_fkey" FOREIGN KEY ("seasonid") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
