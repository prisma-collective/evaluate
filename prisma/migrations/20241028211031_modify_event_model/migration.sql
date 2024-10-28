/*
  Warnings:

  - You are about to drop the column `eventId` on the `TimelineEntry` table. All the data in the column will be lost.
  - Added the required column `event_code` to the `TimelineEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TimelineEntry" DROP CONSTRAINT "TimelineEntry_eventId_fkey";

-- AlterTable
ALTER TABLE "TimelineEntry" DROP COLUMN "eventId",
ADD COLUMN     "event_code" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TimelineEntry" ADD CONSTRAINT "TimelineEntry_event_code_fkey" FOREIGN KEY ("event_code") REFERENCES "Event"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
