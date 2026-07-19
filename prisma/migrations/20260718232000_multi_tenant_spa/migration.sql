-- CreateTable
CREATE TABLE "Spa" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "salonName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "hours" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalType" (
    "id" TEXT NOT NULL,
    "spaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfessionalType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "spaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "professionalTypeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Spa_ownerId_key" ON "Spa"("ownerId");
CREATE UNIQUE INDEX "Spa_slug_key" ON "Spa"("slug");
CREATE UNIQUE INDEX "ProfessionalType_spaId_name_key" ON "ProfessionalType"("spaId", "name");
CREATE INDEX "Service_spaId_idx" ON "Service"("spaId");

-- AddForeignKey
ALTER TABLE "Spa" ADD CONSTRAINT "Spa_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfessionalType" ADD CONSTRAINT "ProfessionalType_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "Spa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Service" ADD CONSTRAINT "Service_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "Spa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Service" ADD CONSTRAINT "Service_professionalTypeId_fkey" FOREIGN KEY ("professionalTypeId") REFERENCES "ProfessionalType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: create one Spa per existing User, seeded from the old Settings
-- singleton row (if any) so pre-existing test data survives the multi-tenant
-- split instead of being silently dropped.
INSERT INTO "Spa" ("id", "ownerId", "slug", "salonName", "logoUrl", "address", "latitude", "longitude", "hours", "updatedAt")
SELECT
  'spa_' || u."id",
  u."id",
  lower(regexp_replace(regexp_replace(coalesce(s."salonName", 'mi-spa'), '[^a-zA-Z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g')) || '-' || substr(u."id", 1, 6),
  coalesce(s."salonName", 'Mi spa'),
  s."logoUrl",
  s."address",
  s."latitude",
  s."longitude",
  s."hours",
  now()
FROM "User" u
LEFT JOIN "Settings" s ON true
CROSS JOIN LATERAL (SELECT 1) AS only_once
WHERE NOT EXISTS (SELECT 1 FROM "Spa" WHERE "ownerId" = u."id");

-- Preserve each distinct Professional.role as a ProfessionalType per spa.
INSERT INTO "ProfessionalType" ("id", "spaId", "name")
SELECT DISTINCT 'ptype_' || spa."id" || '_' || md5(p."role"), spa."id", p."role"
FROM "Professional" p
JOIN "Spa" spa ON true
WHERE p."role" IS NOT NULL;

-- AlterTable: Booking gets spaId (nullable first, backfilled, then required)
ALTER TABLE "Booking" ADD COLUMN "spaId" TEXT;
UPDATE "Booking" b SET "spaId" = (SELECT "id" FROM "Spa" LIMIT 1) WHERE "spaId" IS NULL;
ALTER TABLE "Booking" ALTER COLUMN "spaId" SET NOT NULL;

-- AlterTable: Professional gets spaId + professionalTypeId, then role is dropped
ALTER TABLE "Professional" ADD COLUMN "spaId" TEXT;
ALTER TABLE "Professional" ADD COLUMN "professionalTypeId" TEXT;
UPDATE "Professional" p SET "spaId" = (SELECT "id" FROM "Spa" LIMIT 1) WHERE p."spaId" IS NULL;
UPDATE "Professional" p SET "professionalTypeId" = (
  SELECT pt."id" FROM "ProfessionalType" pt WHERE pt."spaId" = p."spaId" AND pt."name" = p."role" LIMIT 1
) WHERE p."role" IS NOT NULL;
ALTER TABLE "Professional" ALTER COLUMN "spaId" SET NOT NULL;
ALTER TABLE "Professional" DROP COLUMN "role";

-- DropTable
DROP TABLE "Settings";

-- CreateIndex
CREATE INDEX "Booking_spaId_idx" ON "Booking"("spaId");
CREATE INDEX "Professional_spaId_idx" ON "Professional"("spaId");

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "Spa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_professionalTypeId_fkey" FOREIGN KEY ("professionalTypeId") REFERENCES "ProfessionalType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_spaId_fkey" FOREIGN KEY ("spaId") REFERENCES "Spa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
