/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Office` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PlayerScore` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_officeid_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "officeid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Match_id_seq";

-- AlterTable
ALTER TABLE "Office" DROP CONSTRAINT "Office_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Office_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Office_id_seq";

-- AlterTable
ALTER TABLE "PlayerScore" DROP CONSTRAINT "PlayerScore_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PlayerScore_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PlayerScore_id_seq";

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_officeid_fkey" FOREIGN KEY ("officeid") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
