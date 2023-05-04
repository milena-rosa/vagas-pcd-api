/*
  Warnings:

  - Added the required column `linkedin` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perks` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "about" TEXT;

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "linkedin" TEXT NOT NULL,
ADD COLUMN     "perks" TEXT NOT NULL;
