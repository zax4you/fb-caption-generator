import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageData, fileName, folderPath = 'facebook-captions' } = await request.json();
    
    console.log('🔧 API called with', { fileName, folderPath });
    console.log('🔧 Environment check', {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID ? '✅ Set' : '❌ Missing',
      bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
      credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Set' : '❌ Missing'
    });

    // Initialize Google Cloud Storage (hardcoded for testing)
    const storage = new Storage({
      projectId: 'inspiring-lore-442206-p5',
      keyFilename: './inspiring-lore-442206-p5-98acc5c8bb33.json',
    });

    const bucketName = 'viral-content-inspiring-lore';
    const bucket = storage.bucket(bucketName);

    // Create safe file path with timestamp
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeString = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const filePath = `${folderPath}/${timestamp}/${timeString}_${safeFileName}`;

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/webp;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    console.log('☁️ Uploading to GCS:', filePath);

    // Upload to GCS
    const file = bucket.file(filePath);
    
    await file.save(imageBuffer, {
      metadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000', // 1 year cache
      },
    });

    // Note: File is already publicly accessible due to uniform bucket-level access
    console.log('✅ File uploaded successfully (public access via bucket-level settings)');

    // Generate public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
    
    console.log('✅ Upload successful:', publicUrl);

    return NextResponse.json({
      success: true,
      publicUrl,
      filePath,
      fileName: safeFileName
    });

  } catch (error) {
    console.error('❌ GCS Upload Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}