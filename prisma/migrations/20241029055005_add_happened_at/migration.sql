/*
  Warnings:

  - Added the required column `happenedAt` to the `TimelineEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimelineEntry" ADD COLUMN     "happenedAt" TIMESTAMP(3) NOT NULL;
