'use client'
import { useState } from 'react'
import Link from 'next/link'
import CanvasGenerator from './components/CanvasGenerator'

export default function Home() {
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🚀 Caption Generator
        </h1>
        
        <div className="text-center mb-8 space-x-4">
          <Link 
            href="/bulk" 
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
          >
            📊 Bulk Generation
          </Link>
          
          <Link 
            href="/ai-generator" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            🤖 AI Text Generator
          </Link>
          
          <button className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            ✨ Single Caption
          </button>
        </div>
        
        <CanvasGenerator 
          onImageGenerated={(imageData) => {
            setGeneratedImages(prev => [...prev, imageData])
          }}
        />
        
        {generatedImages.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              📸 Generated Images ({generatedImages.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedImages.map((img, index) => (
                <div key={index} className="text-center">
                  <img 
                    src={img.dataUrl} 
                    alt={`Generated ${index + 1}`}
                    className="w-full max-w-sm mx-auto rounded-xl shadow-lg mb-3"
                  />
                  <div className="text-sm text-gray-600">
                    {img.text.substring(0, 50)}...
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <button 
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  const csvData = generatedImages.map((img, index) => ({
                    id: index + 1,
                    caption: img.text,
                    image_url: `generated_${index + 1}.png`,
                    platform: 'instagram',
                    format: '4:5'
                  }))
                  
                  const csv = [
                    'id,caption,image_url,platform,format',
                    ...csvData.map(row => 
                      `${row.id},"${row.caption.replace(/"/g, '""')}",${row.image_url},${row.platform},${row.format}`
                    )
                  ].join('\n')
                  
                  const blob = new Blob([csv], { type: 'text/csv' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'content_studio_export.csv'
                  a.click()
                }}
              >
                📥 Download CSV for Content Studio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}