'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Users, Target, TrendingUp, Globe, Clock, Lightbulb, Zap } from 'lucide-react'

interface PageSuggestion {
  niche: string
  audience: string
  tone: string
  contentPillars: string[]
  postingTimes: string[]
  expectedEngagement: number
  competitorExample: string
  bgColor: string
}

const nicheSuggestions: Record<string, PageSuggestion> = {
  'family': {
    niche: 'Famille & Parentalité',
    audience: 'Parents 30-45 ans',
    tone: 'Authentique, Relatif, Émotionnel',
    contentPillars: ['Réalités parentales', 'Mariage', 'Nostalgie enfance', 'Équilibre vie/travail'],
    postingTimes: ['09:00', '13:00', '19:00'],
    expectedEngagement: 250,
    competitorExample: 'Momix en Famille style',
    bgColor: 'from-pink-500 to-purple-600'
  },
  'business': {
    niche: 'Business & Entrepreneurship',
    audience: 'Entrepreneurs 25-40 ans',
    tone: 'Inspirant, Direct, Ambitieux',
    contentPillars: ['Mindset entrepreneur', 'Conseils business', 'Success stories', 'Échecs & leçons'],
    postingTimes: ['07:00', '12:00', '17:00'],
    expectedEngagement: 180,
    competitorExample: 'Gary Vee, Tony Robbins style',
    bgColor: 'from-blue-500 to-indigo-600'
  },
  'lifestyle': {
    niche: 'Lifestyle & Bien-être',
    audience: 'Femmes 25-45 ans',
    tone: 'Inspirant, Positif, Bienveillant',
    contentPillars: ['Développement personnel', 'Bien-être', 'Relations', 'Mode de vie'],
    postingTimes: ['08:00', '14:00', '20:00'],
    expectedEngagement: 200,
    competitorExample: 'Influenceurs lifestyle',
    bgColor: 'from-green-500 to-teal-600'
  },
  'humor': {
    niche: 'Humour & Divertissement',
    audience: 'Millennials 25-40 ans',
    tone: 'Drôle, Sarcastique, Décalé',
    contentPillars: ['Humour quotidien', 'Observations sociales', 'Memes', 'Générations'],
    postingTimes: ['12:00', '17:00', '21:00'],
    expectedEngagement: 300,
    competitorExample: 'Pages memes populaires',
    bgColor: 'from-yellow-500 to-orange-600'
  },
  'motivation': {
    niche: 'Motivation & Inspiration',
    audience: 'Jeunes adultes 20-35 ans',
    tone: 'Motivant, Puissant, Encourageant',
    contentPillars: ['Citations motivantes', 'Success mindset', 'Dépassement de soi', 'Goals'],
    postingTimes: ['06:00', '12:00', '18:00'],
    expectedEngagement: 220,
    competitorExample: 'Pages motivation populaires',
    bgColor: 'from-red-500 to-pink-600'
  }
}

const languages = [
  { code: 'french', name: 'Français', flag: '🇫🇷' },
  { code: 'english', name: 'English', flag: '🇺🇸' },
  { code: 'spanish', name: 'Español', flag: '🇪🇸' },
  { code: 'italian', name: 'Italiano', flag: '🇮🇹' },
  { code: 'german', name: 'Deutsch', flag: '🇩🇪' }
]

const viralFormulas = [
  'AGE_PROGRESSION', 'BEFORE_AFTER', 'UNPOPULAR_OPINION', 'NOBODY_TELLS_YOU',
  'HARSH_REALITY', 'GENERATION_DIVIDE', 'SECRET_CONFESSION', 'LIFE_PHASES',
  'MONEY_TRUTH', 'RELATIONSHIP_REAL', 'FAMILY_REALITY', 'SUCCESS_PHASES'
]

