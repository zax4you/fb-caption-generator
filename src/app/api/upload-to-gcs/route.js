// src/app/api/upload-to-gcs/route.js
import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('🔧 GCS Upload API called');
    
    const { imageData, fileName, folderPath } = await request.json();
    
    console.log('🔧 Request data:', {
      fileName,
      folderPath,
      hasImageData: !!imageData,
      imageDataLength: imageData ? imageData.length : 0
    });

    // Environment check
    console.log('🔧 Environment variables:', {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID ? '✅ Found' : '❌ Missing',
      bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET ? '✅ Found' : '❌ Missing',
      credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 ? '✅ Found (base64)' : (process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Found (file)' : '❌ Missing')
    });

    if (!imageData || !fileName) {
      console.error('❌ Missing required fields');
      return NextResponse.json({ 
        success: false,
        error: 'Missing imageData or fileName' 
      }, { status: 400 });
    }

    // Initialize Google Cloud Storage INSIDE the function (important for serverless)
    let storage;
    
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
        console.log('🔧 Using base64 credentials for Vercel deployment');
        
        const base64Creds = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
        console.log('🔧 Base64 credentials length:', base64Creds.length);
        
        const credentialsJson = Buffer.from(base64Creds, 'base64').toString();
        console.log('🔧 Decoded credentials length:', credentialsJson.length);
        
        const credentials = JSON.parse(credentialsJson);
        console.log('🔧 Credentials parsed, project_id:', credentials.project_id);
        
        storage = new Storage({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          credentials: credentials,
        });
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log('🔧 Using JSON file credentials for local development');
        storage = new Storage({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });
      } else {
        throw new Error('No Google Cloud credentials found in environment variables');
      }
      
      console.log('✅ Google Cloud Storage initialized successfully');
    } catch (storageError) {
      console.error('❌ Failed to initialize Google Cloud Storage:', storageError);
      return NextResponse.json({
        success: false,
        error: 'Failed to initialize storage',
        details: storageError.message
      }, { status: 500 });
    }

    // Validate bucket name
    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
    if (!bucketName) {
      console.error('❌ Bucket name not found');
      return NextResponse.json({
        success: false,
        error: 'Storage bucket not configured'
      }, { status: 500 });
    }

    // Convert base64 to buffer
    try {
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      console.log('🔧 Image buffer created, size:', buffer.length, 'bytes');

      // Create safe filename with timestamp
      const now = new Date();
      const dateFolder = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStamp = now.toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0]; // HH-MM-SS
      
      const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fullPath = folderPath ? 
        `${folderPath}/${dateFolder}/${timeStamp}_${safeFileName}` :
        `${dateFolder}/${timeStamp}_${safeFileName}`;

      console.log('🔧 Full upload path:', fullPath);

      // Upload to Google Cloud Storage
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(fullPath);

      console.log('🔧 Starting upload to bucket:', bucketName);

      await file.save(buffer, {
        metadata: {
          contentType: 'image/webp',
          cacheControl: 'public, max-age=31536000', // 1 year cache
        },
        public: true, // Make the file publicly accessible
      });

      console.log('✅ File uploaded successfully');

      // Generate public URL
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fullPath}`;

      console.log('✅ Upload complete:', publicUrl);

      return NextResponse.json({
        success: true,
        publicUrl: publicUrl,
        filePath: fullPath,
        fileName: safeFileName,
        message: 'File uploaded successfully'
      });

    } catch (uploadError) {
      console.error('❌ Upload process error:', uploadError);
      return NextResponse.json({
        success: false,
        error: 'Upload process failed',
        details: uploadError.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ General API error:', error);
    console.error('❌ Error stack:', error.stack);
    
    return NextResponse.json({ 
      success: false,
      error: 'Upload failed', 
      details: error.message 
    }, { status: 500 });
  }
}