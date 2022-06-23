/*
  Warnings:

  - You are about to drop the column `endDate` on the `Season` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Season" DROP COLUMN "endDate",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
