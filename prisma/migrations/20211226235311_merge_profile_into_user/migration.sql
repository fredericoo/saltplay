/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_p1id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_p2id_fkey";

-- DropForeignKey
ALTER TABLE "PlayerScore" DROP CONSTRAINT "PlayerScore_playerid_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Profile";

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_p1id_fkey" FOREIGN KEY ("p1id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_p2id_fkey" FOREIGN KEY ("p2id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerScore" ADD CONSTRAINT "PlayerScore_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
