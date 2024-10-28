-- CreateTable
CREATE TABLE "TimelineEntry" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "text" TEXT,
    "preview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEntry_pkey" PRIMARY KEY ("id")
);
