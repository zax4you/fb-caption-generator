'use client'
import { useState } from 'react'
import Link from 'next/link'
import CanvasGenerator from './components/CanvasGenerator'

export default function Home() {
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 Caption Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered viral content generation for Facebook pages with multi-page management, 
            dynamic categories, and performance analytics
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">6+</div>
              <div className="text-sm text-blue-700">AI Models</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">12+</div>
              <div className="text-sm text-purple-700">Viral Formulas</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">289%</div>
              <div className="text-sm text-green-700">Avg Engagement</div>
            </div>
            <div className="bg-pink-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-pink-600">∞</div>
              <div className="text-sm text-pink-700">Content Ideas</div>
            </div>
          </div>
        </div>
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Dashboard - NEW PRIMARY OPTION */}
          <Link 
            href="/dashboard" 
            className="group bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-2xl font-bold mb-3">Dashboard</h3>
              <p className="text-white/90 mb-4">
                Manage multiple Facebook pages with AI-powered categories and analytics
              </p>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-sm opacity-90">🆕 Multi-Page Management</div>
                <div className="text-sm opacity-90">🎯 Dynamic Categories</div>
                <div className="text-sm opacity-90">📈 Performance Analytics</div>
              </div>
            </div>
          </Link>

          {/* AI Generator */}
          <Link 
            href="/ai-generator" 
            className="group bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="text-2xl font-bold mb-3">AI Generator</h3>
              <p className="text-white/90 mb-4">
                Generate viral captions with multiple AI models and proven formulas
              </p>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-sm opacity-90">✨ 6 AI Models</div>
                <div className="text-sm opacity-90">🔥 Viral Formulas</div>
                <div className="text-sm opacity-90">🧽 Clean Feature</div>
              </div>
            </div>
          </Link>
          
          {/* Bulk Generator */}
          <Link 
            href="/bulk" 
            className="group bg-gradient-to-br from-green-500 to-emerald-500 text-white p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Bulk Generator</h3>
              <p className="text-white/90 mb-4">
                Process multiple captions with GCS upload and Content Studio export
              </p>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-sm opacity-90">📄 CSV Import</div>
                <div className="text-sm opacity-90">☁️ GCS Upload</div>
                <div className="text-sm opacity-90">📊 Content Studio</div>
              </div>
            </div>
          </Link>
          
          {/* Single Caption */}
          <div className="group bg-gradient-to-br from-orange-500 to-red-500 text-white p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">✨</div>
              <h3 className="text-2xl font-bold mb-3">Single Caption</h3>
              <p className="text-white/90 mb-4">
                Create individual caption images with custom backgrounds
              </p>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="text-sm opacity-90">🎨 7 Backgrounds</div>
                <div className="text-sm opacity-90">📱 Facebook Style</div>
                <div className="text-sm opacity-90">💾 Instant Download</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🎯 Complete Viral Content Ecosystem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">AI-Powered Intelligence</h3>
              <p className="text-gray-600">
                Multiple AI models with research-backed viral formulas for maximum engagement
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Performance Driven</h3>
              <p className="text-gray-600">
                Track engagement, optimize content, and scale what works across multiple pages
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Production Ready</h3>
              <p className="text-gray-600">
                GCS upload, Content Studio export, and Facebook Performance Program integration
              </p>
            </div>
          </div>
        </div>
        
        {/* Single Caption Generator (Existing) */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            ✨ Quick Single Caption Generator
          </h2>
          
          <CanvasGenerator 
            onImageGenerated={(imageData) => {
              setGeneratedImages(prev => [...prev, imageData])
            }}
          />
        </div>
        
        {/* Generated Images Display */}
        {generatedImages.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              📸 Generated Images ({generatedImages.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((img, index) => (
                <div key={index} className="text-center bg-white rounded-2xl p-4 shadow-lg">
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
            
            <div className="text-center mt-8">
              <button 
                onClick={() => {
                  generatedImages.forEach((img, index) => {
                    const link = document.createElement('a')
                    link.download = `caption_${index + 1}.webp`
                    link.href = img.dataUrl
                    link.click()
                  })
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                📥 Download All Images
              </button>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            🚀 Transform your social media with AI-powered viral content generation
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Multi-Page Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/ai-generator" 
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              AI Content Generator
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/bulk" 
              className="text-green-600 hover:text-green-800 font-semibold"
            >
              Bulk Processing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}