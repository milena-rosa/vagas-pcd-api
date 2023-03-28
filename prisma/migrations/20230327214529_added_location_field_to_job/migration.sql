-- CreateEnum
CREATE TYPE "Location" AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "location" "Location" NOT NULL DEFAULT 'ON_SITE';
