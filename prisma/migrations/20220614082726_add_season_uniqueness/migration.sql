/*
  Warnings:

  - A unique constraint covering the columns `[slug,gameid]` on the table `Season` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Season_slug_gameid_key" ON "Season"("slug", "gameid");
