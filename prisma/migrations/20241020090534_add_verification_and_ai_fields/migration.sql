-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "isGeneratedByAI" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerifiedByExpert" BOOLEAN NOT NULL DEFAULT false;
