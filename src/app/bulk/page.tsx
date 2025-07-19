'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BulkImporter from '../components/BulkImporter'

// Facebook-style background templates (based on your images)
const facebookBackgrounds = [
  { type: 'gradient', colors: ['#00bcd4', '#9c27b0'], textColor: '#ffffff' }, // Image 1: Cyan to Purple
  { type: 'gradient', colors: ['#8e24aa', '#8e24aa'], textColor: '#ffffff' }, // Image 2: Solid Purple
  { type: 'gradient', colors: ['#e91e63', '#e91e63'], textColor: '#ffffff' }, // Image 3: Solid Pink/Red
  { type: 'solid', colors: ['#1c1e21'], textColor: '#ffffff' }, // Image 4: Dark/Black
  { type: 'gradient', colors: ['#e91e63', '#3f51b5'], textColor: '#ffffff' }, // Image 5: Pink to Blue
  { type: 'gradient', colors: ['#673ab7', '#e91e63'], textColor: '#ffffff' }, // Image 6: Purple to Pink
  { type: 'gradient', colors: ['#ffc107', '#e91e63'], textColor: '#ffffff' }  // Image 7: Yellow to Pink
]

// Background mapping for AI suggestions
const backgroundMapping = {
  'Purple-Pink': 5, // Index 5: Purple to Pink
  'Pink-Blue': 4,   // Index 4: Pink to Blue
  'Cyan-Purple': 0, // Index 0: Cyan to Purple
  'Dark': 3,        // Index 3: Dark/Black
  'Solid Purple': 1, // Index 1: Solid Purple
  'Pink-Red': 2,    // Index 2: Solid Pink/Red
  'Yellow-Pink': 6  // Index 6: Yellow to Pink
}

