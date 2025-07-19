// COMPLETE AI Generator with Clean Captions Feature + French Typography Fix
// Replace your entire /src/app/ai-generator/page.tsx file with this

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
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isCleaningCaptions, setIsCleaningCaptions] = useState(false); // ✅ NEW: Clean state

  // Page profiles
  const pageProfiles = {
    'momix-famille': {
      name: 'Momix en Famille',
      language: 'French',
      niche: 'Family & Parenting',
      audience: 'French adults 35-55, family-oriented',
      demographics: '84.5% France, 68% ages 35-54, balanced gender',
      tone: 'Warm, authentic, relatable',
      peakTimes: 'Tuesday-Thursday, consistent all week',
      topPerformers: 'Text-on-image posts (95%), emotional stories, family wisdom',
      engagementData: '289% increase with multi-line emotional content'
    },
    'english-motivation': {
      name: 'English Motivation',
      language: 'English',
      niche: 'Motivation & Success',
      audience: 'English speakers 25-45, ambitious',
      demographics: 'Global English, career-focused',
      tone: 'Inspiring, direct, powerful',
      peakTimes: 'Monday mornings, Wednesday evenings',
      topPerformers: 'Success stories, quotes, transformation posts',
      engagementData: 'High engagement with personal stories and calls-to-action'
    }
  };

  // AI Models
  const aiModels = {
    'anthropic/claude-3.5-sonnet': {
      name: 'Claude 3.5 Sonnet',
      description: 'Best for creative, nuanced content',
      cost: '$0.003/1K tokens'
    },
    'anthropic/claude-3-haiku': {
      name: 'Claude 3 Haiku',
      description: 'Fast and efficient for simple content',
      cost: '$0.0005/1K tokens'
    },
    'meta-llama/llama-3.1-70b-instruct': {
      name: 'Llama 3.1 70B',
      description: 'Excellent for multilingual content',
      cost: '$0.0009/1K tokens'
    },
    'meta-llama/llama-3.1-8b-instruct': {
      name: 'Llama 3.1 8B',
      description: 'Budget-friendly, good quality',
      cost: '$0.0002/1K tokens'
    },
    'openai/gpt-4o': {
      name: 'GPT-4o',
      description: 'Versatile, high-quality content',
      cost: '$0.005/1K tokens'
    },
    'openai/gpt-4o-mini': {
      name: 'GPT-4o Mini',
      description: 'Cost-effective GPT-4 variant',
      cost: '$0.0002/1K tokens'
    }
  };

  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');

  // Categories
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

  // ✅ ENHANCED: Super aggressive text cleaning WITH FRENCH TYPOGRAPHY FIX
  const cleanText = (text) => {
    return text
      .replace(/^\*\*\s*/, '')                    // Remove ** at beginning
      .replace(/\s*\*\*$/, '')                    // Remove ** at end  
      .replace(/\*\*/g, '')                       // Remove all **
      .replace(/\*/g, '')                         // Remove all *
      .replace(/_{2,}/g, '')                      // Remove __
      .replace(/`+/g, '')                         // Remove backticks
      .replace(/#{1,6}\s*/g, '')                  // Remove headers
      .replace(/^\s*[-*+]\s*/gm, '')              // Remove bullets
      .replace(/^\s*\d+\.\s*/gm, '')              // Remove numbers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')    // Convert links to text
      
      // ✅ FIX FRENCH TYPOGRAPHY - CORRECTION PRINCIPALE POUR LES APOSTROPHES !
      .replace(/'/g, "'")                         // Replace straight apostrophes with French apostrophes
      .replace(/'/g, "'")                         // Replace any other straight apostrophes
      .replace(/"/g, '"')                         // Fix opening quotes (optional)
      .replace(/"/g, '"')                         // Fix closing quotes (optional)
      
      // ✅ REMOVE ALL CTAs (comprehensive list)
      .replace(/Tag\s+[^.!?\n]*[.!?\n]/gi, '')
      .replace(/Commentez\s+[^.!?\n]*[.!?\n]/gi, '')
      .replace(/Partagez\s+[^.!?\n]*[.!?\n]/gi, '')
      .replace(/Qui\s+est\s+d['']accord[^.!?\n]*[.!?\n]/gi, '')  // Note: handles both ' and '
      .replace(/Likez\s+[^.!?\n]*[.!?\n]/gi, '')
      .replace(/Suivez\s+[^.!?\n]*[.!?\n]/gi, '')
      .replace(/Abonnez-vous[^.!?\n]*[.!?\n]/gi, '')
      .replace(/Dites-moi\s+[^.!?\n]*[.!?\n]/gi, '')
      .replace(/Réagissez\s+[^.!?\n]*[.!?\n]/gi, '')
      
      // ✅ REMOVE ALL EMOJIS (comprehensive list)
      .replace(/🤗|🌟|💕|👇|🔥|✨|💰|📱|❤️|💯|😅|🤔|💙|👨‍👩‍👧‍👦|🧠|⚡|💭|😂|🎯|🚀|💪|🙌|👏|💜|🖤|💚|💛|🧡|❤️‍🔥|💖|💝|💗|💓|💘|💋|👀|🤯|😍|🥰|😘|😊|😄|😃|😂|🤣|😆|😁|🙂|🙃|😉|😇|🥺|😢|😭|😤|😠|😡|🤬|🤢|🤮|🤧|😷|🤒|🤕|🤠|🤡|🤥|🤓|😎|🧐|🤨|😐|😑|😶|😏|😒|🙄|😬|🤐|🤫|🤭|😯|😦|😧|😮|😲|🥱|😴|🤤|😪|😵|🤐|🥴|🤢|🤮|🤧|😷|🤒|🤕|🤑|🤠|😈|👿|👹|👺|🤡|💩|👻|💀|☠️|👽|👾|🤖|🎃|😺|😸|😹|😻|😼|😽|🙀|😿|😾/g, '')
      
      // ✅ CLEAN FORMATTING
      .replace(/["""'']/g, '')                    // Remove smart quotes (except the ones we want)
      .replace(/\s{3,}/g, '\n\n')                 // Convert multiple spaces to double line break
      .replace(/\n{3,}/g, '\n\n')                 // Limit line breaks to maximum 2
      .replace(/^\s+|\s+$/g, '')                  // Trim whitespace at start/end
      .trim();
  };

  // ✅ NEW: Clean all captions function
  const cleanAllCaptions = () => {
    if (generatedContent.length === 0) {
      alert('No captions to clean. Generate some content first!');
      return;
    }

    setIsCleaningCaptions(true);
    
    // Clean all captions
    const cleanedContent = generatedContent.map(content => ({
      ...content,
      text: cleanText(content.text)
    }));
    
    setGeneratedContent(cleanedContent);
    
    // Show success message
    setTimeout(() => {
      setIsCleaningCaptions(false);
      alert(`✅ Cleaned ${cleanedContent.length} captions!\n\nRemoved: markdown, emojis, CTAs, and formatting issues.\nFixed: French apostrophes and typography.`);
    }, 1000);
  };

  // ✅ NEW: Individual caption cleaning
  const cleanSingleCaption = (captionId) => {
    const updatedContent = generatedContent.map(content => {
      if (content.id === captionId) {
        return {
          ...content,
          text: cleanText(content.text)
        };
      }
      return content;
    });
    
    setGeneratedContent(updatedContent);
  };

  // ✅ ENHANCED: Viral prompt with French typography instructions
  const getViralPrompt = (pageId, categoryId, topic = '', quantity) => {
    const page = pageProfiles[pageId];
    
    const basePrompt = `Tu crées des POSTS VIRAUX FACEBOOK pour ${page.name}, une page ${page.niche}.

DONNÉES DE SUCCÈS PROUVÉES:
- Engagement actuel: ${page.engagementData}
- Audience: ${page.audience}
- Ton: ${page.tone}

FORMULES VIRALES OBLIGATOIRES - Utilise EXACTEMENT ces structures:

FORMULE 1 - Progression d'âge:
À 20 ans: [croyance jeune]

À 30 ans: [réalisation]

À 40 ans: [vérité mature]

À 50 ans: [sagesse finale]

FORMULE 2 - Avant/Maintenant:
Avant d'être parent: [naïveté]

Maintenant: [réalité crue]

[Conclusion humble]

FORMULE 3 - Perspectives multiples:
Les enfants: [demande]

Moi le matin: [bonne volonté]

Moi le soir: [réalité fatiguée]

FORMULE 4 - Révélation d'âge:
À [âge] ans, j'ai enfin compris

[Vérité cachée sur un aspect de la vie]

[Explication de pourquoi c'est important]

[Conclusion naturelle]

FORMULE 5 - Nostalgie technologique:
Se souvenir quand:

[Contrainte technologique d'avant]

[Autre contrainte]

[Réflexion sur le changement]

RÈGLES STRICTES POUR LA TYPOGRAPHIE FRANÇAISE:
- UTILISE TOUJOURS les apostrophes françaises ' au lieu de '
- Exemples: "j'ai" pas "j'ai", "d'être" pas "d'être", "l'amour" pas "l'amour"
- AUCUN appel à l'action (Tag, Commentez, Partagez)
- AUCUN emoji ou symbole
- AUCUN formatage markdown (**, *)
- Seulement du texte français naturel avec la BONNE TYPOGRAPHIE
- Ligne vide entre chaque pensée
- Expériences spécifiquement françaises
- Vulnérabilité et imperfections, pas de perfection
- 4-6 lignes maximum par caption

EXEMPLES AVEC BONNE TYPOGRAPHIE:
"À 40 ans, j'ai compris que nos parents avaient raison"
"L'amour, ce n'est pas ce qu'on croit"
"J'étais persuadée d'avoir tout compris"

GÉNÈRE ${quantity} posts en utilisant les formules ci-dessus avec la TYPOGRAPHIE FRANÇAISE CORRECTE.

FORMAT DE RÉPONSE:

CAPTION 1:
[Texte avec lignes vides entre les pensées ET apostrophes françaises correctes]
BACKGROUND: [couleur suggérée]

CAPTION 2:
[Texte avec lignes vides entre les pensées ET apostrophes françaises correctes]
BACKGROUND: [couleur suggérée]

Continue pour tous les ${quantity} posts.`;

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
          model: selectedModel,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: Math.max(6000, quantity * 400)
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // ✅ ENHANCED: Better parsing
      const captionMatches = content.match(/CAPTION \d+:\s*([\s\S]*?)(?=BACKGROUND:|$)/gi);
      const backgroundMatches = content.match(/BACKGROUND:\s*([^\n]+)/gi);
      
      if (captionMatches && backgroundMatches) {
        const parsedContent = captionMatches.map((match, index) => {
          const captionText = match.replace(/CAPTION \d+:\s*/, '').trim();
          const backgroundText = backgroundMatches[index] ? 
            backgroundMatches[index].replace(/BACKGROUND:\s*/, '').trim() : 'Purple-Pink';
          
          return {
            id: index + 1,
            text: cleanText(captionText),
            background: backgroundText
          };
        });
        
        setGeneratedContent(parsedContent);
      } else {
        // Fallback parsing
        const sections = content.split(/CAPTION \d+:|TEXT \d+:/i).filter(section => section.trim().length > 10);
        const fallbackContent = sections.slice(0, quantity).map((section, index) => {
          const lines = section.split('\n').filter(line => line.trim().length > 0);
          const textLines = lines.filter(line => !line.includes('BACKGROUND:'));
          const backgroundLine = lines.find(line => line.includes('BACKGROUND:'));
          
          const text = cleanText(textLines.join('\n'));
          const background = backgroundLine ? 
            backgroundLine.replace(/BACKGROUND:\s*/i, '').trim() : 
            categories[selectedCategory]?.backgrounds[index % categories[selectedCategory]?.backgrounds.length] || 'Purple-Pink';
          
          return {
            id: index + 1,
            text: text,
            background: background
          };
        });
        
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

    const bulkData = generatedContent.map((content, index) => ({
      text: content.text,
      background: content.background,
      id: index + 1
    }));

    localStorage.setItem('aiGeneratedTexts', JSON.stringify(bulkData));
    window.location.href = '/bulk?source=ai-generator';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 AI Viral Caption Generator
          </h1>
          <p className="text-lg text-gray-600">
            Multi-line viral captions with perfect French typography
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

              {/* AI Model Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Brain className="w-4 h-4 inline mr-1" />
                  AI Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(aiModels).map(([id, model]) => (
                    <option key={id} value={id}>
                      {model.name} - {model.cost}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  {aiModels[selectedModel]?.description}
                </div>
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
                    Generate Viral Captions
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
                Generated Viral Captions
              </h2>

              {generatedContent.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Wand2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Configure your settings and generate viral captions</p>
                  <p className="text-sm">Multi-line captions with perfect French typography</p>
                </div>
              ) : (
                <>
                  {/* ✅ ENHANCED: Clean Captions Section with French Typography */}
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-bold text-orange-800 mb-2">🧹 Caption Cleaning & French Typography</h3>
                    <p className="text-sm text-orange-700 mb-4">
                      Use this failsafe to clean formatting issues and fix French apostrophes before generating images.
                    </p>
                    
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={cleanAllCaptions}
                        disabled={isCleaningCaptions}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                      >
                        {isCleaningCaptions ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Cleaning...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clean All Captions ({generatedContent.length})
                          </>
                        )}
                      </button>
                      
                      <div className="text-xs text-orange-600 flex items-center">
                        <strong>Removes:</strong> **, *, emojis, CTAs + <strong>Fixes:</strong> French apostrophes (j'ai → j'ai)
                      </div>
                    </div>
                  </div>

                  {/* ✅ ENHANCED: Caption Display with Quality Indicators */}
                  <div className="space-y-6">
                    {generatedContent.map((content, index) => (
                      <div key={content.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                              Caption {content.id}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-sm">
                              {content.background} Background
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs">
                              {aiModels[selectedModel]?.name}
                            </span>
                            
                            {/* ✅ ENHANCED: Quality Indicators including French Typography */}
                            <div className="flex gap-1">
                              {content.text.includes('**') && (
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">Markdown</span>
                              )}
                              {/🤗|🌟|💕|👇|🔥|✨|💰|📱|❤️|💯|😅|🤔|💙/.test(content.text) && (
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">Emojis</span>
                              )}
                              {/Tag\s+|Commentez\s+|Partagez\s+/i.test(content.text) && (
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">CTA</span>
                              )}
                              {/'/g.test(content.text) && (
                                <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">Apostrophes</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {/* ✅ NEW: Individual Clean Button */}
                            <button
                              onClick={() => cleanSingleCaption(content.id)}
                              className="p-2 text-orange-500 hover:text-orange-700 transition-colors"
                              title="Clean this caption & fix French typography"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            
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
                          <div className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                            {content.text}
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
                  </div>
                  
                  {/* ✅ ENHANCED: Send to Bulk Generator with Pre-Clean Guidance */}
                  <div className="text-center pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-800 mb-2">📸 Ready for Image Generation?</h4>
                      <p className="text-sm text-blue-700">
                        Make sure to clean your captions first to fix French typography and remove formatting issues.
                        Then send them to the bulk generator to create images.
                      </p>
                    </div>
                    
                    <button
                      onClick={sendToBulkGenerator}
                      className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
                    >
                      <Zap className="w-6 h-6" />
                      Send All to Bulk Generator →
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      Generate images for all {generatedContent.length} texts with perfect French typography
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">🔗 AI → Clean → Bulk Generator Workflow</h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-bold text-gray-800">1. Generate Viral Captions</div>
              <div className="text-sm text-gray-600">Create multi-line captions with research-backed viral formulas</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">🇫🇷</div>
              <div className="font-bold text-gray-800">2. Fix French Typography</div>
              <div className="text-sm text-gray-600">Convert straight apostrophes to French apostrophes automatically</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">🧹</div>
              <div className="font-bold text-gray-800">3. Clean Captions</div>
              <div className="text-sm text-gray-600">Remove formatting issues, CTAs, and emojis with one click</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">📸</div>
              <div className="font-bold text-gray-800">4. Generate Images</div>
              <div className="text-sm text-gray-600">Create Facebook-style images with perfect typography</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Complete viral content pipeline: AI captions → Fix French typography → Clean captions → Bulk generation → GCS upload → Content Studio export → Facebook posts → Performance Program earnings! 💰🇫🇷
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICaptionGenerator;