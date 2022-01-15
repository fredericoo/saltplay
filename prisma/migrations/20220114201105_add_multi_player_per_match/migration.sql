/*
  Warnings:

  - You are about to drop the column `p1id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `p1score` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `p2id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `p2score` on the `Match` table. All the data in the column will be lost.
  - Added the required column `leftscore` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rightscore` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_p1id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_p2id_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "maxPlayersPerTeam" INTEGER DEFAULT 1;

-- AlterTable
ALTER TABLE "Match" 
RENAME COLUMN "p1score" TO "leftscore";

ALTER TABLE "Match" 
RENAME COLUMN "p2score" TO "rightscore";

-- CreateTable
CREATE TABLE "_left" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_right" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_left_AB_unique" ON "_left"("A", "B");

-- CreateIndex
CREATE INDEX "_left_B_index" ON "_left"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_right_AB_unique" ON "_right"("A", "B");

-- CreateIndex
CREATE INDEX "_right_B_index" ON "_right"("B");

-- AddForeignKey
ALTER TABLE "_left" ADD FOREIGN KEY ("A") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_left" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_right" ADD FOREIGN KEY ("A") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_right" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- FROM THE MATCH TABLE, COPY MATCHID AND PLAYERID TO TABLE _LEFT AS COLUMNS A AND B
INSERT INTO "_left"
SELECT "id" as "A", "p1id" AS "B" 
FROM "Match";

INSERT INTO "_right"
SELECT "id" as "A", "p2id" AS "B" 
FROM "Match";

ALTER TABLE "Match" DROP COLUMN "p1id";
ALTER TABLE "Match" DROP COLUMN "p2id";