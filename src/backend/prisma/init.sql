-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('POSTMORTEM', 'NEWS', 'INTERVIEW', 'FILING', 'IDEA');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'PARTIALLY_VERIFIED', 'CONFLICTING', 'UNVERIFIED');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "foundedYear" INTEGER,
    "failureYear" INTEGER,
    "industry" TEXT NOT NULL,
    "stage" TEXT,
    "totalFunding" DOUBLE PRECISION,
    "valuation" DOUBLE PRECISION,
    "website" TEXT,
    "founders" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "enriched" BOOLEAN NOT NULL DEFAULT false,
    "failureReasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keyLessons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "postmortemSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "contentType" "ContentType" NOT NULL DEFAULT 'POSTMORTEM',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT,
    "companyId" TEXT,
    "claimText" TEXT NOT NULL,
    "category" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sources" JSONB,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Embedding" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "embedding" vector(768),
    "metadata" JSONB,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FailurePattern" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "primaryFactors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "affectedIndustries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "representativeCompanyIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preventionStrategy" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'HIGH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FailurePattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentExecution" (
    "id" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "triggerType" TEXT NOT NULL,
    "inputPayload" JSONB NOT NULL,
    "outputPayload" JSONB,
    "status" TEXT NOT NULL,
    "durationMs" INTEGER,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskScan" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "companyId" TEXT,
    "startupName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "survivalScore" DOUBLE PRECISION,
    "verdict" TEXT,
    "keyVulnerabilities" JSONB,
    "recommendation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE INDEX "Company_slug_idx" ON "Company"("slug");

-- CreateIndex
CREATE INDEX "Company_industry_idx" ON "Company"("industry");

-- CreateIndex
CREATE INDEX "Company_enriched_idx" ON "Company"("enriched");

-- CreateIndex
CREATE INDEX "Evidence_companyId_idx" ON "Evidence"("companyId");

-- CreateIndex
CREATE INDEX "Evidence_contentType_idx" ON "Evidence"("contentType");

-- CreateIndex
CREATE INDEX "Evidence_sourceName_idx" ON "Evidence"("sourceName");

-- CreateIndex
CREATE INDEX "Claim_companyId_idx" ON "Claim"("companyId");

-- CreateIndex
CREATE INDEX "Claim_evidenceId_idx" ON "Claim"("evidenceId");

-- CreateIndex
CREATE INDEX "Claim_verificationStatus_idx" ON "Claim"("verificationStatus");

-- CreateIndex
CREATE INDEX "Embedding_contentId_idx" ON "Embedding"("contentId");

-- CreateIndex
CREATE INDEX "Embedding_contentType_idx" ON "Embedding"("contentType");

-- CreateIndex
CREATE INDEX "Embedding_companyId_idx" ON "Embedding"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "FailurePattern_slug_key" ON "FailurePattern"("slug");

-- CreateIndex
CREATE INDEX "FailurePattern_slug_idx" ON "FailurePattern"("slug");

-- CreateIndex
CREATE INDEX "AgentExecution_agentName_idx" ON "AgentExecution"("agentName");

-- CreateIndex
CREATE INDEX "AgentExecution_status_idx" ON "AgentExecution"("status");

-- CreateIndex
CREATE INDEX "RiskScan_companyId_idx" ON "RiskScan"("companyId");

-- CreateIndex
CREATE INDEX "RiskScan_userId_idx" ON "RiskScan"("userId");

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Embedding" ADD CONSTRAINT "Embedding_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskScan" ADD CONSTRAINT "RiskScan_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

