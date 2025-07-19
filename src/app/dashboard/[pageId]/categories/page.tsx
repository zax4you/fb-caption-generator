'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Target, TrendingUp, Clock, Lightbulb, Zap, Plus, Calendar, BarChart3, Trash2, Edit } from 'lucide-react'

interface ContentCategory {
  id: string
  name: string
  topic: string
  emotion: string
  urgency: string
  formulas: string[]
  contentIdeas: string[]
  backgrounds: string[]
  performance: {
    engagement: number
    posts: number
    successRate: number
  }
  createdAt: string
}

const emotions = [
  { value: 'humorous', label: 'Humorous 😄', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'relatable', label: 'Relatable 🤝', color: 'bg-blue-100 text-blue-800' },
  { value: 'controversial', label: 'Controversial 🔥', color: 'bg-red-100 text-red-800' },
  { value: 'nostalgic', label: 'Nostalgic 💭', color: 'bg-purple-100 text-purple-800' },
  { value: 'inspiring', label: 'Inspiring ⭐', color: 'bg-green-100 text-green-800' },
  { value: 'emotional', label: 'Emotional ❤️', color: 'bg-pink-100 text-pink-800' }
]

const urgencyLevels = [
  { value: 'trending', label: 'Trending Now 🔥', color: 'bg-red-100 text-red-800' },
  { value: 'seasonal', label: 'Seasonal 🍂', color: 'bg-orange-100 text-orange-800' },
  { value: 'evergreen', label: 'Evergreen 🌲', color: 'bg-green-100 text-green-800' },
  { value: 'timely', label: 'Time-Sensitive ⏰', color: 'bg-yellow-100 text-yellow-800' }
]

const viralFormulas = [
  'AGE_PROGRESSION', 'BEFORE_AFTER', 'UNPOPULAR_OPINION', 'NOBODY_TELLS_YOU',
  'HARSH_REALITY', 'GENERATION_DIVIDE', 'SECRET_CONFESSION', 'LIFE_PHASES',
  'MONEY_TRUTH', 'RELATIONSHIP_REAL', 'FAMILY_REALITY', 'SUCCESS_PHASES'
]

const backgroundSuggestions = [
  { name: 'Purple-Pink', psychology: 'Family/emotional content' },
  { name: 'Pink-Blue', psychology: 'Dreams/aspirations' },
  { name: 'Cyan-Purple', psychology: 'Innovation/future' },
  { name: 'Dark', psychology: 'Serious/wisdom content' },
  { name: 'Solid Purple', psychology: 'Luxury/spiritual' },
  { name: 'Pink-Red', psychology: 'Passion/urgency' },
  { name: 'Yellow-Pink', psychology: 'Energy/motivation' }
]

const trendingTopics = [
  'retour à l\'école stress', 'télétravail réalité', 'ados comportement', 
  'inflation impact', 'réseaux sociaux fatigue', 'parenting 2025',
  'couple après enfants', 'burnout parental', 'generation gap tech',
  'housing crisis youth', 'dating apps reality', 'remote work loneliness'
]

