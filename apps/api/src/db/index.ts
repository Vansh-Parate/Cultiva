import { PrismaClient } from "@prisma/client";

// Global prisma instance to prevent multiple connections
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Test database connection with retries
export async function testDatabaseConnection(maxRetries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔗 Attempting database connection (${attempt}/${maxRetries})...`);
      await prisma.$connect();
      console.log('✅ Database connection successful');
      return true;
    } catch (error: any) {
      console.error(`❌ Database connection attempt ${attempt} failed:`, {
        code: error.code,
        message: error.message,
        meta: error.meta
      });
      
      if (attempt === maxRetries) {
        console.error('❌ All database connection attempts failed');
        return false;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  console.log('🔄 Disconnecting from database...');
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  console.log('🔄 Received SIGINT, disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Received SIGTERM, disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
