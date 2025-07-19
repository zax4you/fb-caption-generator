'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Settings, BarChart3, Calendar, Sparkles, TrendingUp, Users, Target, Zap, Crown } from 'lucide-react'

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

const defaultPages: FacebookPage[] = [
  {
    id: 'momix-famille',
    name: 'Momix en Famille',
    description: 'Contenu viral pour parents français',
    niche: 'Famille & Parentalité',
    audience: 'Parents français 30-45 ans',
    tone: 'Authentique, Relatif, Émotionnel',
    avatar: '👨‍👩‍👧‍👦',
    performance: {
      avgEngagement: 289,
      totalPosts: 156,
      topFormulas: ['AGE_PROGRESSION', 'FAMILY_REALITY', 'NOBODY_TELLS_YOU'],
      growth: 23
    },
    categories: [
      {
        id: 'french-parenting-2025',
        name: 'Réalités de la Parentalité',
        formulas: ['AGE_PROGRESSION', 'NOBODY_TELLS_YOU'],
        performance: { engagement: 267, posts: 25 }
      },
      {
        id: 'marriage-truth',
        name: 'Vérités du Mariage',
        formulas: ['BEFORE_AFTER', 'HARSH_REALITY'],
        performance: { engagement: 312, posts: 18 }
      }
    ],
    settings: {
      language: 'french',
      postingTimes: ['09:00', '13:00', '19:00'],
      contentMix: { wisdom: 40, humor: 30, nostalgia: 20, motivation: 10 }
    }
  },
  {
    id: 'english-motivation',
    name: 'Rise & Grind',
    description: 'Motivational content for entrepreneurs',
    niche: 'Business & Motivation',
    audience: 'Entrepreneurs 25-40 ans',
    tone: 'Inspirant, Direct, Ambitieux',
    avatar: '🚀',
    performance: {
      avgEngagement: 145,
      totalPosts: 89,
      topFormulas: ['UNPOPULAR_OPINION', 'MONEY_TRUTH', 'SUCCESS_PHASES'],
      growth: 18
    },
    categories: [
      {
        id: 'entrepreneur-mindset',
        name: 'Entrepreneur Mindset',
        formulas: ['UNPOPULAR_OPINION', 'HARSH_REALITY'],
        performance: { engagement: 189, posts: 15 }
      }
    ],
    settings: {
      language: 'english',
      postingTimes: ['07:00', '12:00', '17:00'],
      contentMix: { motivation: 50, business: 30, mindset: 20 }
    }
  }
]

export default function Dashboard() {
  const [pages, setPages] = useState<FacebookPage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load pages from localStorage or use defaults
    const savedPages = localStorage.getItem('facebook_pages')
    if (savedPages) {
      setPages(JSON.parse(savedPages))
    } else {
      setPages(defaultPages)
      localStorage.setItem('facebook_pages', JSON.stringify(defaultPages))
    }
    setIsLoading(false)
  }, [])

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 250) return 'text-green-600 bg-green-50'
    if (engagement >= 150) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getGrowthColor = (growth: number) => {
    if (growth >= 20) return 'text-green-600'
    if (growth >= 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📊 Content Dashboard
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                Manage your Facebook pages and viral content generation
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/dashboard/add-page"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              >
                <Plus size={20} />
                Add New Page
              </Link>
              
              <Link 
                href="/ai-generator"
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold border-2 border-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              >
                <Sparkles size={20} />
                AI Generator
              </Link>
              
              <Link 
                href="/bulk"
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              >
                <Zap size={20} />
                Bulk Generator
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Pages</p>
                <p className="text-3xl font-bold text-gray-800">{pages.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Posts</p>
                <p className="text-3xl font-bold text-gray-800">
                  {pages.reduce((acc, page) => acc + page.performance.totalPosts, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Engagement</p>
                <p className="text-3xl font-bold text-gray-800">
                  {Math.round(pages.reduce((acc, page) => acc + page.performance.avgEngagement, 0) / pages.length)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {pages.map((page) => (
            <div key={page.id} className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Page Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{page.avatar}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{page.name}</h3>
                    <p className="text-gray-600">{page.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {page.niche}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {page.settings.language}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    href={`/dashboard/${page.id}/settings`}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Settings size={20} />
                  </Link>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-xl ${getEngagementColor(page.performance.avgEngagement)}`}>
                  <p className="text-sm font-medium opacity-80">Avg Engagement</p>
                  <p className="text-2xl font-bold">{page.performance.avgEngagement}</p>
                  <p className="text-xs opacity-60">per post</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className={`text-2xl font-bold ${getGrowthColor(page.performance.growth)}`}>
                    +{page.performance.growth}%
                  </p>
                  <p className="text-xs text-gray-500">this month</p>
                </div>
              </div>

              {/* Top Formulas */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Top Performing Formulas</h4>
                <div className="flex flex-wrap gap-2">
                  {page.performance.topFormulas.map((formula, index) => (
                    <span 
                      key={formula}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-gold-100 text-gold-800 border border-gold-200' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {index === 0 && <Crown size={12} className="inline mr-1" />}
                      {formula.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Active Categories ({page.categories.length})</h4>
                <div className="space-y-2">
                  {page.categories.slice(0, 2).map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{category.name}</p>
                        <p className="text-xs text-gray-600">{category.performance.posts} posts</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{category.performance.engagement}</p>
                        <p className="text-xs text-gray-600">avg engagement</p>
                      </div>
                    </div>
                  ))}
                  {page.categories.length > 2 && (
                    <p className="text-xs text-gray-500 text-center">+{page.categories.length - 2} more categories</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <Link 
                  href={`/dashboard/${page.id}/categories`}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  Generate
                </Link>
                
                <Link 
                  href={`/dashboard/${page.id}/analytics`}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <BarChart3 size={16} />
                  Analytics
                </Link>
                
                <Link 
                  href={`/dashboard/${page.id}/calendar`}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  Calendar
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {pages.length === 0 && (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl text-center">
            <div className="text-6xl mb-6">📱</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Facebook Pages Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by adding your first Facebook page to begin generating viral content with AI.
            </p>
            <Link 
              href="/dashboard/add-page"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Your First Page
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 py-8">
          <p className="text-white/80">
            🚀 Transform your social media with AI-powered viral content generation
          </p>
        </div>
      </div>
    </div>
  )
}