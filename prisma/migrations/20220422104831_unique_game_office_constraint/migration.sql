/*
  Warnings:

  - A unique constraint covering the columns `[slug,officeid]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_officeid_key" ON "Game"("slug", "officeid");
