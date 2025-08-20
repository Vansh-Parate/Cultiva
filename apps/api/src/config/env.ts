import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // Server
  PORT: process.env.PORT || 6969,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Session
  SESSION_SECRET: process.env.SESSION_SECRET || 'default-secret',
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://green-care-gamma.vercel.app',
  
  // External APIs
  PLANT_ID_API_KEY: process.env.PLANT_ID_API_KEY || '',
  
  // AWS S3 (optional)
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || '',
  
  // Google OAuth (if using)
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
};

// Validate required environment variables
export function validateEnv() {
  const required = ['DATABASE_URL'];
  const missing = required.filter(key => !config[key as keyof typeof config]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('💡 Please set these in your .env file or environment');
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
} 