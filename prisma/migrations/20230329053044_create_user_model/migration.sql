/*
  Warnings:

  - You are about to drop the column `created_at` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `government_users` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `government_users` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `government_users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `government_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `government_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "candidates_email_key";

-- DropIndex
DROP INDEX "companies_email_key";

-- DropIndex
DROP INDEX "government_users_email_key";

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "password_hash",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "email",
DROP COLUMN "password_hash",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "government_users" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "password_hash",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_user_id_key" ON "candidates"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_user_id_key" ON "companies"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "government_users_user_id_key" ON "government_users"("user_id");

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "government_users" ADD CONSTRAINT "government_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
