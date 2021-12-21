/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "LadderPosition" DROP CONSTRAINT "LadderPosition_playerid_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_p1id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_p2id_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Profile_id_seq";

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_p1id_fkey" FOREIGN KEY ("p1id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_p2id_fkey" FOREIGN KEY ("p2id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LadderPosition" ADD CONSTRAINT "LadderPosition_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
