/*
  Warnings:

  - Changed the type of `salary` on the `jobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "salary",
ADD COLUMN     "salary" DOUBLE PRECISION NOT NULL;
