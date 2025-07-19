'use client'

import { useState } from 'react'
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

  const uploadAllToGCS = async () => {
    if (generatedImages.length === 0) {
      alert('No images to upload')
      return
    }

    setUploading(true)
    setUploadProgress({ current: 0, total: generatedImages.length })

    const uploadedResults = []

    for (let i = 0; i < generatedImages.length; i++) {
      const image = generatedImages[i]
      const fileName = `bulk_caption_${image.id}.webp`
      
      try {
        setUploadProgress({ current: i + 1, total: generatedImages.length })
        
        const result = await uploadToGCS(image.dataUrl, fileName)
        
        uploadedResults.push({
          ...image,
          gcsUrl: result.publicUrl,
          gcsPath: result.filePath,
          fileName: result.fileName
        })
        
        console.log(`Uploaded ${fileName} successfully`)
        
        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 300))
        
      } catch (error) {
        console.error(`Failed to upload ${fileName}:`, error)
        uploadedResults.push({
          ...image,
          gcsUrl: null,
          gcsPath: null,
          error: error.message
        })
      }
    }

    // Update the generated images with GCS URLs
    setGeneratedImages(uploadedResults)
    setUploading(false)
    
    const successCount = uploadedResults.filter(img => img.gcsUrl).length
    alert(`Upload complete! ${successCount}/${uploadedResults.length} images uploaded successfully.`)
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
    const headers = ['id', 'text', 'dataUrl', 'timestamp', 'gcsUrl']
    const csvData = [
      headers.join(','),
      ...generatedImages.map(img => [
        img.id,
        `"${img.text.replace(/"/g, '""')}"`,
        `"${img.dataUrl}"`,
        img.timestamp,
        img.gcsUrl || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `facebook_captions_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
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
        const backgroundIndex = i % facebookBackgrounds.length
        const background = facebookBackgrounds[backgroundIndex]
        
        const dataUrl = await generateCanvas(text, background, `canvas-${i}`)
        
        results.push({
          id: Date.now() + i,
          text: text,
          dataUrl: dataUrl,
          timestamp: new Date().toISOString(),
          backgroundIndex: backgroundIndex
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
          <Link 
            href="/" 
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            ← Back to Single
          </Link>
        </div>

        <BulkImporter 
          onDataImported={(data: any[]) => {
            setBulkData(data)
            setGeneratedImages([])
          }}
          importedData={bulkData}
          generatedImages={generatedImages} // Pass generated images for Content Studio export
        />

        {bulkData.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Ready to Process</h3>
            <p className="text-gray-600 mb-6">
              Found {bulkData.length} items ready for generation.
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
                {uploading ? `⬆️ Uploading... (${uploadProgress.current}/${uploadProgress.total})` : '☁️ Upload All to Cloud'}
              </button>
              
              <button 
                onClick={downloadAllImages}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                📥 Download All
              </button>
              
              <button 
                onClick={exportToCSV}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                📊 Export CSV
              </button>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-700 font-medium">Uploading to Google Cloud Storage...</span>
                  <span className="text-blue-600">{uploadProgress.current}/{uploadProgress.total}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Success/Error Summary */}
            {generatedImages.some(img => img.gcsUrl !== undefined) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="text-green-700">
                  <strong>Upload Results:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>✅ Successfully uploaded: {generatedImages.filter(img => img.gcsUrl).length}</li>
                    <li>❌ Failed uploads: {generatedImages.filter(img => img.gcsUrl === null).length}</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generatedImages.map((image, index) => (
                <div key={image.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={image.dataUrl} 
                    alt={`Generated caption ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {image.text.substring(0, 50)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                      {image.gcsUrl && (
                        <span className="text-xs text-green-600 font-semibold">☁️ Uploaded</span>
                      )}
                      {image.error && (
                        <span className="text-xs text-red-600 font-semibold">❌ Error</span>
                      )}
                    </div>
                    {image.gcsUrl && (
                      <a 
                        href={image.gcsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline block mt-1"
                      >
                        View in Cloud
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}