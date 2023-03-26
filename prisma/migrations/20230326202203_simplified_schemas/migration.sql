/*
  Warnings:

  - You are about to drop the column `user_id` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "candidates" DROP CONSTRAINT "candidates_user_id_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_fkey";

-- DropIndex
DROP INDEX "candidates_user_id_key";

-- DropIndex
DROP INDEX "companies_user_id_key";

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "user_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "user_id",
ADD COLUMN     "password_hash" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateIndex
CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");
