export const uploadToGCS = async (imageDataUrl, fileName) => {
  try {
    const response = await fetch('/api/upload-to-gcs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: imageDataUrl,
        fileName: fileName,
        folderPath: 'facebook-captions'
      }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const uploadBulkToGCS = async (images, onProgress) => {
  const results = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const fileName = `bulk_caption_${image.id}.webp`;
    
    try {
      const result = await uploadToGCS(image.dataUrl, fileName);
      results.push({
        ...image,
        gcsUrl: result.publicUrl,
        gcsPath: result.filePath
      });
      
      // Call progress callback
      if (onProgress) {
        onProgress(i + 1, images.length);
      }
      
      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`Failed to upload image ${image.id}:`, error);
      results.push({
        ...image,
        gcsUrl: null,
        gcsPath: null,
        error: error.message
      });
    }
  }
  
  return results;
};