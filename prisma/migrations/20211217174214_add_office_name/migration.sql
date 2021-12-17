/*
  Warnings:

  - Added the required column `name` to the `Office` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "name" TEXT NOT NULL;
