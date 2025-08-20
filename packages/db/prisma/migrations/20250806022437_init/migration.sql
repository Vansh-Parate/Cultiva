/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CareLog` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CommunityPost` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `HealthLog` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `PlantShop` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `PlantShop` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `PlantShop` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `PlantShop` table. All the data in the column will be lost.
  - You are about to drop the column `services` on the `PlantShop` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PlantShop` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId,userId]` on the table `PostLike` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CommunityPost_postType_idx";

-- DropIndex
DROP INDEX "PlantShop_rating_idx";

-- DropIndex
DROP INDEX "PostLike_userId_postId_key";

-- AlterTable
ALTER TABLE "CareLog" DROP COLUMN "createdAt",
ADD COLUMN     "careScheduleId" TEXT,
ALTER COLUMN "completedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "CommunityPost" DROP COLUMN "updatedAt",
ALTER COLUMN "imageUrls" DROP NOT NULL,
ALTER COLUMN "imageUrls" SET DATA TYPE TEXT,
ALTER COLUMN "tags" DROP NOT NULL,
ALTER COLUMN "tags" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "HealthLog" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "PlantIdentification" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "topSpeciesSuggestions" SET NOT NULL,
ALTER COLUMN "topSpeciesSuggestions" SET DATA TYPE TEXT,
ALTER COLUMN "confidenceScores" SET NOT NULL,
ALTER COLUMN "confidenceScores" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PlantShop" DROP COLUMN "description",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "reviewCount",
DROP COLUMN "services",
DROP COLUMN "updatedAt",
ADD COLUMN     "servicesOffered" TEXT,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "rating" DROP DEFAULT;

-- CreateTable
CREATE TABLE "CareTask" (
    "id" TEXT NOT NULL,
    "plantName" TEXT NOT NULL,
    "plantId" TEXT,
    "type" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "priority" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CareTask_userId_idx" ON "CareTask"("userId");

-- CreateIndex
CREATE INDEX "CareLog_careScheduleId_idx" ON "CareLog"("careScheduleId");

-- CreateIndex
CREATE INDEX "PostComment_userId_idx" ON "PostComment"("userId");

-- CreateIndex
CREATE INDEX "PostLike_userId_idx" ON "PostLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_postId_userId_key" ON "PostLike"("postId", "userId");

-- AddForeignKey
ALTER TABLE "CareLog" ADD CONSTRAINT "CareLog_careScheduleId_fkey" FOREIGN KEY ("careScheduleId") REFERENCES "CareSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareTask" ADD CONSTRAINT "CareTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
