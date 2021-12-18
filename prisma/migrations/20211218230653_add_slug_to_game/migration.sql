/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - The required column `slug` was added to the `Game` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `gameid` to the `Ladder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ladder" ADD COLUMN     "gameid" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

INSERT INTO "Game" (id, name, slug, officeid) VALUES (DEFAULT, 'Foosball', 'foosball', 1);
INSERT INTO "Game" (id, name, slug, officeid) VALUES (DEFAULT, 'Pingpong', 'pingpong', 1);
INSERT INTO "Game" (id, name, slug, officeid) VALUES (DEFAULT, 'Pool', 'pool', 1);