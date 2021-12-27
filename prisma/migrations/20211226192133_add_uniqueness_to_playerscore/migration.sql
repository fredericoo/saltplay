/*
  Warnings:

  - A unique constraint covering the columns `[gameid,playerid]` on the table `PlayerScore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlayerScore_gameid_playerid_key" ON "PlayerScore"("gameid", "playerid");
