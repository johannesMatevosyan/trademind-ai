-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "aiReview" JSONB,
ADD COLUMN     "aiReviewVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "aiReviewedAt" TIMESTAMP(3);