export default function AddPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    niche: '',
    language: 'french',
    customNiche: '',
    avatar: '📱'
  })
  
  const [aiSuggestions, setAiSuggestions] = useState<PageSuggestion | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [step, setStep] = useState(1)

  const avatarOptions = [
    '👨‍👩‍👧‍👦', '👨‍👩‍👧', '👨‍👩‍👦‍👦', '💼', '🚀', '💡', '🎯', '📱', 
    '⭐', '🔥', '💎', '🏆', '💪', '🧠', '❤️', '✨', '🌟', '🎨'
  ]

  const handleNicheSelect = (niche: string) => {
    setFormData(prev => ({ ...prev, niche }))
    if (nicheSuggestions[niche]) {
      setAiSuggestions(nicheSuggestions[niche])
    }
  }

  const analyzeWithAI = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate custom suggestions based on description
    const suggestion: PageSuggestion = {
      niche: formData.customNiche || 'Niche personnalisé',
      audience: 'Audience ciblée basée sur votre description',
      tone: 'Tone adapté à votre contenu',
      contentPillars: ['Pilier 1', 'Pilier 2', 'Pilier 3', 'Pilier 4'],
      postingTimes: ['09:00', '14:00', '19:00'],
      expectedEngagement: Math.floor(Math.random() * 200) + 150,
      competitorExample: 'Analyse de concurrents similaires',
      bgColor: 'from-purple-500 to-pink-600'
    }
    
    setAiSuggestions(suggestion)
    setIsAnalyzing(false)
  }

  const handleSubmit = () => {
    // Save to localStorage
    const existingPages = JSON.parse(localStorage.getItem('facebook_pages') || '[]')
    
    const newPage = {
      id: `page-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      niche: aiSuggestions?.niche || formData.customNiche,
      audience: aiSuggestions?.audience || 'Audience générale',
      tone: aiSuggestions?.tone || 'Authentique',
      avatar: formData.avatar,
      performance: {
        avgEngagement: 0,
        totalPosts: 0,
        topFormulas: [],
        growth: 0
      },
      categories: [],
      settings: {
        language: formData.language,
        postingTimes: aiSuggestions?.postingTimes || ['09:00', '15:00', '20:00'],
        contentMix: { wisdom: 25, humor: 25, nostalgia: 25, motivation: 25 }
      }
    }
    
    const updatedPages = [...existingPages, newPage]
    localStorage.setItem('facebook_pages', JSON.stringify(updatedPages))
    
    // Redirect to dashboard
    window.location.href = '/dashboard'
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
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ✨ Add New Facebook Page
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                Create a new page profile with AI-powered optimization
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Target className="text-purple-600" />
              Basic Page Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Momix en Famille, Rise & Grind"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your page's content, target audience, and style..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setFormData(prev => ({ ...prev, language: lang.code }))}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.language === lang.code
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{lang.flag}</div>
                      <div className="text-sm font-medium">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Avatar
                </label>
                <div className="grid grid-cols-6 md:grid-cols-9 gap-3">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                      className={`p-3 rounded-xl border-2 transition-all text-2xl ${
                        formData.avatar === avatar
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.description}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next: Choose Niche
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Niche Selection */}
        {step === 2 && (
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="text-purple-600" />
              Select Your Niche
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(nicheSuggestions).map(([key, suggestion]) => (
                  <button
                    key={key}
                    onClick={() => handleNicheSelect(key)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      formData.niche === key
                        ? 'border-purple-500 bg-gradient-to-r ' + suggestion.bgColor + ' text-white'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xl font-bold ${formData.niche === key ? 'text-white' : 'text-gray-800'}`}>
                        {suggestion.niche}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.niche === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        ~{suggestion.expectedEngagement} eng.
                      </div>
                    </div>
                    <p className={`text-sm mb-3 ${formData.niche === key ? 'text-white/90' : 'text-gray-600'}`}>
                      {suggestion.audience}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestion.contentPillars.slice(0, 2).map((pillar) => (
                        <span
                          key={pillar}
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            formData.niche === key 
                              ? 'bg-white/20 text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {pillar}
                        </span>
                      ))}
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        formData.niche === key ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        +{suggestion.contentPillars.length - 2} more
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Niche Option */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="text-yellow-500" />
                  Custom Niche
                </h3>
                <p className="text-gray-600 mb-4">
                  Don't see your niche? Enter a custom description and let AI analyze it.
                </p>
                <input
                  type="text"
                  value={formData.customNiche}
                  onChange={(e) => setFormData(prev => ({ ...prev, customNiche: e.target.value, niche: 'custom' }))}
                  placeholder="ex: Food blogging, Tech reviews, Gaming..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                />
                <button
                  onClick={analyzeWithAI}
                  disabled={!formData.customNiche || isAnalyzing}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.niche}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next: Review & Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & AI Suggestions */}
        {step === 3 && (
          <div className="space-y-8">
            {/* AI Suggestions */}
            {aiSuggestions && (
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Sparkles className="text-purple-600" />
                  AI-Powered Suggestions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Users size={20} className="text-blue-600" />
                        <h3 className="font-semibold text-blue-800">Target Audience</h3>
                      </div>
                      <p className="text-blue-700">{aiSuggestions.audience}</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={20} className="text-purple-600" />
                        <h3 className="font-semibold text-purple-800">Content Tone</h3>
                      </div>
                      <p className="text-purple-700">{aiSuggestions.tone}</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={20} className="text-green-600" />
                        <h3 className="font-semibold text-green-800">Expected Engagement</h3>
                      </div>
                      <p className="text-green-700">{aiSuggestions.expectedEngagement} per post</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={20} className="text-yellow-600" />
                        <h3 className="font-semibold text-yellow-800">Optimal Posting Times</h3>
                      </div>
                      <div className="flex gap-2">
                        {aiSuggestions.postingTimes.map((time) => (
                          <span key={time} className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-lg text-sm font-medium">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-pink-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={20} className="text-pink-600" />
                        <h3 className="font-semibold text-pink-800">Content Pillars</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {aiSuggestions.contentPillars.map((pillar) => (
                          <span key={pillar} className="px-2 py-1 bg-pink-200 text-pink-800 rounded-lg text-sm font-medium">
                            {pillar}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe size={20} className="text-gray-600" />
                        <h3 className="font-semibold text-gray-800">Similar Style</h3>
                      </div>
                      <p className="text-gray-700">{aiSuggestions.competitorExample}</p>
                    </div>
                  </div>
                </div>

                {/* Recommended Viral Formulas */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Zap size={20} className="text-purple-600" />
                    Recommended Viral Formulas
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {viralFormulas.slice(0, 8).map((formula) => (
                      <span key={formula} className="px-3 py-1 bg-white text-gray-700 rounded-lg text-sm font-medium text-center">
                        {formula.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Page Preview */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Page Preview</h2>
              
              <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gray-50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{formData.avatar}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{formData.name}</h3>
                    <p className="text-gray-600">{formData.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {aiSuggestions?.niche || formData.customNiche}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {languages.find(l => l.code === formData.language)?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl">
                    <p className="text-sm font-medium text-gray-600">Expected Engagement</p>
                    <p className="text-2xl font-bold text-gray-800">{aiSuggestions?.expectedEngagement || 150}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl">
                    <p className="text-sm font-medium text-gray-600">Language</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {languages.find(l => l.code === formData.language)?.flag}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Sparkles size={20} />
                  Create Page & Start Generating
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}