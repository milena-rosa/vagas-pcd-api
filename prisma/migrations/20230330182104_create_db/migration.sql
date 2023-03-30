-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COMPANY', 'CANDIDATE', 'GOVERNMENT');

-- CreateEnum
CREATE TYPE "DisabilityType" AS ENUM ('PHYSICAL', 'HEARING', 'VISUAL', 'MENTAL', 'MULTIPLE', 'ANY');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE');

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CANDIDATE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "candidate_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "resume" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "companies" (
    "company_id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "street" TEXT,
    "zipCode" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "city" TEXT,
    "state" TEXT
);

-- CreateTable
CREATE TABLE "government_users" (
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "location" "Location" NOT NULL DEFAULT 'ON_SITE',
    "salary" DOUBLE PRECISION NOT NULL,
    "disability_type" "DisabilityType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidate_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_candidate_id_key" ON "candidates"("candidate_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_id_key" ON "companies"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "companies"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "government_users_user_id_key" ON "government_users"("user_id");

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "government_users" ADD CONSTRAINT "government_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("candidate_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
