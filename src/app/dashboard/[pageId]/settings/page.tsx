'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Settings, Globe, Clock, Target, Palette, Users, BarChart3 } from 'lucide-react'

interface FacebookPage {
  id: string
  name: string
  description: string
  niche: string
  audience: string
  tone: string
  avatar: string
  performance: {
    avgEngagement: number
    totalPosts: number
    topFormulas: string[]
    growth: number
  }
  categories: Array<{
    id: string
    name: string
    formulas: string[]
    performance: {
      engagement: number
      posts: number
    }
  }>
  settings: {
    language: string
    postingTimes: string[]
    contentMix: Record<string, number>
  }
}

const languages = [
  { code: 'french', name: 'Français', flag: '🇫🇷' },
  { code: 'english', name: 'English', flag: '🇺🇸' },
  { code: 'spanish', name: 'Español', flag: '🇪🇸' },
  { code: 'italian', name: 'Italiano', flag: '🇮🇹' },
  { code: 'german', name: 'Deutsch', flag: '🇩🇪' }
]

const avatarOptions = [
  '👨‍👩‍👧‍👦', '👨‍👩‍👧', '👨‍👩‍👦‍👦', '💼', '🚀', '💡', '🎯', '📱', 
  '⭐', '🔥', '💎', '🏆', '💪', '🧠', '❤️', '✨', '🌟', '🎨'
]

const predefinedTimes = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
]

