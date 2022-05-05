-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "notification_id" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roleId" DROP DEFAULT;

-- cache invalidation