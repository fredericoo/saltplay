/*
  Warnings:

  - You are about to drop the column `badgeid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_allbadges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Badge" DROP CONSTRAINT "Badge_gameid_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_badgeid_fkey";

-- DropForeignKey
ALTER TABLE "_allbadges" DROP CONSTRAINT "_allbadges_A_fkey";

-- DropForeignKey
ALTER TABLE "_allbadges" DROP CONSTRAINT "_allbadges_B_fkey";

-- DropIndex
DROP INDEX "User_badgeid_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "badgeid";

-- DropTable
DROP TABLE "Badge";

-- DropTable
DROP TABLE "_allbadges";

-- CreateTable
CREATE TABLE "Medal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "gameid" TEXT NOT NULL,

    CONSTRAINT "Medal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MedalToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MedalToUser_AB_unique" ON "_MedalToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MedalToUser_B_index" ON "_MedalToUser"("B");

-- AddForeignKey
ALTER TABLE "Medal" ADD CONSTRAINT "Medal_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedalToUser" ADD FOREIGN KEY ("A") REFERENCES "Medal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedalToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
