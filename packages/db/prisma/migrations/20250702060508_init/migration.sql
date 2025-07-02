-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT,
    "location" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dateAcquired" TIMESTAMP(3),
    "locationType" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plantId" TEXT NOT NULL,

    CONSTRAINT "PlantImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantSpecies" (
    "id" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "careDifficulty" TEXT,
    "lightRequirements" TEXT,
    "waterFrequencyDays" INTEGER,
    "humidityNeeds" TEXT,
    "temperatureRange" TEXT,
    "soilType" TEXT,
    "growthSeason" TEXT,

    CONSTRAINT "PlantSpecies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareSchedule" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "careType" TEXT NOT NULL,
    "frequencyDays" INTEGER NOT NULL,
    "lastCompletedAt" TIMESTAMP(3),
    "nextDueDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareLog" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "careType" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "imageUrl" TEXT,
    "careScheduleId" TEXT,

    CONSTRAINT "CareLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthLog" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "healthStatus" TEXT NOT NULL,
    "heightCm" DOUBLE PRECISION,
    "widthCm" DOUBLE PRECISION,
    "issuesNoted" TEXT,
    "notes" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "HealthLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantIdentification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "topSpeciesSuggestions" TEXT NOT NULL,
    "confidenceScores" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantIdentification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrls" TEXT,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantShop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "servicesOffered" TEXT,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantShop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "PlantSpecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantImage" ADD CONSTRAINT "PlantImage_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareSchedule" ADD CONSTRAINT "CareSchedule_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareLog" ADD CONSTRAINT "CareLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareLog" ADD CONSTRAINT "CareLog_careScheduleId_fkey" FOREIGN KEY ("careScheduleId") REFERENCES "CareSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthLog" ADD CONSTRAINT "HealthLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantIdentification" ADD CONSTRAINT "PlantIdentification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
