import { Storage } from '@google-cloud/storage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageData, fileName, folderPath = 'facebook-captions' } = req.body;

    // Initialize Google Cloud Storage
    const storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
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

    // Upload to GCS
    const file = bucket.file(filePath);
    
    await file.save(imageBuffer, {
      metadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000', // 1 year cache
      },
    });

    // Make file publicly accessible
    await file.makePublic();

    // Generate public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;

    console.log(`✅ Uploaded: ${publicUrl}`);

    res.status(200).json({
      success: true,
      publicUrl,
      filePath,
      fileName: safeFileName
    });

  } catch (error) {
    console.error('❌ GCS Upload Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}