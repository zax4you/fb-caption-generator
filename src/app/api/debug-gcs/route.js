// Create this file: src/app/api/debug-gcs/route.js
import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {},
    credentials: {},
    storage: {},
    bucket: {},
    errors: []
  };

  try {
    // Check environment variables
    diagnostics.environment = {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID ? '✅ Present' : '❌ Missing',
      bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET ? '✅ Present' : '❌ Missing',
      credentialsBase64: process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 ? '✅ Present' : '❌ Missing',
      credentialsFile: process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Present' : '❌ Missing',
      nodeEnv: process.env.NODE_ENV || 'unknown'
    };

    // Test credentials decoding
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
      try {
        const base64Creds = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
        const credentialsJson = Buffer.from(base64Creds, 'base64').toString();
        const credentials = JSON.parse(credentialsJson);
        
        diagnostics.credentials = {
          status: '✅ Valid',
          projectId: credentials.project_id || 'Not found',
          clientEmail: credentials.client_email || 'Not found',
          type: credentials.type || 'Not found',
          base64Length: base64Creds.length,
          jsonLength: credentialsJson.length
        };
      } catch (credError) {
        diagnostics.credentials = {
          status: '❌ Invalid',
          error: credError.message
        };
        diagnostics.errors.push(`Credentials parsing: ${credError.message}`);
      }
    }

    // Test storage initialization
    let storage;
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
        const credentials = JSON.parse(
          Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString()
        );
        
        storage = new Storage({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          credentials: credentials,
        });
      } else {
        storage = new Storage({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });
      }
      
      diagnostics.storage = {
        status: '✅ Initialized',
        projectId: storage.projectId
      };
    } catch (storageError) {
      diagnostics.storage = {
        status: '❌ Failed to initialize',
        error: storageError.message
      };
      diagnostics.errors.push(`Storage init: ${storageError.message}`);
    }

    // Test bucket access
    if (storage && process.env.GOOGLE_CLOUD_STORAGE_BUCKET) {
      try {
        const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
        
        // Try to get bucket metadata
        const [metadata] = await bucket.getMetadata();
        
        diagnostics.bucket = {
          status: '✅ Accessible',
          name: metadata.name,
          location: metadata.location,
          storageClass: metadata.storageClass,
          created: metadata.timeCreated
        };
      } catch (bucketError) {
        diagnostics.bucket = {
          status: '❌ Not accessible',
          error: bucketError.message,
          code: bucketError.code
        };
        diagnostics.errors.push(`Bucket access: ${bucketError.message}`);
      }
    }

    // Test file upload permission
    if (storage && process.env.GOOGLE_CLOUD_STORAGE_BUCKET && diagnostics.bucket.status === '✅ Accessible') {
      try {
        const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
        const testFileName = `test/diagnostic-${Date.now()}.txt`;
        const testContent = 'Diagnostic test file';
        
        const file = bucket.file(testFileName);
        await file.save(testContent, {
          metadata: {
            contentType: 'text/plain',
          },
          public: true,
        });
        
        // Try to delete the test file
        await file.delete();
        
        diagnostics.uploadTest = {
          status: '✅ Upload/Delete successful',
          testFile: testFileName
        };
      } catch (uploadError) {
        diagnostics.uploadTest = {
          status: '❌ Upload/Delete failed',
          error: uploadError.message,
          code: uploadError.code
        };
        diagnostics.errors.push(`Upload test: ${uploadError.message}`);
      }
    }

  } catch (error) {
    diagnostics.errors.push(`General error: ${error.message}`);
  }

  return NextResponse.json(diagnostics, { 
    status: diagnostics.errors.length > 0 ? 500 : 200 
  });
}

export async function POST(request) {
  try {
    const { testUpload } = await request.json();
    
    if (testUpload) {
      // Test with a small image upload
      const testImageData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
      
      // Initialize storage
      let storage;
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
        const credentials = JSON.parse(
          Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString()
        );
        storage = new Storage({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          credentials: credentials,
        });
      }
      
      const base64Data = testImageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
      const file = bucket.file(`test/diagnostic-image-${Date.now()}.webp`);
      
      await file.save(buffer, {
        metadata: {
          contentType: 'image/webp',
        },
        public: true,
      });
      
      // Clean up
      await file.delete();
      
      return NextResponse.json({
        success: true,
        message: 'Test image upload successful'
      });
    }
    
    return NextResponse.json({ error: 'No test specified' }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}