/*
  Warnings:

  - You are about to drop the column `zipCode` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "zipCode",
ADD COLUMN     "zip_code" TEXT;
