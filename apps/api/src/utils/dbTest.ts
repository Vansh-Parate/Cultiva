import { prisma } from '../db';

async function testDB() {
  console.log('🔍 Testing database connection...');
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  try {
    console.log('🔗 Attempting database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const speciesCount = await prisma.plantSpecies.count();
    console.log(`📊 Found ${speciesCount} plant species in database`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('1. Check your DATABASE_URL format');
    console.log('2. Verify your database credentials');
    console.log('3. Ensure your database is accessible');
    console.log('4. Check if your database has connection limits');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDB(); 