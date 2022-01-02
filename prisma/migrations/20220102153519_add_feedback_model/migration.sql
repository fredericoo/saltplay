-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "playerid" TEXT,
    "text" TEXT,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
