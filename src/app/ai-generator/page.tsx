'use client'

import React, { useState, useEffect } from 'react';
import { Wand2, Copy, RefreshCw, Settings, Target, Globe, Brain, Zap, Check, Lightbulb, BarChart3, TrendingUp, AlertTriangle, Shuffle, Activity } from 'lucide-react';

const EnhancedAICaptionGenerator = () => {
  // Existing state
  const [selectedPage, setSelectedPage] = useState('momix-famille');
  const [selectedCategory, setSelectedCategory] = useState('family-relationships');
  const [customTopic, setCustomTopic] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isCleaningCaptions, setIsCleaningCaptions] = useState(false);
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');

  // ✅ NEW: Smart Features State
  const [usePromptRotation, setUsePromptRotation] = useState(true);
  const [selectedFormulas, setSelectedFormulas] = useState([]);
  const [similarityThreshold, setSimilarityThreshold] = useState(70);
  const [showPerformanceStats, setShowPerformanceStats] = useState(false);
  const [modelStats, setModelStats] = useState({});
  const [contentHistory, setContentHistory] = useState([]);
  const [duplicateWarnings, setDuplicateWarnings] = useState([]);

  // ✅ NEW: Dynamic pages from dashboard
  const [pageProfiles, setPageProfiles] = useState({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openrouter_api_key');
    if (savedApiKey) setApiKey(savedApiKey);

    const savedStats = localStorage.getItem('ai_model_stats');
    if (savedStats) setModelStats(JSON.parse(savedStats));

    const savedHistory = localStorage.getItem('content_history');
    if (savedHistory) setContentHistory(JSON.parse(savedHistory));

    // ✅ LOAD PAGES FROM DASHBOARD
    loadPagesFromDashboard();

    // ✅ PARSE URL PARAMETERS FROM CATEGORY GENERATOR
    parseUrlParameters();
  }, []);

  // ✅ LOAD DASHBOARD PAGES
  const loadPagesFromDashboard = () => {
    const defaultPages = {
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

    // Load dashboard pages
    const savedPages = localStorage.getItem('facebook_pages');
    if (savedPages) {
      try {
        const dashboardPages = JSON.parse(savedPages);
        const convertedPages = {};
        
        // Convert dashboard pages to AI generator format
        dashboardPages.forEach(page => {
          convertedPages[page.id] = {
            name: page.name,
            language: page.settings?.language || 'French',
            niche: page.niche || 'General',
            audience: page.audience || 'General audience',
            demographics: `Language: ${page.settings?.language || 'French'}`,
            tone: page.tone || 'Authentic',
            peakTimes: page.settings?.postingTimes?.join(', ') || 'Various times',
            topPerformers: 'Dynamic content based on page performance',
            engagementData: `Avg engagement: ${page.performance?.avgEngagement || 'Not tracked yet'}`
          };
        });

        // Merge with defaults
        setPageProfiles({ ...defaultPages, ...convertedPages });
      } catch (error) {
        console.error('Error loading dashboard pages:', error);
        setPageProfiles(defaultPages);
      }
    } else {
      setPageProfiles(defaultPages);
    }
  };

  // ✅ PARSE URL PARAMETERS FROM CATEGORY
  const parseUrlParameters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      try {
        const categoryData = JSON.parse(decodeURIComponent(categoryParam));
        
        // Set the topic
        if (categoryData.topic) {
          setCustomTopic(categoryData.topic);
        }
        
        // Set formulas if available
        if (categoryData.formulas && Array.isArray(categoryData.formulas)) {
          // Convert formula names to the format used in AI generator
          const convertedFormulas = categoryData.formulas.map(formula => {
            switch (formula) {
              case 'AGE_PROGRESSION': return 'age_progression';
              case 'BEFORE_AFTER': return 'before_after';
              case 'NOBODY_TELLS_YOU': return 'revelation';
              case 'FAMILY_REALITY': return 'confession';
              default: return formula.toLowerCase().replace(/_/g, '_');
            }
          });
          setSelectedFormulas(convertedFormulas);
          setUsePromptRotation(true);
        }
        
        // Set category based on emotion
        if (categoryData.emotion) {
          switch (categoryData.emotion) {
            case 'relatable':
              setSelectedCategory('family-relationships');
              break;
            case 'humorous':
              setSelectedCategory('humor-social');
              break;
            case 'nostalgic':
              setSelectedCategory('nostalgia-memory');
              break;
            case 'inspiring':
              setSelectedCategory('motivation-success');
              break;
            default:
              setSelectedCategory('family-relationships');
          }
        }
        
        console.log('✅ Category data loaded:', categoryData);
      } catch (error) {
        console.error('Error parsing category data:', error);
      }
    }
  };

  // ✅ FEATURE 1: VIRAL FORMULAS FOR PROMPT ROTATION
  const viralFormulas = {
    'age_progression': {
      name: 'Progression d\'âge',
      structure: 'À 20 ans / À 30 ans / À 40 ans / À 50 ans',
      prompt: `FORMULE PROGRESSION D'ÂGE:
À 20 ans: [croyance jeune naïve]

À 30 ans: [première réalisation]

À 40 ans: [vérité mature plus dure]

À 50 ans: [sagesse finale acceptée]

Utilise cette structure exacte avec des transitions d'âge réalistes et des vérités qui évoluent.`
    },
    'before_after': {
      name: 'Avant/Maintenant',
      structure: 'Avant d\'être parent / Maintenant',
      prompt: `FORMULE AVANT/MAINTENANT:
Avant d'être parent: [naïveté/idéalisme]

Maintenant: [réalité crue mais touchante]

[Conclusion humble et touchante]

Crée un contraste émotionnel fort entre l'idéal et la réalité parentale.`
    },
    'confession': {
      name: 'Confession personnelle',
      structure: 'J\'avoue que / La vérité c\'est que',
      prompt: `FORMULE CONFESSION:
J'avoue que [vulnérabilité personnelle]

La vérité c'est que [réalité cachée]

[Explication pourquoi c'est dur à admettre]

[Validation que c'est normal]

Utilise la vulnérabilité pour créer une connexion émotionnelle forte.`
    },
    'revelation': {
      name: 'Révélation d\'âge',
      structure: 'À [âge] ans, j\'ai enfin compris',
      prompt: `FORMULE RÉVÉLATION:
À [âge spécifique] ans, j'ai enfin compris

[Vérité sur la vie/famille/relations]

[Pourquoi ça a pris si longtemps à comprendre]

[Impact de cette compréhension]

L'âge doit être crédible et la révélation universelle mais spécifique.`
    },
    'nostalgia_tech': {
      name: 'Nostalgie technologique',
      structure: 'Se souvenir quand',
      prompt: `FORMULE NOSTALGIE TECH:
Se souvenir quand:

[Contrainte technologique d'avant]
[Autre contrainte de l'époque]
[Troisième exemple nostalgique]

[Réflexion sur le changement/évolution]

Utilise des références spécifiquement françaises des années 90-2000.`
    },
    'perspective_multiple': {
      name: 'Perspectives multiples',
      structure: 'Les enfants / Moi le matin / Moi le soir',
      prompt: `FORMULE PERSPECTIVES MULTIPLES:
Les enfants: [demande/attente]

Moi le matin: [bonne volonté/énergie]

Moi le soir: [réalité fatiguée mais drôle]

[Conclusion sur la réalité parentale]

Montre l'évolution de l'énergie parentale sur une journée.`
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

  // Categories
  const categories = {
    'family-relationships': {
      name: '👨‍👩‍👧‍👦 Family & Relationships',
      description: 'Parent struggles, marriage wisdom, family bonds',
      backgrounds: ['Purple-Pink', 'Pink-Blue', 'Cyan-Purple'],
      recommendedFormulas: ['age_progression', 'before_after', 'confession']
    },
    'life-wisdom': {
      name: '🧠 Life Wisdom',
      description: 'Age revelations, life truths, personal growth',
      backgrounds: ['Dark', 'Solid Purple', 'Cyan-Purple'],
      recommendedFormulas: ['revelation', 'age_progression', 'confession']
    },
    'motivation-success': {
      name: '⚡ Motivation & Success',
      description: 'Dreams, second chances, transformation stories',
      backgrounds: ['Yellow-Pink', 'Cyan-Purple', 'Pink-Red'],
      recommendedFormulas: ['before_after', 'revelation', 'confession']
    },
    'nostalgia-memory': {
      name: '💭 Nostalgia & Memory',
      description: 'Childhood memories, time passage, "remember when"',
      backgrounds: ['Purple-Pink', 'Cyan-Purple', 'Pink-Blue'],
      recommendedFormulas: ['nostalgia_tech', 'age_progression', 'perspective_multiple']
    },
    'humor-social': {
      name: '😂 Humor & Social Commentary',
      description: 'Technology struggles, modern parenting, generational gaps',
      backgrounds: ['Pink-Red', 'Pink-Blue', 'Yellow-Pink'],
      recommendedFormulas: ['perspective_multiple', 'before_after', 'nostalgia_tech']
    },
    'mixed-viral': {
      name: '🔥 Mixed Viral Content',
      description: 'Combination of all categories for maximum variety',
      backgrounds: ['All backgrounds randomly assigned'],
      recommendedFormulas: ['age_progression', 'before_after', 'confession', 'revelation']
    }
  };

  // ✅ FEATURE 2: SIMILARITY DETECTION
  const calculateSimilarity = (text1, text2) => {
    const normalize = (str) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const words1 = normalize(text1).split(/\s+/);
    const words2 = normalize(text2).split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return (intersection.size / union.size) * 100;
  };

  const checkForDuplicates = (newContent) => {
    const warnings = [];
    const recentHistory = contentHistory.slice(-50); // Check last 50 posts
    
    newContent.forEach((content, index) => {
      recentHistory.forEach((historical, histIndex) => {
        const similarity = calculateSimilarity(content.text, historical.text);
        if (similarity > similarityThreshold) {
          warnings.push({
            index,
            similarity: Math.round(similarity),
            originalText: historical.text.substring(0, 100) + '...',
            generatedDate: historical.date
          });
        }
      });
    });
    
    return warnings;
  };

  // ✅ FEATURE 3: MODEL PERFORMANCE TRACKING
  const trackModelUsage = (model, success, engagementScore = 0) => {
    const updatedStats = { ...modelStats };
    
    if (!updatedStats[model]) {
      updatedStats[model] = {
        totalUses: 0,
        successfulGenerations: 0,
        totalEngagementScore: 0,
        averageEngagement: 0,
        lastUsed: new Date().toISOString()
      };
    }
    
    updatedStats[model].totalUses += 1;
    if (success) {
      updatedStats[model].successfulGenerations += 1;
    }
    updatedStats[model].totalEngagementScore += engagementScore;
    updatedStats[model].averageEngagement = 
      updatedStats[model].totalEngagementScore / updatedStats[model].totalUses;
    updatedStats[model].lastUsed = new Date().toISOString();
    
    setModelStats(updatedStats);
    localStorage.setItem('ai_model_stats', JSON.stringify(updatedStats));
  };

  // ✅ ENHANCED PROMPT GENERATION WITH ROTATION
  const getEnhancedViralPrompt = (pageId, categoryId, topic = '', quantity) => {
    const page = pageProfiles[pageId];
    const category = categories[categoryId];
    
    if (!page) {
      console.error('Page not found:', pageId);
      return 'Error: Page not found';
    }
    
    // Select formulas for rotation
    let formulas = [];
    if (usePromptRotation && selectedFormulas.length > 0) {
      formulas = selectedFormulas;
    } else if (category.recommendedFormulas) {
      formulas = category.recommendedFormulas.slice(0, Math.min(3, category.recommendedFormulas.length));
    } else {
      formulas = ['age_progression', 'confession', 'revelation'];
    }
    
    // Build formula instructions
    const formulaInstructions = formulas.map(formulaId => {
      const formula = viralFormulas[formulaId];
      return formula ? formula.prompt : '';
    }).join('\n\n');
    
    const basePrompt = `Tu es un expert en contenu viral français pour ${page.name}.

DONNÉES DE SUCCÈS PROUVÉES:
- Engagement: ${page.engagementData}
- Audience: ${page.audience}
- Ton: ${page.tone}

${formulaInstructions}

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

DISTRIBUTION DES FORMULES:
- Utilise les ${formulas.length} formules de manière équilibrée
- Varie l'ordre et la structure
- ${quantity} posts au total

${topic ? `SUJET SPÉCIFIQUE: ${topic}` : ''}

GÉNÈRE ${quantity} posts viraux en utilisant les formules sélectionnées avec la TYPOGRAPHIE FRANÇAISE CORRECTE.`;

    return basePrompt;
  };

  // Clean captions function
  const cleanText = (text) => {
    return text
      .replace(/^\*\*\s*/, '')
      .replace(/\s*\*\*$/, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      .replace(/tag\s+(quelqu'un|qqn|une\s+personne)/gi, '')
      .replace(/commentez\s+["'""]?\w+["'""]?\s+si/gi, '')
      .replace(/partagez\s+si/gi, '')
      .replace(/qui\s+est\s+d'accord\s*\?/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const cleanAllCaptions = () => {
    setIsCleaningCaptions(true);
    setTimeout(() => {
      const cleanedContent = generatedContent.map(content => ({
        ...content,
        text: cleanText(content.text)
      }));
      setGeneratedContent(cleanedContent);
      setIsCleaningCaptions(false);
    }, 500);
  };

  // Generate captions with smart features
  const generateCaptions = async () => {
    if (!apiKey) {
      alert('Please enter your OpenRouter API key in settings');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent([]);
    setDuplicateWarnings([]);

    try {
      const prompt = getEnhancedViralPrompt(selectedPage, selectedCategory, customTopic, quantity);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Enhanced FB Caption Generator'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: Math.max(6000, quantity * 400)
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse generated content
      const lines = content.split('\n').filter(line => line.trim().length > 0);
      const results = [];
      let currentCaption = '';
      let captionCount = 0;
      
      for (const line of lines) {
        if (line.trim().length > 0) {
          currentCaption += line + '\n';
        } else if (currentCaption.trim().length > 0) {
          captionCount++;
          const categoryBgs = categories[selectedCategory]?.backgrounds || ['Dark'];
          const randomBg = categoryBgs[Math.floor(Math.random() * categoryBgs.length)];
          
          results.push({
            id: captionCount,
            text: currentCaption.trim(),
            background: randomBg
          });
          currentCaption = '';
          
          if (results.length >= quantity) break;
        }
      }
      
      // Add any remaining content
      if (currentCaption.trim().length > 0 && results.length < quantity) {
        captionCount++;
        const categoryBgs = categories[selectedCategory]?.backgrounds || ['Dark'];
        const randomBg = categoryBgs[Math.floor(Math.random() * categoryBgs.length)];
        
        results.push({
          id: captionCount,
          text: currentCaption.trim(),
          background: randomBg
        });
      }

      // Check for duplicates
      const warnings = checkForDuplicates(results);
      setDuplicateWarnings(warnings);
      
      // Update content history
      const newHistory = [...contentHistory, ...results.map(r => ({
        ...r,
        date: new Date().toISOString(),
        model: selectedModel
      }))];
      setContentHistory(newHistory.slice(-100)); // Keep last 100
      localStorage.setItem('content_history', JSON.stringify(newHistory.slice(-100)));
      
      setGeneratedContent(results);
      
      // Track model performance
      trackModelUsage(selectedModel, true, results.length * 10); // Base score
      
    } catch (error) {
      console.error('Generation error:', error);
      alert('Error generating content. Check your API key and try again.');
      trackModelUsage(selectedModel, false);
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
            🧠 Enhanced AI Caption Generator
          </h1>
          <p className="text-lg text-gray-600">
            Smart viral captions with rotation, tracking & duplicate detection
          </p>
          
          {/* URL Parameters Notice */}
          {customTopic && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                ✅ <strong>Category data loaded:</strong> Topic "{customTopic}" 
                {selectedFormulas.length > 0 && ` with ${selectedFormulas.length} selected formulas`}
              </p>
            </div>
          )}
        </div>

        {/* Smart Features Status Bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${usePromptRotation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              <Shuffle className="w-4 h-4 inline mr-1" />
              Prompt Rotation: {usePromptRotation ? 'ON' : 'OFF'}
            </div>
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Models Tracked: {Object.keys(modelStats).length}
            </div>
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Content History: {contentHistory.length}
            </div>
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <Globe className="w-4 h-4 inline mr-1" />
              Pages: {Object.keys(pageProfiles).length}
            </div>
          </div>
        </div>

        {/* API Key Notice */}
        {!apiKey && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-yellow-800 mb-2">🔑 API Key Required</h4>
            <p className="text-sm text-yellow-700 mb-2">Get your OpenRouter API key:</p>
            <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
              <li>Go to <a href="https://openrouter.ai/keys" target="_blank" className="text-blue-600 underline">openrouter.ai/keys</a></li>
              <li>Create a free account and generate an API key</li>
              <li>Click Settings ⚙️ to enter your key</li>
            </ol>
          </div>
        )}

        {/* Duplicate Warnings */}
        {duplicateWarnings.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-orange-800 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Duplicate Content Detected
            </h4>
            <p className="text-sm text-orange-700 mb-2">
              {duplicateWarnings.length} generated caption(s) are similar to previous content:
            </p>
            {duplicateWarnings.map((warning, idx) => (
              <div key={idx} className="text-xs text-orange-600 mb-1">
                Caption {warning.index + 1}: {warning.similarity}% similar to content from {new Date(warning.generatedDate).toLocaleDateString()}
              </div>
            ))}
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">⚙️ Enhanced Settings</h2>
              
              {/* API Key */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">OpenRouter API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    localStorage.setItem('openrouter_api_key', e.target.value);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="sk-or-..."
                />
              </div>

              {/* Smart Features */}
              <div className="mb-6 border-t pt-6">
                <h3 className="font-medium text-gray-800 mb-4">🧠 Smart Features</h3>
                
                {/* Prompt Rotation */}
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={usePromptRotation}
                      onChange={(e) => setUsePromptRotation(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Enable Prompt Rotation</span>
                  </label>
                  <p className="text-xs text-gray-600 mt-1">Varies viral formulas for each generation</p>
                </div>

                {/* Formula Selection */}
                {usePromptRotation && (
                  <div className="mb-4 ml-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Select Formulas to Rotate:</label>
                    <div className="space-y-1">
                      {Object.entries(viralFormulas).map(([id, formula]) => (
                        <label key={id} className="flex items-center text-xs">
                          <input
                            type="checkbox"
                            checked={selectedFormulas.includes(id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFormulas([...selectedFormulas, id]);
                              } else {
                                setSelectedFormulas(selectedFormulas.filter(f => f !== id));
                              }
                            }}
                            className="mr-2"
                          />
                          <span>{formula.name}</span>
                        </label>
                      ))}
                    </div>
                    {selectedFormulas.length === 0 && (
                      <p className="text-xs text-orange-600 mt-1">Will use category defaults if none selected</p>
                    )}
                  </div>
                )}

                {/* Similarity Threshold */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duplicate Detection Threshold: {similarityThreshold}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="90"
                    value={similarityThreshold}
                    onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">Higher = stricter duplicate detection</p>
                </div>
              </div>

              {/* Model Performance Stats */}
              <div className="mb-6 border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800">📊 Model Performance</h3>
                  <button
                    onClick={() => setShowPerformanceStats(!showPerformanceStats)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showPerformanceStats ? 'Hide' : 'Show'} Stats
                  </button>
                </div>
                
                {showPerformanceStats && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {Object.keys(modelStats).length === 0 ? (
                      <p className="text-sm text-gray-500">No usage data yet</p>
                    ) : (
                      Object.entries(modelStats).map(([model, stats]) => (
                        <div key={model} className="bg-gray-50 p-2 rounded text-xs">
                          <div className="font-medium">{aiModels[model]?.name || model}</div>
                          <div className="text-gray-600">
                            Uses: {stats.totalUses} | Success: {Math.round((stats.successfulGenerations / stats.totalUses) * 100)}% | 
                            Last used: {new Date(stats.lastUsed).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('ai_model_stats');
                    localStorage.removeItem('content_history');
                    setModelStats({});
                    setContentHistory([]);
                    alert('All performance data cleared!');
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  Clear Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">🎯 Smart Generation</h2>
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
                  {modelStats[selectedModel] && (
                    <span className="text-xs text-green-600 ml-2">
                      ✓ {modelStats[selectedModel].totalUses} uses
                    </span>
                  )}
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
                  Page Profile ({Object.keys(pageProfiles).length} pages)
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
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  {pageProfiles[selectedPage]?.niche} • {pageProfiles[selectedPage]?.audience}
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Content Category
                  {usePromptRotation && categories[selectedCategory]?.recommendedFormulas && (
                    <span className="text-xs text-blue-600 ml-2">
                      📚 {categories[selectedCategory].recommendedFormulas.length} formulas
                    </span>
                  )}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(categories).map(([id, category]) => (
                    <option key={id} value={id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  {categories[selectedCategory]?.description}
                </div>
              </div>

              {/* Formula Preview */}
              {usePromptRotation && (
                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs font-medium text-blue-800 mb-2">
                    <Shuffle className="w-3 h-3 inline mr-1" />
                    Active Formulas:
                  </div>
                  <div className="text-xs text-blue-700 space-y-1">
                    {(selectedFormulas.length > 0 ? selectedFormulas : categories[selectedCategory]?.recommendedFormulas || []).map(formulaId => (
                      <div key={formulaId} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        {viralFormulas[formulaId]?.name || formulaId}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Topic */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  Custom Topic {customTopic && <span className="text-green-600">✓ Loaded</span>}
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., rentrée scolaire, vacances d'été..."
                />
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity: {quantity} captions
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateCaptions}
                disabled={isGenerating || !apiKey}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg disabled:opacity-50 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Smart Captions
                  </>
                )}
              </button>

              {!apiKey && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  Configure API key in settings to generate
                </p>
              )}
            </div>
          </div>

          {/* Right Panel - Generated Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  <Zap className="w-5 h-5 inline mr-2" />
                  Smart Generated Captions
                </h2>
                {generatedContent.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={cleanAllCaptions}
                      disabled={isCleaningCaptions}
                      className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-300 text-sm flex items-center gap-2"
                    >
                      {isCleaningCaptions ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Cleaning...
                        </>
                      ) : (
                        <>
                          ✨ Clean All Captions
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {generatedContent.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Configure settings and generate smart viral captions</p>
                  <p className="text-sm">Features: Formula rotation, duplicate detection, performance tracking</p>
                  {customTopic && (
                    <div className="mt-4 bg-blue-50 rounded-lg p-3">
                      <p className="text-blue-700 text-sm">
                        Ready to generate content for: <strong>{customTopic}</strong>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Stats Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{generatedContent.length}</div>
                        <div className="text-xs text-gray-600">Captions Generated</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{duplicateWarnings.length}</div>
                        <div className="text-xs text-gray-600">Duplicates Detected</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {usePromptRotation ? (selectedFormulas.length || 3) : 1}
                        </div>
                        <div className="text-xs text-gray-600">Formulas Used</div>
                      </div>
                    </div>
                  </div>

                  {/* Generated Captions */}
                  <div className="space-y-6">
                    {generatedContent.map((content, index) => {
                      const isDuplicate = duplicateWarnings.some(w => w.index === index);
                      
                      return (
                        <div key={content.id} className={`border rounded-xl p-4 transition-all ${isDuplicate ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:shadow-md'}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                                Caption {content.id}
                              </span>
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-sm">
                                {content.background}
                              </span>
                              {isDuplicate && (
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-lg text-xs flex items-center">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Duplicate Risk
                                </span>
                              )}
                            </div>
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
                          
                          <div className="bg-gray-50 p-4 rounded-lg mb-3">
                            <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                              {content.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Action Buttons */}
                    <div className="text-center pt-6 border-t border-gray-200">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                        <h4 className="font-bold text-gray-800 mb-2">🚀 Ready for Production</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Send these {generatedContent.length} captions to bulk generator for image creation.
                          Smart backgrounds already suggested!
                        </p>
                        
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
                      
                      <div className="text-center">
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
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Integration Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">🧠 Enhanced AI → Clean → Bulk Workflow</h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-bold text-gray-800">1. Smart Generation</div>
              <div className="text-sm text-gray-600">Rotated formulas, duplicate detection, performance tracking</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">🇫🇷</div>
              <div className="font-bold text-gray-800">2. Fix Typography</div>
              <div className="text-sm text-gray-600">Perfect French apostrophes and formatting</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">🧹</div>
              <div className="font-bold text-gray-800">3. Clean & Optimize</div>
              <div className="text-sm text-gray-600">Remove CTAs, emojis, and formatting issues</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">📸</div>
              <div className="font-bold text-gray-800">4. Bulk Generation</div>
              <div className="text-sm text-gray-600">Create images with smart background suggestions</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Complete smart viral content pipeline: Enhanced AI → Clean → Images → Upload → Export → Performance Program earnings! 💰🧠
          </p>
        </div>
      </div>
    </div>
  )
}

export default EnhancedAICaptionGenerator