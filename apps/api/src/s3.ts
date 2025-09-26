import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { config as appConfig } from './config/env';

// Ensure env is loaded via config/env (dotenv.config ran there)
// Check if S3 environment variables are set
const isS3Configured =
  !!appConfig.AWS_REGION &&
  !!appConfig.AWS_ACCESS_KEY_ID &&
  !!appConfig.AWS_SECRET_ACCESS_KEY &&
  !!appConfig.S3_BUCKET_NAME;

let s3: S3Client | null = null;
let BUCKET: string | null = null;

if (isS3Configured) {
  s3 = new S3Client({
    region: appConfig.AWS_REGION,
    credentials: {
      accessKeyId: appConfig.AWS_ACCESS_KEY_ID!,
      secretAccessKey: appConfig.AWS_SECRET_ACCESS_KEY!,
    },
  });
  BUCKET = appConfig.S3_BUCKET_NAME!;
  console.log(`✅ S3 configured for region: ${appConfig.AWS_REGION}, bucket: ${BUCKET}`);
} else {
  console.warn('⚠️ S3 not configured - missing environment variables');
}

export async function uploadImageToS3(buffer: Buffer, mimetype: string): Promise<string> {
  // If S3 is not configured, return a placeholder URL
  if (!isS3Configured || !s3 || !BUCKET) {
    console.warn('S3 not configured, using placeholder URL');
    return `https://picsum.photos/seed/${uuidv4()}/400/300`;
  }

  try {
    const key = `plants/${uuidv4()}.${mimetype.split('/')[1] || 'jpg'}`;
    
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        // Remove ACL for bucket policy compatibility
      })
    );
    
    // Construct a safe, accessible S3 URL
    // - Use path-style URLs if bucket contains dots to avoid TLS cert mismatch
    // - Use regional endpoint, with us-east-1 special-cased
    const region = appConfig.AWS_REGION || 'us-east-1';
    const bucketHasDot = BUCKET.includes('.')
    const host = region === 'us-east-1' ? 's3.amazonaws.com' : `s3.${region}.amazonaws.com`;
    const s3Url = bucketHasDot
      ? `https://${host}/${BUCKET}/${key}`
      : `https://${BUCKET}.s3.${region}.amazonaws.com/${key}`;
    console.log(`✅ Image uploaded to S3: ${s3Url}`);
    return s3Url;
  } catch (error: any) {
    console.error('❌ S3 upload failed:', error.message);
    
    // Log specific error details
    if (error.name === 'AccessDenied') {
      console.error('🔒 S3 Access Denied - Check IAM permissions');
    } else if (error.name === 'NoSuchBucket') {
      console.error('🪣 S3 Bucket not found - Check bucket name');
    } else if (error.name === 'InvalidAccessKeyId') {
      console.error('🔑 Invalid AWS Access Key - Check credentials');
    }
    
    // Return a placeholder URL if S3 upload fails
    return `https://picsum.photos/seed/${uuidv4()}/400/300`;
  }
} 