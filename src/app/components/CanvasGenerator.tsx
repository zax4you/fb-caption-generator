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
    text: `Your job as a parent is to teach your kids how to deal with disappointment, not to keep them from it.`,
    bgColor1: '#ff1744',
    bgColor2: '#3f51b5',
    textColor: '#ffffff',
    fontSize: 160
  })
  const [loading, setLoading] = useState(false)

  const generateImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setLoading(true)

    try {
      // Set canvas size for 4:5 ratio
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

      // Add text shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
      ctx.shadowBlur = 12
      ctx.shadowOffsetX = 3
      ctx.shadowOffsetY = 3

      // MUCH BIGGER MARGINS - Make text area much narrower
      const paddingHorizontal = canvas.width * 0.35  // 35% padding each side (was 25%)
      const paddingVertical = canvas.height * 0.2    // 20% padding top/bottom
      const maxWidth = canvas.width - (paddingHorizontal * 2)  // Much narrower text area
      const maxHeight = canvas.height - (paddingVertical * 2)
      
      let fontSize = formData.fontSize

      // Set initial font
      ctx.font = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`
      
      // Force text into more lines with narrower width
      const words = formData.text.split(' ')
      const lines = []
      let currentLine = ''
      
      // More aggressive line breaking for Facebook style
      for (let i = 0; i < words.length; i++) {
        const word = words[i]
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const testWidth = ctx.measureText(testLine).width
        
        // Break lines more frequently for better flow
        if (testWidth > maxWidth && currentLine !== '') {
          lines.push(currentLine.trim())
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      
      if (currentLine.trim()) {
        lines.push(currentLine.trim())
      }
      
      // Calculate spacing - more generous for Facebook look
      let lineHeight = fontSize * 1.5  // Even more line spacing
      let totalTextHeight = lines.length * lineHeight
      
      // Reduce font size if needed, but keep it large
      let attempts = 0
      while (totalTextHeight > maxHeight && fontSize > 80 && attempts < 10) {
        fontSize -= 8  // Bigger reduction steps
        lineHeight = fontSize * 1.5
        totalTextHeight = lines.length * lineHeight
        
        // Update font and recalculate lines
        ctx.font = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`
        
        // Recalculate line breaks with new font size
        const newLines = []
        let newCurrentLine = ''
        
        for (const word of words) {
          const testLine = newCurrentLine ? `${newCurrentLine} ${word}` : word
          const testWidth = ctx.measureText(testLine).width
          
          if (testWidth > maxWidth && newCurrentLine !== '') {
            newLines.push(newCurrentLine.trim())
            newCurrentLine = word
          } else {
            newCurrentLine = testLine
          }
        }
        
        if (newCurrentLine.trim()) {
          newLines.push(newCurrentLine.trim())
        }
        
        lines.splice(0, lines.length, ...newLines)
        totalTextHeight = lines.length * lineHeight
        attempts++
      }
      
      // Ensure minimum size but still Facebook-native large
      if (fontSize < 100) {
        fontSize = 100
        lineHeight = fontSize * 1.5
        ctx.font = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`
      }
      
      // Final height calculation
      totalTextHeight = lines.length * lineHeight
      
      // Center text vertically
      const startY = (canvas.height - totalTextHeight) / 2 + lineHeight / 2

      // Draw each line
      lines.forEach((line, index) => {
        const y = startY + (index * lineHeight)
        ctx.fillText(line, canvas.width / 2, y)
      })

      // Get image data
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
            💡 Text will break into many lines with big side margins (Facebook native style)
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
            Font Size: {formData.fontSize}px (Narrow Facebook Style)
          </label>
          <input
            type="range"
            min="100"
            max="250"
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
            Creating narrow Facebook style...
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