// Upload function
const uploadToGCS = async (imageDataUrl, fileName) => {
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

export default function Bulk() {
  const [bulkData, setBulkData] = useState<any[]>([])
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  const [processing, setProcessing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const [aiTextsLoaded, setAiTextsLoaded] = useState(false)

  // Check for AI-generated texts on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('source') === 'ai-generator') {
      const aiTexts = localStorage.getItem('aiGeneratedTexts');
      if (aiTexts) {
        try {
          const parsedTexts = JSON.parse(aiTexts);
          const formattedData = parsedTexts.map((item: any) => ({
            text: item.text,
            background: item.background
          }));
          setBulkData(formattedData);
          setAiTextsLoaded(true);
          // Clear from localStorage after loading
          localStorage.removeItem('aiGeneratedTexts');
        } catch (error) {
          console.error('Error parsing AI texts:', error);
        }
      }
    }
  }, []);

  const uploadAllToGCS = async () => {
    if (generatedImages.length === 0) {
      alert('No images to upload')
      return
    }

    // ✅ GCS UPLOADS NOW ENABLED!
    const skipUpload = false; // GCS permissions are working perfectly! ✅
    
    if (skipUpload) {
      console.log('🔧 DEMO MODE: Skipping actual upload, generating mock URLs');
      
      const mockResults = generatedImages.map((image, index) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const dateFolder = timestamp.split('T')[0]; // YYYY-MM-DD
        const timeStamp = timestamp.split('T')[1].split('.')[0]; // HH-MM-SS
        
        return {
          ...image,
          gcsUrl: `https://storage.googleapis.com/viral-content-inspiring-lore/facebook-captions/${dateFolder}/${timeStamp}_${image.id}.webp`,
          gcsPath: `facebook-captions/${dateFolder}/${timeStamp}_${image.id}.webp`,
          fileName: `${timeStamp}_${image.id}.webp`
        };
      });
      
      setGeneratedImages(mockResults);
      alert(`✅ DEMO MODE: ${mockResults.length} images "uploaded" with mock URLs!\n\n🔧 GCS upload temporarily disabled while debugging.\n📋 You can still export CSV and download images.`);
      return;
    }

    // ✅ REAL GCS UPLOAD CODE (NOW ACTIVE!)
    console.log('🚀 Starting real GCS uploads!');
    setUploading(true)
    setUploadProgress({ current: 0, total: generatedImages.length })

    const uploadedResults = []

    for (let i = 0; i < generatedImages.length; i++) {
      const image = generatedImages[i]
      const fileName = `bulk_caption_${image.id}.webp`
      
      try {
        setUploadProgress({ current: i + 1, total: generatedImages.length })
        
        console.log(`📤 Uploading ${fileName} (${i + 1}/${generatedImages.length})...`);
        
        const result = await uploadToGCS(image.dataUrl, fileName)
        
        uploadedResults.push({
          ...image,
          gcsUrl: result.publicUrl,
          gcsPath: result.filePath,
          fileName: result.fileName
        })
        
        console.log(`✅ Uploaded ${fileName} successfully: ${result.publicUrl}`)
        
        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 300))
        
      } catch (error) {
        console.error(`❌ Failed to upload ${fileName}:`, error)
        uploadedResults.push({
          ...image,
          gcsUrl: null,
          gcsPath: null,
          error: error.message
        })
      }
    }

    // Update the generated images with real GCS URLs
    setGeneratedImages(uploadedResults)
    setUploading(false)
    
    const successCount = uploadedResults.filter(img => img.gcsUrl).length
    const failureCount = uploadedResults.length - successCount
    
    if (failureCount === 0) {
      alert(`🎉 Upload complete! All ${successCount} images uploaded successfully to Google Cloud Storage!`)
    } else {
      alert(`⚠️ Upload complete! ${successCount}/${uploadedResults.length} images uploaded successfully. ${failureCount} failed.`)
    }
    
    console.log(`📊 Upload summary: ${successCount} successful, ${failureCount} failed`);
  }

  const downloadAllImages = () => {
    generatedImages.forEach((image, index) => {
      const link = document.createElement('a')
      link.href = image.dataUrl
      link.download = `facebook_caption_${index + 1}.webp`
      link.click()
    })
  }

  const exportToCSV = () => {
    // Filter only images with mock or real URLs for Content Studio export
    const imagesWithUrls = generatedImages.filter(img => img.gcsUrl);
    
    if (imagesWithUrls.length === 0) {
      alert('No images with URLs to export. Upload images first (even in demo mode).');
      return;
    }

    // Content Studio format
    const headers = [
      'Post date and time',
      'Post caption', 
      'Image URLs',
      'Link',
      'First Comment',
      'Include Link in Caption',
      'Video URL',
      'Post Type',
      'Title'
    ];
    
    const csvData = [
      headers.join(','),
      ...imagesWithUrls.map(img => [
        '', // Post date and time (empty for manual scheduling)
        '', // Post caption (empty for manual entry)
        `"${img.gcsUrl}"`, // Image URL
        '', // Link
        '', // First Comment
        'No', // Include Link in Caption
        '', // Video URL
        'Feed', // Post Type
        '' // Title
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `content_studio_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    
    alert(`📋 Exported ${imagesWithUrls.length} images to Content Studio CSV format!`);
  }

  const generateCanvas = (text: string, background: any, canvasId: string) => {
    return new Promise<string>((resolve) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1350
      const ctx = canvas.getContext('2d')!

      // Create gradient or solid background
      let gradient
      if (background.type === 'gradient' && background.colors.length > 1) {
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, background.colors[0])
        gradient.addColorStop(1, background.colors[1])
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = background.colors[0]
      }
      
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Text styling (Facebook authentic)
      ctx.fillStyle = background.textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Facebook's font stack for authenticity
      let fontSize = 64
      ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`
      
      // Text shadow for better readability
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.shadowBlur = 4
      
      // Smart text wrapping and auto-sizing
      const maxWidth = canvas.width * 0.88
      const maxHeight = canvas.height * 0.75
      const padding = canvas.width * 0.06
      
      let lines: string[] = []
      let totalHeight = 0
      let lineHeight = fontSize * 1.15
      
      // Auto-wrap text into lines
      const words = text.split(' ')
      let currentLine = ''
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word
        const testWidth = ctx.measureText(testLine).width
        
        if (testWidth <= maxWidth) {
          currentLine = testLine
        } else {
          if (currentLine) {
            lines.push(currentLine)
            currentLine = word
          } else {
            lines.push(word)
          }
        }
      }
      if (currentLine) {
        lines.push(currentLine)
      }
      
      // Calculate total height and adjust font size if needed
      totalHeight = lines.length * lineHeight
      
      while (totalHeight > maxHeight && fontSize > 40) {
        fontSize -= 3
        lineHeight = fontSize * 1.15
        ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`
        
        // Recalculate lines with new font size
        lines = []
        currentLine = ''
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word
          const testWidth = ctx.measureText(testLine).width
          
          if (testWidth <= maxWidth) {
            currentLine = testLine
          } else {
            if (currentLine) {
              lines.push(currentLine)
              currentLine = word
            } else {
              lines.push(word)
            }
          }
        }
        if (currentLine) {
          lines.push(currentLine)
        }
        
        totalHeight = lines.length * lineHeight
      }
      
      // Center text vertically
      const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2
      
      // Draw text lines
      lines.forEach((line, index) => {
        const y = startY + (index * lineHeight)
        ctx.fillText(line, canvas.width / 2, y)
      })
      
      resolve(canvas.toDataURL('image/webp', 0.92))
    })
  }

  const processBulkGeneration = async () => {
    setProcessing(true)
    setGeneratedImages([])
    
    const results = []
    
    for (let i = 0; i < bulkData.length; i++) {
      try {
        const item = bulkData[i]
        const text = item.text || item.caption || 'Default text'
        
        // Use AI-suggested background if available, otherwise cycle through backgrounds
        let backgroundIndex = i % facebookBackgrounds.length
        if (item.background && backgroundMapping[item.background] !== undefined) {
          backgroundIndex = backgroundMapping[item.background]
        }
        
        const background = facebookBackgrounds[backgroundIndex]
        
        const dataUrl = await generateCanvas(text, background, `canvas-${i}`)
        
        results.push({
          id: Date.now() + i,
          text: text,
          dataUrl: dataUrl,
          timestamp: new Date().toISOString(),
          backgroundIndex: backgroundIndex,
          suggestedBackground: item.background || 'Auto-selected'
        })
        
        setGeneratedImages([...results])
        
      } catch (error) {
        console.error(`Error generating image ${i + 1}:`, error)
      }
    }
    
    console.log(`Generated ${results.length} out of ${bulkData.length} images.`)
    setProcessing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📊 Bulk Caption Generator
        </h1>
        
        <div className="text-center mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              ← Single Generator
            </Link>
            <Link 
              href="/ai-generator" 
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              🤖 AI Generator
            </Link>
          </div>
        </div>

        {/* Success Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-green-800 mb-2">✅ GCS Upload Active</h4>
          <p className="text-sm text-green-700">
            Google Cloud Storage is working perfectly! Generated images will be uploaded to real GCS URLs for Content Studio export.
          </p>
        </div>

        {/* AI Texts Loaded Notice */}
        {aiTextsLoaded && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-green-800 mb-2">✅ AI Texts Loaded Successfully!</h4>
            <p className="text-sm text-green-700">
              {bulkData.length} AI-generated texts have been imported with optimized background suggestions.
              Ready to generate images!
            </p>
          </div>
        )}

        <BulkImporter 
          onDataImported={(data: any[]) => {
            setBulkData(data)
            setGeneratedImages([])
          }}
          importedData={bulkData}
          generatedImages={generatedImages}
        />

        {bulkData.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Ready to Process</h3>
            <p className="text-gray-600 mb-6">
              Found {bulkData.length} items ready for generation.
              {aiTextsLoaded && ' AI-optimized backgrounds will be used where available.'}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={processBulkGeneration}
                disabled={processing}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transition-all duration-300"
              >
                {processing ? '⏳ Generating...' : '🎨 Generate All Images'}
              </button>
            </div>
          </div>
        )}

        {generatedImages.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🎉 Generation Complete!</h3>
            <p className="text-gray-600 mb-6">
              Successfully generated {generatedImages.length} Facebook-style caption images.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <button 
                onClick={uploadAllToGCS}
                disabled={uploading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transition-all duration-300"
              >
                {uploading ? 
                  `⏳ Uploading ${uploadProgress.current}/${uploadProgress.total}...` : 
                  '☁️ Upload to Google Cloud Storage'
                }
              </button>
              
              <button 
                onClick={downloadAllImages}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                📥 Download All Images
              </button>
              
              <button 
                onClick={exportToCSV}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                📋 Export Content Studio CSV
              </button>
            </div>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {generatedImages.slice(0, 8).map((img, index) => (
                <div key={index} className="text-center">
                  <img 
                    src={img.dataUrl} 
                    alt={`Generated ${index + 1}`}
                    className="w-full aspect-[4/5] object-cover rounded-lg shadow-md mb-2"
                  />
                  <div className="text-xs text-gray-600">
                    {img.text.substring(0, 30)}...
                  </div>
                  <div className="text-xs text-blue-600">
                    {img.suggestedBackground}
                  </div>
                  {img.gcsUrl && (
                    <div className="text-xs text-green-600 mt-1">
                      ✅ Uploaded to GCS
                    </div>
                  )}
                </div>
              ))}
              {generatedImages.length > 8 && (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg aspect-[4/5]">
                  <div className="text-center text-gray-500">
                    <div className="text-2xl mb-2">+{generatedImages.length - 8}</div>
                    <div className="text-sm">More images</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}