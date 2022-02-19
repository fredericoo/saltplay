/*
  Warnings:

  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "User" ADD COLUMN "roleId" INTEGER NOT NULL
CONSTRAINT "User_roleId_default" DEFAULT (2);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);


INSERT INTO "Role" ("id", "name") VALUES (0, 'admin');
INSERT INTO "Role" ("id", "name") VALUES (1, 'user');
INSERT INTO "Role" ("id", "name") VALUES (2, 'guest');

-- change all rows in table User to have roleId = 2
UPDATE "User" SET "roleId" = 1;

-- AddForeignKey
ALTER TABLE "User" 
ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
