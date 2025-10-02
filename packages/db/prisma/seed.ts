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

    // Seed Plant Shops
    await prisma.plantShop.createMany({
      data: [
        {
          name: 'Green Haven Nursery',
          address: '123 Plant Street, New York, NY 10001',
          phone: '(555) 123-4567',
          website: 'https://www.greenhaven.com',
          servicesOffered: 'Plant Care,Landscaping,Plant Doctor,Workshops',
          rating: 4.8
        },
        {
          name: 'Botanical Gardens Shop',
          address: '456 Garden Ave, New York, NY 10002',
          phone: '(555) 987-6543',
          website: 'https://www.botanicalgardens.com',
          servicesOffered: 'Plant Sales,Care Consultation,Workshops,Delivery',
          rating: 4.6
        },
        {
          name: 'Urban Jungle',
          address: '789 City Plaza, New York, NY 10003',
          phone: '(555) 456-7890',
          website: 'https://www.urbanjungle.com',
          servicesOffered: 'Indoor Plants,Rare Species,Plant Sitting,Design Consultation',
          rating: 4.9
        },
        {
          name: 'Succulent Paradise',
          address: '321 Desert Way, New York, NY 10004',
          phone: '(555) 321-6547',
          website: 'https://www.succulentparadise.com',
          servicesOffered: 'Succulents,Cacti,Terrarium Kits,Care Guides',
          rating: 4.7
        },
        {
          name: 'The Plant Corner',
          address: '654 Green Street, New York, NY 10005',
          phone: '(555) 654-3210',
          website: 'https://www.plantcorner.com',
          servicesOffered: 'Plant Sales,Repotting,Pest Treatment,Plant Health Check',
          rating: 4.5
        }
      ],
      skipDuplicates: true,
    });
    console.log('Seeded PlantShop table.');
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
