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
    text: `The only way to do great work is to love what you do.`,
    bgColor1: '#ff1744',
    bgColor2: '#3f51b5',
    textColor: '#ffffff',
    fontSize: 160  // Much bigger for Facebook native look
  })
  const [loading, setLoading] = useState(false)

  const generateImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setLoading(true)

    try {
      // Set canvas size for 4:5 ratio (Instagram/Facebook optimized)
      canvas.width = 1080
      canvas.height = 1350

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
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
      ctx.shadowBlur = 12
      ctx.shadowOffsetX = 3
      ctx.shadowOffsetY = 3

      // Facebook native style - MUCH wider margins for natural line breaks
      const paddingHorizontal = canvas.width * 0.25  // 25% padding on each side (was 7.5%)
      const paddingVertical = canvas.height * 0.2    // 20% padding top/bottom
      const maxWidth = canvas.width - (paddingHorizontal * 2)  // Much narrower text area
      const maxHeight = canvas.height - (paddingVertical * 2)
      
      let fontSize = formData.fontSize

      // Set initial font to measure text
      ctx.font = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`
      
      // Auto-wrap text into natural lines (Facebook style)
      const words = formData.text.split(' ')
      const lines = []
      let currentLine = ''
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const testWidth = ctx.measureText(testLine).width
        
        if (testWidth > maxWidth && currentLine !== '') {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      
      if (currentLine) {
        lines.push(currentLine)
      }
      
      // Calculate line height for Facebook native look
      let lineHeight = fontSize * 1.4  // More generous line spacing like Facebook
      let totalTextHeight = lines.length * lineHeight
      
      // Reduce font size if text is too tall (but keep it big)
      while (totalTextHeight > maxHeight && fontSize > 80) {  // Minimum 80px (still very big)
        fontSize -= 5
        lineHeight = fontSize * 1.4
        totalTextHeight = lines.length * lineHeight
        
        // Update font for measurements
        ctx.font = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`
        
        // Rewrap text with new font size
        const newLines = []
        let newCurrentLine = ''
        
        for (const word of words) {
          const testLine = newCurrentLine ? `${newCurrentLine} ${word}` : word
          const testWidth = ctx.measureText(testLine).width
          
          if (testWidth > maxWidth && newCurrentLine !== '') {
            newLines.push(newCurrentLine)
            newCurrentLine = word
          } else {
            newCurrentLine = testLine
          }
        }
        
        if (newCurrentLine) {
          newLines.push(newCurrentLine)
        }
        
        lines.splice(0, lines.length, ...newLines)
        totalTextHeight = lines.length * lineHeight
      }
      
      // Ensure minimum readable size (but keep it Facebook-native big)
      if (fontSize < 100) {
        fontSize = 100  // Still very large minimum
        lineHeight = fontSize * 1.4
        ctx.font = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`
      }
      
      // Recalculate total height with final font size
      totalTextHeight = lines.length * lineHeight
      
      // Center the text vertically
      const startY = (canvas.height - totalTextHeight) / 2 + lineHeight / 2

      // Draw each line with Facebook native styling
      lines.forEach((line, index) => {
        const y = startY + (index * lineHeight)
        ctx.fillText(line, canvas.width / 2, y)
      })

      // Get image data as WebP
      const dataUrl = canvas.toDataURL('image/webp', 0.92)
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
    link.download = `facebook_status_${Date.now()}.webp`
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
            Facebook Status Text:
          </label>
          <textarea
            rows={6}
            value={formData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            placeholder="Enter your Facebook status text here..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          <p className="text-sm text-gray-500 mt-2">
            💡 Text will automatically wrap into multiple lines like native Facebook posts
          </p>
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
            Font Size: {formData.fontSize}px (Facebook Native Style)
          </label>
          <input
            type="range"
            min="100"    // Much higher minimum for Facebook look
            max="250"    // Even higher maximum
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
            {loading ? 'Generating...' : 'Generate Facebook Status'}
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
            Creating Facebook native style...
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
