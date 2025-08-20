/*
  Warnings:

  - You are about to drop the column `careScheduleId` on the `CareLog` table. All the data in the column will be lost.
  - The `imageUrls` column on the `CommunityPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tags` column on the `CommunityPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `description` on the `Plant` table. All the data in the column will be lost.
  - The `topSpeciesSuggestions` column on the `PlantIdentification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `confidenceScores` column on the `PlantIdentification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `url` on the `PlantImage` table. All the data in the column will be lost.
  - You are about to drop the column `servicesOffered` on the `PlantShop` table. All the data in the column will be lost.
*/

-- DropForeignKey
ALTER TABLE "CareLog" DROP CONSTRAINT "CareLog_careScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "CareLog" DROP CONSTRAINT "CareLog_plantId_fkey";

-- DropForeignKey
ALTER TABLE "CareSchedule" DROP CONSTRAINT "CareSchedule_plantId_fkey";

-- DropForeignKey
ALTER TABLE "CommunityPost" DROP CONSTRAINT "CommunityPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "HealthLog" DROP CONSTRAINT "HealthLog_plantId_fkey";

-- DropForeignKey
ALTER TABLE "Plant" DROP CONSTRAINT "Plant_speciesId_fkey";

-- DropForeignKey
ALTER TABLE "Plant" DROP CONSTRAINT "Plant_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlantIdentification" DROP CONSTRAINT "PlantIdentification_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlantImage" DROP CONSTRAINT "PlantImage_plantId_fkey";

-- AlterTable
ALTER TABLE "CareLog" DROP COLUMN "careScheduleId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "completedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CommunityPost" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "imageUrls",
ADD COLUMN     "imageUrls" TEXT[],
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "HealthLog" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "description",
ADD COLUMN     "healthStatus" TEXT DEFAULT 'Good',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "primaryImageUrl" TEXT,
ADD COLUMN     "variety" TEXT,
ALTER COLUMN "speciesId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PlantIdentification" DROP COLUMN "topSpeciesSuggestions",
ADD COLUMN     "topSpeciesSuggestions" TEXT[],
DROP COLUMN "confidenceScores",
ADD COLUMN     "confidenceScores" DOUBLE PRECISION[],
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "PlantImage" ADD COLUMN     "imageUrl" TEXT,
DROP COLUMN "url";

-- AlterTable
ALTER TABLE "PlantShop" DROP COLUMN "servicesOffered",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "services" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "PlantSpecies" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "scientificName" DROP NOT NULL,
ALTER COLUMN "careDifficulty" SET DEFAULT 'beginner';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "experienceLevel" TEXT DEFAULT 'beginner',
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PostLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopReview" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostLike_postId_idx" ON "PostLike"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_userId_postId_key" ON "PostLike"("userId", "postId");

-- CreateIndex
CREATE INDEX "PostComment_postId_idx" ON "PostComment"("postId");

-- CreateIndex
CREATE INDEX "ShopReview_shopId_idx" ON "ShopReview"("shopId");

-- CreateIndex
CREATE INDEX "ShopReview_userId_idx" ON "ShopReview"("userId");

-- CreateIndex
CREATE INDEX "CareLog_plantId_idx" ON "CareLog"("plantId");

-- CreateIndex
CREATE INDEX "CareSchedule_plantId_idx" ON "CareSchedule"("plantId");

-- CreateIndex
CREATE INDEX "CommunityPost_userId_idx" ON "CommunityPost"("userId");

-- CreateIndex
CREATE INDEX "CommunityPost_postType_idx" ON "CommunityPost"("postType");

-- CreateIndex
CREATE INDEX "HealthLog_plantId_idx" ON "HealthLog"("plantId");

-- CreateIndex
CREATE INDEX "Plant_userId_idx" ON "Plant"("userId");

-- CreateIndex
CREATE INDEX "Plant_speciesId_idx" ON "Plant"("speciesId");

-- CreateIndex
CREATE INDEX "PlantIdentification_userId_idx" ON "PlantIdentification"("userId");

-- CreateIndex
CREATE INDEX "PlantImage_plantId_idx" ON "PlantImage"("plantId");

-- CreateIndex
CREATE INDEX "PlantShop_rating_idx" ON "PlantShop"("rating");

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "PlantSpecies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantImage" ADD CONSTRAINT "PlantImage_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareSchedule" ADD CONSTRAINT "CareSchedule_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareLog" ADD CONSTRAINT "CareLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthLog" ADD CONSTRAINT "HealthLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantIdentification" ADD CONSTRAINT "PlantIdentification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopReview" ADD CONSTRAINT "ShopReview_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "PlantShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopReview" ADD CONSTRAINT "ShopReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
