/*
  Warnings:

  - You are about to drop the column `resume` on the `candidates` table. All the data in the column will be lost.
  - Added the required column `city` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `candidates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "resume",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "educationalBackground" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "professionalExperience" TEXT,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
