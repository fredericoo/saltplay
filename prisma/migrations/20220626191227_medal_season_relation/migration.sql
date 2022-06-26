/*
  Warnings:

  - You are about to drop the column `gameid` on the `Medal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Medal" DROP CONSTRAINT "Medal_gameid_fkey";

-- AlterTable
ALTER TABLE "Medal" DROP COLUMN "gameid",
ADD COLUMN     "seasonid" TEXT;

-- AddForeignKey
ALTER TABLE "Medal" ADD CONSTRAINT "Medal_seasonid_fkey" FOREIGN KEY ("seasonid") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;
