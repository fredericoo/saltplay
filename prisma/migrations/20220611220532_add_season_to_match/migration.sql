-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "seasonid" TEXT DEFAULT null;

UPDATE "Match"
SET "seasonid" = (SELECT "id" FROM "Season" WHERE "Season"."gameid" = "Match"."gameid");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_seasonid_fkey" FOREIGN KEY ("seasonid") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;
