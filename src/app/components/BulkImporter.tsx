'use client'

import { useState } from 'react'

interface BulkImporterProps {
  onDataImported: (data: any[]) => void
  importedData: any[]
  generatedImages?: any[] // Add this to receive generated images with GCS URLs
}

export default function BulkImporter({ onDataImported, importedData, generatedImages = [] }: BulkImporterProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [jsonData, setJsonData] = useState('')
  const [error, setError] = useState('')

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []

    // Parse headers
    const headerLine = lines[0]
    const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''))
    const data: any[] = []

    // Parse each data line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values: string[] = []
      let currentValue = ''
      let insideQuotes = false
      let j = 0
      
      while (j < line.length) {
        const char = line[j]
        
        if (char === '"') {
          insideQuotes = !insideQuotes
        } else if (char === ',' && !insideQuotes) {
          values.push(currentValue.trim())
          currentValue = ''
        } else {
          currentValue += char
        }
        j++
      }
      
      // Add the last value
      values.push(currentValue.trim())
      
      // Create row object
      const row: any = {}
      headers.forEach((header, index) => {
        let value = values[index] || ''
        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1)
        }
        row[header] = value
      })
      
      data.push(row)
    }

    return data
  }

  const handleCSVFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    setError('')

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string
        const data = parseCSV(csvText)
        
        if (data.length === 0) {
          throw new Error('No data found in the CSV file')
        }

        onDataImported(data)
      } catch (error: any) {
        setError(error.message)
      }
    }
    reader.readAsText(file)
  }

  const handleJSONData = () => {
    if (!jsonData.trim()) {
      setError('Please enter JSON data')
      return
    }

    try {
      const data = JSON.parse(jsonData)
      const arrayData = Array.isArray(data) ? data : [data]
      onDataImported(arrayData)
      setError('')
    } catch (error: any) {
      setError('Invalid JSON format: ' + error.message)
    }
  }

  // NEW: Export to Content Studio CSV format
  const exportToContentStudio = () => {
    if (generatedImages.length === 0) {
      alert('No generated images with GCS URLs found. Please generate and upload images first.')
      return
    }

    // Filter only successfully uploaded images
    const uploadedImages = generatedImages.filter(img => img.gcsUrl)
    
    if (uploadedImages.length === 0) {
      alert('No successfully uploaded images found. Please upload images to GCS first.')
      return
    }

    // Create Content Studio CSV format
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
    ]

    const csvRows = [headers.join(',')]

    uploadedImages.forEach((image) => {
      const row = [
        '', // Post date and time - empty for content categorization
        '', // Post caption - empty for now
        image.gcsUrl || '', // Image URLs - GCS public URL
        '', // Link - empty
        '', // First Comment - empty  
        'No', // Include Link in Caption
        '', // Video URL - empty
        'Feed', // Post Type - default to Feed
        '' // Title - empty
      ]
      csvRows.push(row.join(','))
    })

    // Create and download CSV file
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `content_studio_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)

    console.log(`Exported ${uploadedImages.length} images to Content Studio CSV format`)
  }

  const addSampleData = () => {
    const sampleData = [
      { text: "The best time to plant a tree was 20 years ago. The second best time is now." },
      { text: "Success is not final, failure is not fatal: It is the courage to continue that counts." },
      { text: "Be yourself; everyone else is already taken." },
      { text: "In the middle of difficulty lies opportunity." },
      { text: "The only way to do great work is to love what you do." },
      { text: "Life is what happens to you while you're busy making other plans." },
      { text: "The future belongs to those who believe in the beauty of their dreams." },
      { text: "It is during our darkest moments that we must focus to see the light." }
    ]
    
    onDataImported(sampleData)
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📥 Import Data</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CSV File Upload */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📄 CSV File</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload CSV File:
              </label>
              <div className="flex gap-3">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVFile}
                  className="flex-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                  onClick={() => {
                    const csvTemplate = `text
"The best time to plant a tree was 20 years ago. The second best time is now."
"Success is not final, failure is not fatal: It is the courage to continue that counts."
"Be yourself; everyone else is already taken."
"In the middle of difficulty lies opportunity."
"The only way to do great work is to love what you do."`
                    
                    const blob = new Blob([csvTemplate], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'facebook_captions_template.csv'
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                >
                  📥 Template
                </button>
              </div>
            </div>
            {csvFile && (
              <div className="text-green-700 text-sm bg-green-50 p-3 rounded-lg">
                ✅ File loaded: {csvFile.name}
              </div>
            )}
            <div className="text-xs text-gray-500 bg-white p-3 rounded-lg">
              <strong>Format:</strong> Just one column called <code>text</code><br/>
              <strong>Example:</strong> <code>"Your inspiring quote here"</code><br/>
              Click <strong>Template</strong> button to download example CSV file
            </div>
          </div>
        </div>

        {/* JSON Input */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔗 JSON Data</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paste JSON data:
              </label>
              <textarea
                rows={6}
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder={`[
  {"text": "Your first quote here"},
  {"text": "Your second quote here"},
  {"text": "Your third quote here"}
]`}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-mono text-sm"
              />
            </div>
            <button 
              onClick={handleJSONData}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Import JSON Data
            </button>
          </div>
        </div>
      </div>

      {/* Sample Data */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Quick Start</h3>
        <p className="text-gray-600 mb-4">Not ready with your data? Try with sample inspirational quotes:</p>
        <button 
          onClick={addSampleData}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          Load Sample Data (8 quotes)
        </button>
      </div>

      {/* Display imported data */}
      {importedData && importedData.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">✅ Data Imported Successfully</h3>
          <p className="text-lg text-gray-700 mb-4">
            <strong>{importedData.length} quotes</strong> ready for Facebook-style generation
          </p>
          
          <div className="bg-white rounded-xl p-4">
            <strong className="text-gray-700">Preview:</strong>
            <div className="mt-3 max-h-48 overflow-auto space-y-2">
              {importedData.slice(0, 5).map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
                  <span className="font-semibold text-blue-600">#{index + 1}:</span>{' '}
                  <span className="text-gray-700">
                    {(item.text || item.caption || 'No text').substring(0, 60)}...
                  </span>
                </div>
              ))}
              {importedData.length > 5 && (
                <div className="text-gray-500 italic text-sm">
                  ... and {importedData.length - 5} more quotes
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW: Content Studio Export Section */}
      {generatedImages.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📤 Export to Content Studio</h3>
          <p className="text-gray-700 mb-4">
            Export your generated images to Content Studio CSV format for social media scheduling.
          </p>
          
          <div className="bg-white rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-gray-700">Total Generated:</strong> {generatedImages.length}
              </div>
              <div>
                <strong className="text-gray-700">Successfully Uploaded:</strong>{' '}
                {generatedImages.filter(img => img.gcsUrl).length}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={exportToContentStudio}
              disabled={generatedImages.filter(img => img.gcsUrl).length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📊 Export to Content Studio CSV
            </button>
            
            <div className="text-xs text-gray-500 bg-white p-3 rounded-lg flex-1">
              <strong>Content Studio Format:</strong><br/>
              • Post caption left empty for manual entry<br/>
              • Image URLs from GCS uploads<br/>
              • Empty date/time for content categorization<br/>
              • Default post type: Feed
            </div>
          </div>
        </div>
      )}
    </div>
  )
}