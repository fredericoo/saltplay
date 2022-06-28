-- AlterTable
ALTER TABLE "User" ADD COLUMN     "boastId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_boastId_fkey" FOREIGN KEY ("boastId") REFERENCES "Medal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
