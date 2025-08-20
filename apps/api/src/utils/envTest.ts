console.log('🔍 Environment Variables Check:');
console.log('================================');
console.log(`AWS_REGION: ${process.env.AWS_REGION || 'NOT SET'}`);
console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET'}`);
console.log(`AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET'}`);
console.log(`S3_BUCKET_NAME: ${process.env.S3_BUCKET_NAME || 'NOT SET'}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log('================================'); 