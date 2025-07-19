// src/app/api/upload-to-gcs/route.js
import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

// Initialize Google Cloud Storage
let storage;

console.log('🔧 Initializing Google Cloud Storage...');

try {
  // For Vercel deployment - use base64 encoded credentials
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    console.log('🔧 Using base64 credentials for Vercel deployment');
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString()
    );
    
    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: credentials,
    });
  } else {
    // For local development - use JSON file
    console.log('🔧 Using JSON file credentials for local development');
    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }
  
  console.log('✅ Google Cloud Storage initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Google Cloud Storage:', error);
}

export async function POST(request) {
  try {
    const { imageData, fileName, folderPath } = await request.json();

    console.log('🔧 API called with', {
      fileName,
      folderPath,
      hasImageData: !!imageData
    });

    // Environment check
    console.log('🔧 Environment check', {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID ? '✅ Found' : '❌ Missing',
      bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET ? '✅ Found' : '❌ Missing',
      credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 || process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Found' : '❌ Missing'
    });

    if (!imageData || !fileName) {
      return NextResponse.json({ error: 'Missing imageData or fileName' }, { status: 400 });
    }

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fullPath = folderPath ? 
      `${folderPath}/${new Date().toISOString().split('T')[0]}/${timestamp.split('T')[1]}_${safeFileName}` :
      `${timestamp}_${safeFileName}`;

    console.log(`☁️ Uploading to GCS: ${fullPath}`);

    // Upload to Google Cloud Storage
    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
    const file = bucket.file(fullPath);

    await file.save(buffer, {
      metadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000', // 1 year cache
      },
      public: true, // Make the file publicly accessible
    });

    console.log('✅ File uploaded successfully (public access via bucket-level settings)');

    // Generate public URL
    const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/${fullPath}`;

    console.log('✅ Upload successful:', publicUrl);

    return NextResponse.json({
      success: true,
      publicUrl: publicUrl,
      filePath: fullPath,
      fileName: safeFileName,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error.message 
    }, { status: 500 });
  }
}