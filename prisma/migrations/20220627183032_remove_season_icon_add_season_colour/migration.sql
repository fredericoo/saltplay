/*
  Warnings:

  - You are about to drop the column `icon` on the `Season` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Season" DROP COLUMN "icon",
ADD COLUMN     "colour" TEXT;
