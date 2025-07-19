import { PrismaClient } from "@prisma/client";
// @ts-ignore
import type {} from 'node';

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.plantSpecies.createMany({
      data: [
        { commonName: 'Aloe Vera', scientificName: 'Aloe barbadensis' },
        { commonName: 'Peace Lily', scientificName: 'Spathiphyllum' },
        { commonName: 'Tomatoes', scientificName: 'Solanum lycopersicum' },
        { commonName: 'Snake Plant', scientificName: 'Sansevieria trifasciata' },
        { commonName: 'Spider Plant', scientificName: 'Chlorophytum comosum' },
      ],
      skipDuplicates: true,
    });
    console.log('Seeded PlantSpecies table.');
  } catch (error) {
    console.log("Error while seeding", error);
  }
}

async function main() {
  try {
    await seed();
  } catch (Error) {
    console.log("Error while seeding", Error);
    throw Error;
  }
}

main()
  .catch((error) => {
    console.error("An unexpected error occurred during seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
