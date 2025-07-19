'use client'

import React, { useState } from 'react';
import { Wand2, Copy, RefreshCw, Settings, Target, Globe, Brain, Zap, Check, Lightbulb } from 'lucide-react';

const AICaptionGenerator = () => {
  const [selectedPage, setSelectedPage] = useState('momix-famille');
  const [selectedCategory, setSelectedCategory] = useState('family-relationships');
  const [customTopic, setCustomTopic] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(''); // 🔒 SECURE: Empty by default
  const [showSettings, setShowSettings] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Page profiles based on your research
  const pageProfiles = {
    'momix-famille': {
      name: 'Momix en Famille',
      language: 'French',
      niche: 'Family & Parenting',
      audience: 'French adults 35-55, family-oriented',
      demographics: '84.5% France, 68% ages 35-54, balanced gender',
      tone: 'Warm, authentic, relatable',
      peakTimes: 'Tuesday-Thursday, consistent all week',
      topPerformers: 'Text-on-image posts (95%), emotional stories, family wisdom'
    },
    'english-motivation': {
      name: 'English Motivation',
      language: 'English',
      niche: 'Motivation & Success',
      audience: 'English speakers 25-45, ambitious',
      demographics: 'Global English, career-focused',
      tone: 'Inspiring, direct, powerful',
      peakTimes: 'Monday mornings, Wednesday evenings',
      topPerformers: 'Success stories, quotes, transformation posts'
    }
  };

  // Categories with viral formulas from your research
  const categories = {
    'family-relationships': {
      name: '👨‍👩‍👧‍👦 Family & Relationships',
      description: 'Parent struggles, marriage wisdom, family bonds',
      backgrounds: ['Purple-Pink', 'Pink-Blue', 'Cyan-Purple']
    },
    'life-wisdom': {
      name: '🧠 Life Wisdom',
      description: 'Age revelations, life truths, personal growth',
      backgrounds: ['Dark', 'Solid Purple', 'Cyan-Purple']
    },
    'motivation-success': {
      name: '⚡ Motivation & Success',
      description: 'Dreams, second chances, transformation stories',
      backgrounds: ['Yellow-Pink', 'Cyan-Purple', 'Pink-Red']
    },
    'nostalgia-memory': {
      name: '💭 Nostalgia & Memory',
      description: 'Childhood memories, time passage, "remember when"',
      backgrounds: ['Purple-Pink', 'Cyan-Purple', 'Pink-Blue']
    },
    'humor-social': {
      name: '😂 Humor & Social Commentary',
      description: 'Technology struggles, modern parenting, generational gaps',
      backgrounds: ['Pink-Red', 'Pink-Blue', 'Yellow-Pink']
    },
    'mixed-viral': {
      name: '🔥 Mixed Viral Content',
      description: 'Combination of all categories for maximum variety',
      backgrounds: ['All backgrounds randomly assigned']
    }
  };

  // Viral formulas based on your 289% engagement research
  const getViralPrompt = (pageId, categoryId, topic = '', quantity) => {
    const page = pageProfiles[pageId];
    const category = categories[categoryId];
    
    let categoryPrompt = '';
    if (categoryId === 'mixed-viral') {
      categoryPrompt = `Generate a MIX of all content types:
- Family & Relationships (parent struggles, marriage wisdom)
- Life Wisdom (age revelations, personal growth)  
- Motivation & Success (dreams, transformation)
- Nostalgia & Memory (childhood memories, "remember when")
- Humor & Social Commentary (technology struggles, modern parenting)

Distribute evenly across all categories for maximum variety.`;
    } else {
      categoryPrompt = `CATEGORY: ${category.name} - ${category.description}`;
    }
    
    const basePrompt = `You are creating SHORT TEXT CONTENT for Facebook image posts for ${page.name}.

AUDIENCE PROFILE:
- ${page.audience}
- Demographics: ${page.demographics}
- Language: ${page.language}
- Tone: ${page.tone}

CONTENT REQUIREMENTS:
Generate ${quantity} pieces of SHORT TEXT CONTENT for images (NOT captions).
Each text should be 5-15 words maximum - perfect for image overlay.

${categoryPrompt}
${topic ? `SPECIFIC TOPIC: ${topic}` : ''}

VIRAL TEXT FORMULAS:
- Age-specific statements: "À 40 ans, j'ai compris..."
- Universal truths: "L'amour, ce n'est pas..."
- Questions: "Qui se souvient...?"
- Confessions: "Personne ne m'avait dit..."
- Wisdom: "La vie m'a appris..."
- Contrarian: "Tout le monde pense... mais en réalité..."

FORMAT YOUR RESPONSE EXACTLY AS:
TEXT 1: [5-15 words]
BACKGROUND: [suggested background color]

TEXT 2: [5-15 words]  
BACKGROUND: [suggested background color]

Continue for all ${quantity} texts.

Make each text emotionally powerful, relatable to ${page.audience}, and perfect for sharing.`;

    return basePrompt;
  };

  const generateCaptions = async () => {
    if (!apiKey) {
      alert('Please enter your OpenRouter API key in settings');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent([]);

    try {
      const prompt = getViralPrompt(selectedPage, selectedCategory, customTopic, quantity);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'FB Caption Generator'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the structured response
      const textMatches = content.match(/TEXT \d+:\s*([^\n]+)\s*BACKGROUND:\s*([^\n]+)/gi);
      
      if (textMatches) {
        const parsedContent = textMatches.map((match, index) => {
          const lines = match.split('\n');
          const textLine = lines.find(line => line.includes('TEXT'));
          const backgroundLine = lines.find(line => line.includes('BACKGROUND'));
          
          const text = textLine ? textLine.replace(/TEXT \d+:\s*/, '').trim() : `Generated text ${index + 1}`;
          const background = backgroundLine ? backgroundLine.replace(/BACKGROUND:\s*/, '').trim() : 'Purple-Pink';
          
          return {
            id: index + 1,
            text: text.replace(/["""]/g, '').trim(),
            background: background
          };
        });
        
        setGeneratedContent(parsedContent);
      } else {
        // Fallback parsing if format is different
        const lines = content.split('\n').filter(line => line.trim().length > 5);
        const fallbackContent = lines.slice(0, quantity).map((line, index) => ({
          id: index + 1,
          text: line.trim().replace(/^\d+\.\s*/, '').replace(/["""]/g, ''),
          background: categories[selectedCategory]?.backgrounds[index % categories[selectedCategory]?.backgrounds.length] || 'Purple-Pink'
        }));
        
        setGeneratedContent(fallbackContent);
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Error generating content. Check your API key and try again.');
    }

    setIsGenerating(false);
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const sendToBulkGenerator = () => {
    if (generatedContent.length === 0) {
      alert('No content to send. Generate some texts first!');
      return;
    }

    // Format data for bulk generator
    const bulkData = generatedContent.map((content, index) => ({
      text: content.text,
      background: content.background,
      id: index + 1
    }));

    // Store in localStorage for bulk generator to pickup
    localStorage.setItem('aiGeneratedTexts', JSON.stringify(bulkData));
    
    // Redirect to bulk generator
    window.location.href = '/bulk?source=ai-generator';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 AI Image Text Generator
          </h1>
          <p className="text-lg text-gray-600">
            Research-backed short texts for maximum Performance Program earnings
          </p>
        </div>

        {/* API Key Required Notice */}
        {!apiKey && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-yellow-800 mb-2">🔑 API Key Required</h4>
            <p className="text-sm text-yellow-700 mb-2">
              To use the AI generator, you need an OpenRouter API key:
            </p>
            <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
              <li>Go to <a href="https://openrouter.ai/keys" target="_blank" className="text-blue-600 underline">openrouter.ai/keys</a></li>
              <li>Create a free account and generate an API key</li>
              <li>Click the Settings ⚙️ button to enter your key</li>
              <li>Start generating viral content!</li>
            </ol>
            <p className="text-xs text-yellow-600 mt-2">
              💡 Your key is stored locally and never shared
            </p>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">⚙️ API Settings</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your API key from <a href="https://openrouter.ai" target="_blank" className="text-blue-500">openrouter.ai</a>
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Configuration</h2>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              {/* Page Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Select Page Profile
                </label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(pageProfiles).map(([id, profile]) => (
                    <option key={id} value={id}>
                      {profile.name} ({profile.language})
                    </option>
                  ))}
                </select>
                
                {/* Page Info */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="text-gray-700">
                    <strong>Audience:</strong> {pageProfiles[selectedPage]?.audience}<br/>
                    <strong>Demographics:</strong> {pageProfiles[selectedPage]?.demographics}<br/>
                    <strong>Tone:</strong> {pageProfiles[selectedPage]?.tone}
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Content Category
                </label>
                <div className="space-y-2">
                  {Object.entries(categories).map(([id, category]) => (
                    <label key={id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={id}
                        checked={selectedCategory === id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                        <div className="text-xs text-blue-500 mt-1">
                          Backgrounds: {category.backgrounds.join(', ')}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Brain className="w-4 h-4 inline mr-1" />
                  Number of Texts to Generate
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  placeholder="Enter number (1-50)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 5-20 texts for optimal variety
                </p>
              </div>

              {/* Custom Topic */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  Custom Topic (Optional)
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., 'teenage kids and technology'"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateCaptions}
                disabled={isGenerating || !apiKey}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Image Texts
                  </>
                )}
              </button>

              {!apiKey && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  Configure API key in settings to generate image texts
                </p>
              )}
            </div>
          </div>

          {/* Right Panel - Generated Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                <Zap className="w-5 h-5 inline mr-2" />
                Generated Image Texts
              </h2>

              {generatedContent.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Wand2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Configure your settings and generate image texts</p>
                  <p className="text-sm">Based on 289% engagement research data</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {generatedContent.map((content, index) => (
                    <div key={content.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                            Text {content.id}
                          </span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-sm">
                            {content.background} Background
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(content.text, content.id)}
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === content.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <div className="text-gray-800 font-bold text-lg leading-relaxed text-center">
                          "{content.text}"
                        </div>
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(content.text, content.id)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:shadow-md transition-all duration-300 font-medium flex items-center justify-center gap-2"
                      >
                        {copiedIndex === content.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Text
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                  
                  {/* Send to Bulk Generator Button */}
                  <div className="text-center pt-6 border-t border-gray-200">
                    <button
                      onClick={sendToBulkGenerator}
                      className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
                    >
                      <Zap className="w-6 h-6" />
                      Send All to Bulk Generator →
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      Generate images for all {generatedContent.length} texts at once
                    </p>
                  </div>
                  
                  <div className="text-center pt-4">
                    <button
                      onClick={generateCaptions}
                      disabled={isGenerating}
                      className="bg-gray-100 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Generate New Variations
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">🔗 AI → Bulk Generator Workflow</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-bold text-gray-800">1. Generate AI Texts</div>
              <div className="text-sm text-gray-600">Create viral content with research-backed prompts</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-bold text-gray-800">2. Send to Bulk</div>
              <div className="text-sm text-gray-600">Auto-transfer all texts to bulk generator</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">📸</div>
              <div className="font-bold text-gray-800">3. Generate Images</div>
              <div className="text-sm text-gray-600">Create all images with optimal backgrounds</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Streamlined workflow: AI texts → Bulk generation → GCS upload → Content Studio export → Facebook posts → Performance Program earnings! 💰
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICaptionGenerator;