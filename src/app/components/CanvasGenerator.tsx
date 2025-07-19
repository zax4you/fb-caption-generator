'use client'

import { useState, useRef } from 'react'

interface GeneratedImage {
  dataUrl: string
  text: string
  timestamp: string
}

interface CanvasGeneratorProps {
  onImageGenerated?: (imageData: GeneratedImage) => void
}

export default function CanvasGenerator({ onImageGenerated }: CanvasGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [formData, setFormData] = useState({
    text: `On vous offre 1 million,\nmais vous ne pourrez plus\njamais boire de café.\nPouvez-vous le faire ?`,
    bgColor1: '#ff1744',
    bgColor2: '#3f51b5',
    textColor: '#ffffff',
    fontSize: 80
  })
  const [loading, setLoading] = useState(false)

  const generateImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setLoading(true)

    try {
      // Set canvas size for 4:5 ratio (Instagram post)
      canvas.width = 800
      canvas.height = 1000

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, formData.bgColor1)
      gradient.addColorStop(1, formData.bgColor2)

      // Fill background
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties
      ctx.fillStyle = formData.textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Add text shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      // Auto-fit text logic (improved)
      const lines = formData.text.split('\n')
      const maxWidth = canvas.width * 0.85  // Slightly more space
      const maxHeight = canvas.height * 0.75 // More vertical space
      
      let fontSize = formData.fontSize
      
      // For long single-line text, try to break it into multiple lines first
      if (lines.length === 1 && lines[0].length > 40) {
        const words = lines[0].split(' ')
        const newLines = []
        let currentLine = ''
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          ctx.font = `bold ${fontSize}px Arial, sans-serif`
          
          if (ctx.measureText(testLine).width <= maxWidth || currentLine === '') {
            currentLine = testLine
          } else {
            newLines.push(currentLine)
            currentLine = word
          }
        }
        if (currentLine) {
          newLines.push(currentLine)
        }
        
        // Update lines with the wrapped version
        if (newLines.length > 1) {
          lines.splice(0, 1, ...newLines)
        }
      }
      
      let lineHeight = fontSize * 1.3  // Slightly more line spacing
      let totalTextHeight = lines.length * lineHeight
      
      // Reduce font size if text is too tall
      while (totalTextHeight > maxHeight && fontSize > 30) {  // Minimum size increased to 30
        fontSize -= 3  // Reduce by 3 instead of 2 for faster adjustment
        lineHeight = fontSize * 1.3
        totalTextHeight = lines.length * lineHeight
      }
      
      // Check if any line is too wide
      ctx.font = `bold ${fontSize}px Arial, sans-serif`
      let maxLineWidth = 0
      
      for (const line of lines) {
        const lineWidth = ctx.measureText(line).width
        if (lineWidth > maxLineWidth) {
          maxLineWidth = lineWidth
        }
      }
      
      // Reduce font size if text is too wide
      while (maxLineWidth > maxWidth && fontSize > 30) {
        fontSize -= 3
        lineHeight = fontSize * 1.3
        ctx.font = `bold ${fontSize}px Arial, sans-serif`
        
        maxLineWidth = 0
        for (const line of lines) {
          const lineWidth = ctx.measureText(line).width
          if (lineWidth > maxLineWidth) {
            maxLineWidth = lineWidth
          }
        }
      }
      
      // Ensure minimum readable size
      if (fontSize < 40) {
        fontSize = 40
        lineHeight = fontSize * 1.3
        ctx.font = `bold ${fontSize}px Arial, sans-serif`
      }
      
      // Recalculate total height with final font size
      totalTextHeight = lines.length * lineHeight
      
      // Center the text vertically
      const startY = (canvas.height - totalTextHeight) / 2 + lineHeight / 2

      // Draw each line
      lines.forEach((line, index) => {
        const y = startY + (index * lineHeight)
        ctx.fillText(line, canvas.width / 2, y)
      })

      // Get image data as WebP (better compression, good quality)
      const dataUrl = canvas.toDataURL('image/webp', 0.92) // 92% quality for optimal balance
      if (onImageGenerated) {
        onImageGenerated({
          dataUrl,
          text: formData.text,
          timestamp: new Date().toISOString()
        })
      }

    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const link = document.createElement('a')
    link.download = `caption_${Date.now()}.webp`
    link.href = canvas.toDataURL('image/webp', 0.92)
    link.click()
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Caption Text:
          </label>
          <textarea
            rows={6}
            value={formData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            placeholder="Enter your caption text here..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Background Color 1:
          </label>
          <input
            type="color"
            value={formData.bgColor1}
            onChange={(e) => handleInputChange('bgColor1', e.target.value)}
            className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Background Color 2:
          </label>
          <input
            type="color"
            value={formData.bgColor2}
            onChange={(e) => handleInputChange('bgColor2', e.target.value)}
            className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Text Color:
          </label>
          <input
            type="color"
            value={formData.textColor}
            onChange={(e) => handleInputChange('textColor', e.target.value)}
            className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Font Size: {formData.fontSize}px
          </label>
          <input
            type="range"
            min="40"
            max="120"
            value={formData.fontSize}
            onChange={(e) => handleInputChange('fontSize', parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <button 
            onClick={generateImage}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
          <button 
            onClick={downloadImage}
            className="flex-1 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            Download WebP
          </button>
        </div>
      </div>

      <div className="text-center">
        {loading && (
          <div className="flex items-center justify-center mb-4 text-blue-600 font-semibold">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            Generating your image...
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="max-w-full h-auto border-2 border-gray-200 rounded-xl shadow-lg"
        />
      </div>
    </div>
  )
}