/*
  Warnings:

  - Made the column `imageUrl` on table `PlantImage` required. This step will fail if there are existing NULL values in that column.

*/

-- Update NULL imageUrl values with a default placeholder
UPDATE "PlantImage" SET "imageUrl" = 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&h=300&fit=crop' WHERE "imageUrl" IS NULL;

-- AlterTable
ALTER TABLE "CommunityPost" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PlantImage" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "PlantShop" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PlantSpecies" ALTER COLUMN "updatedAt" DROP DEFAULT;
