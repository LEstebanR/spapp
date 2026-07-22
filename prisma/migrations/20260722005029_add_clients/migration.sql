-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "clientId" TEXT;

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "spaId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Client_spaId_idx" ON "Client"("spaId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_spaId_phone_key" ON "Client"("spaId", "phone");

-- CreateIndex
CREATE INDEX "Booking_clientId_idx" ON "Booking"("clientId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "Spa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: one Client per (spaId, clientPhone) derived from existing
-- bookings, using the most recently entered clientName as canonical.
INSERT INTO "Client" ("id", "spaId", "phone", "name", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  b."spaId",
  b."clientPhone",
  (
    SELECT b2."clientName"
    FROM "Booking" b2
    WHERE b2."spaId" = b."spaId" AND b2."clientPhone" = b."clientPhone"
    ORDER BY b2."createdAt" DESC
    LIMIT 1
  ),
  MIN(b."createdAt"),
  CURRENT_TIMESTAMP
FROM "Booking" b
GROUP BY b."spaId", b."clientPhone";

-- Link existing bookings to the client just created for their (spaId, phone).
UPDATE "Booking" b
SET "clientId" = c."id"
FROM "Client" c
WHERE c."spaId" = b."spaId" AND c."phone" = b."clientPhone";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
