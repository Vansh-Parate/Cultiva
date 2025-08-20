import { uploadImageToS3 } from '../s3';

async function testS3Upload() {
  console.log('🔍 Testing S3 configuration...');
  console.log(`📊 AWS Region: ${process.env.AWS_REGION || 'Not set'}`);
  console.log(`🔑 Access Key: ${process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set'}`);
  console.log(`🔐 Secret Key: ${process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set'}`);
  console.log(`🪣 Bucket Name: ${process.env.S3_BUCKET_NAME || 'Not set'}`);
  
  // Create a test image buffer (1x1 pixel PNG)
  const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  
  try {
    console.log('📤 Attempting S3 upload...');
    const imageUrl = await uploadImageToS3(testImageBuffer, 'image/png');
    console.log(`✅ S3 upload result: ${imageUrl}`);
    
    if (imageUrl.includes('picsum.photos')) {
      console.log('⚠️ Using placeholder URL - S3 upload failed or not configured');
    } else {
      console.log('✅ S3 upload successful!');
    }
  } catch (error: any) {
    console.error('❌ S3 test failed:', error.message);
  }
}

testS3Upload(); 