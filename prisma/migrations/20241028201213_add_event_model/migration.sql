/*
  Warnings:

  - Added the required column `eventId` to the `TimelineEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimelineEntry" ADD COLUMN     "eventId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_code_key" ON "Event"("code");

-- AddForeignKey
ALTER TABLE "TimelineEntry" ADD CONSTRAINT "TimelineEntry_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