const contentTypes = [
  { key: 'wisdom', name: 'Life Wisdom', icon: '🧠' },
  { key: 'humor', name: 'Humor', icon: '😂' },
  { key: 'nostalgia', name: 'Nostalgia', icon: '💭' },
  { key: 'motivation', name: 'Motivation', icon: '⚡' },
  { key: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
  { key: 'business', name: 'Business', icon: '💼' }
]

export default function PageSettings({ params }: { params: { pageId: string } }) {
  const [page, setPage] = useState<FacebookPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    loadPageData()
  }, [params.pageId])

  const loadPageData = () => {
    const savedPages = localStorage.getItem('facebook_pages')
    if (savedPages) {
      try {
        const pages: FacebookPage[] = JSON.parse(savedPages)
        const foundPage = pages.find(p => p.id === params.pageId)
        if (foundPage) {
          setPage(foundPage)
        } else {
          console.error('Page not found:', params.pageId)
        }
      } catch (error) {
        console.error('Error loading page data:', error)
      }
    }
    setIsLoading(false)
  }

  const savePage = async () => {
    if (!page) return

    setIsSaving(true)
    
    try {
      const savedPages = localStorage.getItem('facebook_pages')
      if (savedPages) {
        const pages: FacebookPage[] = JSON.parse(savedPages)
        const pageIndex = pages.findIndex(p => p.id === params.pageId)
        
        if (pageIndex !== -1) {
          pages[pageIndex] = page
          localStorage.setItem('facebook_pages', JSON.stringify(pages))
          
          // Show success message
          const successDiv = document.createElement('div')
          successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
          successDiv.textContent = '✅ Page settings saved successfully!'
          document.body.appendChild(successDiv)
          
          setTimeout(() => {
            document.body.removeChild(successDiv)
          }, 3000)
        }
      }
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Error saving page settings')
    }
    
    setIsSaving(false)
  }

  const deletePage = async () => {
    setIsSaving(true)
    
    try {
      const savedPages = localStorage.getItem('facebook_pages')
      if (savedPages) {
        const pages: FacebookPage[] = JSON.parse(savedPages)
        const filteredPages = pages.filter(p => p.id !== params.pageId)
        localStorage.setItem('facebook_pages', JSON.stringify(filteredPages))
        
        // Redirect to dashboard
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Error deleting page')
    }
    
    setIsSaving(false)
  }

  const updatePage = (updates: Partial<FacebookPage>) => {
    if (page) {
      setPage({ ...page, ...updates })
    }
  }

  const updateSettings = (updates: Partial<FacebookPage['settings']>) => {
    if (page) {
      setPage({
        ...page,
        settings: { ...page.settings, ...updates }
      })
    }
  }

  const togglePostingTime = (time: string) => {
    if (!page) return
    
    const currentTimes = page.settings.postingTimes || []
    const newTimes = currentTimes.includes(time)
      ? currentTimes.filter(t => t !== time)
      : [...currentTimes, time].sort()
    
    updateSettings({ postingTimes: newTimes })
  }

  const updateContentMix = (type: string, value: number) => {
    if (!page) return
    
    const newMix = { ...page.settings.contentMix, [type]: value }
    
    // Ensure total doesn't exceed 100%
    const total = Object.values(newMix).reduce((sum, val) => sum + val, 0)
    if (total <= 100) {
      updateSettings({ contentMix: newMix })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading page settings...</p>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
          <Link 
            href="/dashboard"
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/dashboard"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{page.avatar}</div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {page.name} Settings
                </h1>
                <p className="text-gray-600 text-lg mt-2">
                  Configure your page settings and preferences
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={savePage}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Trash2 size={20} />
              Delete Page
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          
          {/* Basic Information */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Settings className="text-purple-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
                <input
                  type="text"
                  value={page.name}
                  onChange={(e) => updatePage({ name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niche</label>
                <input
                  type="text"
                  value={page.niche}
                  onChange={(e) => updatePage({ niche: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={page.description}
                  onChange={(e) => updatePage({ description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <input
                  type="text"
                  value={page.audience}
                  onChange={(e) => updatePage({ audience: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Tone</label>
                <input
                  type="text"
                  value={page.tone}
                  onChange={(e) => updatePage({ tone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Avatar & Language */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Globe className="text-purple-600" />
              Avatar & Language
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Page Avatar</label>
                <div className="grid grid-cols-6 gap-3">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => updatePage({ avatar })}
                      className={`p-3 rounded-xl border-2 transition-all text-2xl ${
                        page.avatar === avatar
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => updateSettings({ language: lang.code })}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                        page.settings.language === lang.code
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Posting Schedule */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="text-purple-600" />
              Posting Schedule
            </h2>
            
            <p className="text-gray-600 mb-4">Select your optimal posting times:</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {predefinedTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => togglePostingTime(time)}
                  className={`p-3 rounded-xl border-2 transition-all font-medium ${
                    page.settings.postingTimes?.includes(time)
                      ? 'border-purple-500 bg-purple-500 text-white'
                      : 'border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-medium text-blue-800 mb-2">Selected Times:</h4>
              <p className="text-blue-700">
                {page.settings.postingTimes?.length > 0 
                  ? page.settings.postingTimes.join(', ')
                  : 'No times selected'
                }
              </p>
            </div>
          </div>

          {/* Content Mix */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Palette className="text-purple-600" />
              Content Mix
            </h2>
            
            <p className="text-gray-600 mb-4">Configure the percentage mix of different content types:</p>
            
            <div className="space-y-4">
              {contentTypes.map((type) => (
                <div key={type.key} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-32">
                    <span className="text-xl">{type.icon}</span>
                    <span className="font-medium">{type.name}</span>
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={page.settings.contentMix?.[type.key] || 0}
                      onChange={(e) => updateContentMix(type.key, parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="w-16 text-right font-medium">
                    {page.settings.contentMix?.[type.key] || 0}%
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className={`font-bold ${
                  Object.values(page.settings.contentMix || {}).reduce((sum, val) => sum + val, 0) === 100
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  {Object.values(page.settings.contentMix || {}).reduce((sum, val) => sum + val, 0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="text-purple-600" />
              Performance Summary
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">{page.performance.avgEngagement}</div>
                <div className="text-sm text-blue-700">Avg Engagement</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">{page.performance.totalPosts}</div>
                <div className="text-sm text-green-700">Total Posts</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">+{page.performance.growth}%</div>
                <div className="text-sm text-purple-700">Growth Rate</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600">{page.categories.length}</div>
                <div className="text-sm text-orange-700">Categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Delete Page</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{page.name}</strong>? This action cannot be undone.
                All categories and content associated with this page will be permanently removed.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deletePage}
                  disabled={isSaving}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Deleting...' : 'Delete Page'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}