export default function CategoryGenerator({ params }: { params: { pageId: string } }) {
  const [categories, setCategories] = useState<ContentCategory[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    emotion: '',
    urgency: ''
  })

  useEffect(() => {
    // Load categories from localStorage
    const savedCategories = localStorage.getItem(`categories_${params.pageId}`)
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
  }, [params.pageId])

  const generateCategory = async () => {
    if (!formData.topic || !formData.emotion || !formData.urgency) return

    setIsGenerating(true)

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Generate category based on inputs
    const newCategory: ContentCategory = {
      id: `category-${Date.now()}`,
      name: `${formData.topic.charAt(0).toUpperCase() + formData.topic.slice(1)} - ${emotions.find(e => e.value === formData.emotion)?.label.split(' ')[0]}`,
      topic: formData.topic,
      emotion: formData.emotion,
      urgency: formData.urgency,
      formulas: getRecommendedFormulas(formData.emotion, formData.urgency),
      contentIdeas: generateContentIdeas(formData.topic, formData.emotion),
      backgrounds: getRecommendedBackgrounds(formData.emotion),
      performance: {
        engagement: Math.floor(Math.random() * 200) + 150,
        posts: 0,
        successRate: Math.floor(Math.random() * 30) + 70
      },
      createdAt: new Date().toISOString()
    }

    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    localStorage.setItem(`categories_${params.pageId}`, JSON.stringify(updatedCategories))

    setIsGenerating(false)
    setShowForm(false)
    setFormData({ topic: '', emotion: '', urgency: '' })
  }

  const getRecommendedFormulas = (emotion: string, urgency: string) => {
    const formulaMap: Record<string, string[]> = {
      humorous: ['GENERATION_DIVIDE', 'UNPOPULAR_OPINION', 'BEFORE_AFTER'],
      relatable: ['AGE_PROGRESSION', 'NOBODY_TELLS_YOU', 'FAMILY_REALITY'],
      controversial: ['UNPOPULAR_OPINION', 'HARSH_REALITY', 'MONEY_TRUTH'],
      nostalgic: ['GENERATION_DIVIDE', 'LIFE_PHASES', 'SECRET_CONFESSION'],
      inspiring: ['SUCCESS_PHASES', 'BEFORE_AFTER', 'RELATIONSHIP_REAL'],
      emotional: ['FAMILY_REALITY', 'SECRET_CONFESSION', 'NOBODY_TELLS_YOU']
    }
    return formulaMap[emotion] || viralFormulas.slice(0, 3)
  }

  const generateContentIdeas = (topic: string, emotion: string) => {
    const baseIdeas = [
      `La vérité sur ${topic} que personne ne vous dit`,
      `À 20 ans vs à 40 ans: ${topic}`,
      `5 phases que tout le monde traverse avec ${topic}`,
      `Opinion impopulaire: ${topic}`,
      `Ce que ${topic} m'a appris sur la vie`
    ]
    return baseIdeas
  }

  const getRecommendedBackgrounds = (emotion: string) => {
    const backgroundMap: Record<string, string[]> = {
      humorous: ['Yellow-Pink', 'Pink-Blue', 'Cyan-Purple'],
      relatable: ['Purple-Pink', 'Pink-Blue', 'Dark'],
      controversial: ['Pink-Red', 'Dark', 'Solid Purple'],
      nostalgic: ['Purple-Pink', 'Cyan-Purple', 'Dark'],
      inspiring: ['Yellow-Pink', 'Cyan-Purple', 'Pink-Red'],
      emotional: ['Purple-Pink', 'Pink-Blue', 'Dark']
    }
    return backgroundMap[emotion] || ['Dark', 'Purple-Pink', 'Pink-Blue']
  }

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId)
    setCategories(updatedCategories)
    localStorage.setItem(`categories_${params.pageId}`, JSON.stringify(updatedCategories))
  }

  const generateContentFromCategory = (category: ContentCategory) => {
    // Redirect to AI generator with pre-filled category data
    const categoryData = encodeURIComponent(JSON.stringify({
      topic: category.topic,
      emotion: category.emotion,
      formulas: category.formulas,
      backgrounds: category.backgrounds
    }))
    window.location.href = `/ai-generator?category=${categoryData}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🎯 Content Categories
                </h1>
                <p className="text-gray-600 text-lg mt-2">
                  Generate infinite content categories with AI-powered formulas
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Category
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Categories</p>
                <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Content Ideas</p>
                <p className="text-3xl font-bold text-gray-800">
                  {categories.reduce((acc, cat) => acc + cat.contentIdeas.length, 0)}
                </p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Success Rate</p>
                <p className="text-3xl font-bold text-gray-800">
                  {categories.length > 0 ? Math.round(categories.reduce((acc, cat) => acc + cat.performance.successRate, 0) / categories.length) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Generated Posts</p>
                <p className="text-3xl font-bold text-gray-800">
                  {categories.reduce((acc, cat) => acc + cat.performance.posts, 0)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Trending Topics Suggestions */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🔥 Trending Topics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {trendingTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setFormData(prev => ({ ...prev, topic }))}
                className={`p-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                  formData.topic === topic
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white transform scale-105 shadow-lg'
                    : 'bg-gradient-to-r from-orange-100 to-red-100 text-gray-800 hover:from-orange-200 hover:to-red-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Click a trending topic to auto-fill the topic field below
          </p>
        </div>

        {/* Category Creation Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Sparkles className="text-purple-600" />
                Create New Content Category
              </h2>

              <div className="space-y-6">
                {/* Topic Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Topic *
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="ex: retour à l'école stress, teenage behavior, working from home"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Describe the main theme or topic for your content category
                  </p>
                </div>

                {/* Emotion Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Emotional Tone *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.value}
                        onClick={() => setFormData(prev => ({ ...prev, emotion: emotion.value }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.emotion === emotion.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-medium">{emotion.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Urgency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Content Urgency *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {urgencyLevels.map((urgency) => (
                      <button
                        key={urgency.value}
                        onClick={() => setFormData(prev => ({ ...prev, urgency: urgency.value }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.urgency === urgency.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-medium">{urgency.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {formData.topic && formData.emotion && formData.urgency && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-2">Preview</h3>
                    <div className="space-y-2">
                      <p><strong>Category:</strong> {formData.topic.charAt(0).toUpperCase() + formData.topic.slice(1)} - {emotions.find(e => e.value === formData.emotion)?.label.split(' ')[0]}</p>
                      <p><strong>Recommended Formulas:</strong> {getRecommendedFormulas(formData.emotion, formData.urgency).join(', ')}</p>
                      <p><strong>Backgrounds:</strong> {getRecommendedBackgrounds(formData.emotion).join(', ')}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateCategory}
                    disabled={!formData.topic || !formData.emotion || !formData.urgency || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Generate Category
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Category Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{category.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        emotions.find(e => e.value === category.emotion)?.color
                      }`}>
                        {emotions.find(e => e.value === category.emotion)?.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        urgencyLevels.find(u => u.value === category.urgency)?.color
                      }`}>
                        {urgencyLevels.find(u => u.value === category.urgency)?.label}
                      </span>
                    </div>
                    <p className="text-gray-600">Topic: <strong>{category.topic}</strong></p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-3 bg-blue-50 rounded-xl text-center">
                    <p className="text-sm font-medium text-blue-600">Expected Engagement</p>
                    <p className="text-xl font-bold text-blue-800">{category.performance.engagement}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl text-center">
                    <p className="text-sm font-medium text-green-600">Success Rate</p>
                    <p className="text-xl font-bold text-green-800">{category.performance.successRate}%</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl text-center">
                    <p className="text-sm font-medium text-purple-600">Posts Created</p>
                    <p className="text-xl font-bold text-purple-800">{category.performance.posts}</p>
                  </div>
                </div>

                {/* Viral Formulas */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Recommended Viral Formulas</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.formulas.map((formula) => (
                      <span 
                        key={formula}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                      >
                        {formula.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Ideas */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Content Ideas ({category.contentIdeas.length})</h4>
                  <div className="space-y-2">
                    {category.contentIdeas.slice(0, 3).map((idea, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-800">{idea}</p>
                      </div>
                    ))}
                    {category.contentIdeas.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">+{category.contentIdeas.length - 3} more ideas</p>
                    )}
                  </div>
                </div>

                {/* Background Suggestions */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Recommended Backgrounds</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.backgrounds.map((bg) => (
                      <span 
                        key={bg}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {bg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => generateContentFromCategory(category)}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <Zap size={16} />
                    Generate Content
                  </button>
                  
                  <Link 
                    href={`/dashboard/${params.pageId}/analytics?category=${category.id}`}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <BarChart3 size={16} />
                    Analytics
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Categories Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first content category to start generating viral content with AI-powered formulas.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Your First Category
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 py-8">
          <p className="text-white/80">
            🚀 Generate infinite content categories with AI-powered viral formulas
          </p>
        </div>
      </div>
    </div>
  )
}