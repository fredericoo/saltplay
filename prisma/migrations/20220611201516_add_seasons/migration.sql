/*
  Warnings:

  - A unique constraint covering the columns `[gameid,playerid,seasonid]` on the table `PlayerScore` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PlayerScore_gameid_playerid_key";

-- AlterTable
ALTER TABLE "PlayerScore" ADD COLUMN     "seasonid" TEXT;

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "gameid" TEXT NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- Creates a Season called Season 0 for each game already created
INSERT INTO "Season" ("id", "name", "slug", "gameid") 
SELECT md5(random()::text || clock_timestamp()::text)::uuid, 'Season 0', 'season-0', "Game"."id" as "gameid"
FROM "Game";

-- CreateIndex
CREATE UNIQUE INDEX "PlayerScore_gameid_playerid_seasonid_key" ON "PlayerScore"("gameid", "playerid", "seasonid");

-- Adds seasonid to every playerScore
UPDATE "PlayerScore"
SET "seasonid" = (SELECT "id" FROM "Season" WHERE "Season"."gameid" = "PlayerScore"."gameid");

-- AddForeignKey
ALTER TABLE "PlayerScore" ADD CONSTRAINT "PlayerScore_seasonid_fkey" FOREIGN KEY ("seasonid") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
