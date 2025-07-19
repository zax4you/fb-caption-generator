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

  // AI Models selection
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

  // ✅ ENHANCED: Clean text function to remove all formatting
  const cleanText = (text) => {
    return text
      .replace(/^\*\*\s*/, '')                    // Remove ** at the beginning
      .replace(/\s*\*\*$/, '')                    // Remove ** at the end
      .replace(/\*\*/g, '')                       // Remove all other ** 
      .replace(/\*/g, '')                         // Remove single *
      .replace(/_{2,}/g, '')                      // Remove __
      .replace(/`+/g, '')                         // Remove backticks
      .replace(/#{1,6}\s*/g, '')                  // Remove headers
      .replace(/^\s*[-*+]\s*/gm, '')              // Remove bullet points
      .replace(/^\s*\d+\.\s*/gm, '')              // Remove numbered lists
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')    // Convert links
      .replace(/Tag\s+[^.!?]*[.!?]/gi, '')        // Remove CTA sentences
      .replace(/Commentez\s+[^.!?]*[.!?]/gi, '')  // Remove comment requests
      .replace(/Partagez\s+[^.!?]*[.!?]/gi, '')   // Remove share requests
      .replace(/Qui\s+est\s+d'accord[^.!?]*[.!?]/gi, '') // Remove agreement requests
      .replace(/👇|🔥|✨|💰|📱|❤️|💯|😅|🤔|💙/g, '') // Remove common emojis
      .replace(/["""]/g, '')                      // Remove smart quotes
      .trim();
  };

  // Enhanced viral formulas based on your successful captions analysis
  const getViralPrompt = (pageId, categoryId, topic = '', quantity) => {
    const page = pageProfiles[pageId];
    const category = categories[categoryId];
    
    let categoryPrompt = '';
    let exampleFormats = '';
    
// Update the getViralPrompt function in your AI generator
// Replace the example formats section with better spacing:

// 🌙 TONIGHT: Update your AI prompts with these enhanced viral formulas
// Replace the exampleFormats section in your getViralPrompt function:

if (categoryId === 'mixed-viral') {
  categoryPrompt = `Generate a MIX of all content types for maximum variety:
- Family & Relationships (parent struggles, marriage wisdom)
- Life Wisdom (age revelations, personal growth)  
- Motivation & Success (dreams, transformation)
- Nostalgia & Memory (childhood memories, "remember when")
- Humor & Social Commentary (technology struggles, modern parenting)

Distribute evenly across all categories.`;

  exampleFormats = `
PROVEN VIRAL FORMATS (use these exact structures):

Format 1 - Age Progression Series:
À 20 ans: Je vais changer le monde

À 30 ans: Je vais changer mon travail

À 40 ans: Je vais changer mes habitudes

À 50 ans: Finalement, je me change moi

Format 2 - Reality Check:
Avant d'être parent: Je ne comprenais pas pourquoi les gens étaient si fatigués

Maintenant: 'Bonjour' à 6h du matin me semble être une agression personnelle

Format 3 - Multiple Perspectives:
Les enfants: Papa, tu peux nous aider?

Moi à 7h: Bien sûr, avec plaisir!

Moi à 20h: Demandez à Google

Format 4 - Revelation Pattern:
À 45 ans, j'ai enfin compris

Pourquoi ma mère me disait toujours de ranger ma chambre

Ce n'était pas pour la chambre

C'était pour m'apprendre la discipline

Format 5 - Nostalgia Hook:
Qui se souvient quand on devait attendre 20h pour voir notre série préférée

Pas de replay, pas de pause

Si tu ratais un épisode, tu étais perdu pour toujours

Format 6 - Marriage/Relationship Truth:
20 ans de mariage m'ont appris

L'amour, ce n'est pas de ne jamais se disputer

C'est de se réconcilier à chaque fois

Format 7 - Parent Reality:
Mes enfants croient que je sais tout

En réalité, je googlelise discrètement

Depuis 15 ans`;
} else {
  // Category-specific enhanced examples
  categoryPrompt = `CATEGORY: ${category.name} - ${category.description}`;
  
  if (categoryId === 'family-relationships') {
    exampleFormats = `
FAMILY & RELATIONSHIPS - PROVEN VIRAL EXAMPLES:

Example 1 - Parent Evolution:
Avant mes enfants: Les parents qui crient sont de mauvais parents

Maintenant: 'ARRÊTEZ DE COURIR DANS LA MAISON!'

Je me suis excusée auprès de ma mère

Example 2 - Marriage Reality:
Mon mari: Tu veux qu'on regarde quoi ce soir?

Moi: N'importe quoi

Lui: *Met un film d'action*

Moi: Pas ça

Nous, tous les soirs depuis 15 ans

Example 3 - Generation Gap:
Mes parents à mon âge: Maison, 2 enfants, voiture neuve

Moi au même âge: Je partage un Netflix avec 4 personnes

Et je trouve ça déjà bien

Example 4 - Family Truth:
À 40 ans, j'ai compris

Mes parents n'avaient pas toutes les réponses

Ils improvisaient autant que moi

Mais ils le cachaient mieux`;
  } else if (categoryId === 'life-wisdom') {
    exampleFormats = `
LIFE WISDOM - PROVEN VIRAL EXAMPLES:

Example 1 - Age Revelation:
À 35 ans: Je pensais avoir tout compris

À 45 ans: Je réalise que je ne sais rien

À 55 ans: J'accepte enfin de ne pas savoir

Et c'est libérateur

Example 2 - Money Truth:
J'ai mis 30 ans à comprendre

L'argent ne fait pas le bonheur

Mais l'absence d'argent fait le malheur

Nuance importante

Example 3 - Career Reality:
Travailler dur ne garantit pas le succès

Travailler intelligemment non plus

Parfois, c'est juste une question de timing

Et un peu de chance

Example 4 - Life Priority:
À 20 ans: Je veux être riche

À 30 ans: Je veux être reconnu

À 40 ans: Je veux juste dormir 8h d'affilée

Les priorités changent`;
  } else if (categoryId === 'nostalgia-memory') {
    exampleFormats = `
NOSTALGIA & MEMORY - PROVEN VIRAL EXAMPLES:

Example 1 - Technology Evolution:
Se souvenir quand:

On devait se lever pour changer de chaîne

Le téléphone était attaché au mur

Internet faisait du bruit en se connectant

Example 2 - Childhood Memories:
Les étés de notre enfance duraient 3 mois

Maintenant, les vacances passent en 3 jours

Soit le temps a accéléré

Soit on a perdu la magie

Example 3 - Social Evolution:
Avant: On se donnait rendez-vous et on y était

Maintenant: 'Je suis en route' peut vouloir dire 'Je commence à me préparer'

La ponctualité, c'était mieux avant

Example 4 - Communication Change:
À l'époque: On appelait pour dire qu'on était bien arrivé

Maintenant: On envoie sa localisation en temps réel

Mais on se parle moins`;
  } else if (categoryId === 'humor-social') {
    exampleFormats = `
HUMOR & SOCIAL COMMENTARY - PROVEN VIRAL EXAMPLES:

Example 1 - Modern Parenting:
Avant: 'Va jouer dehors!'

Maintenant: 'Mets ta crème solaire, ton casque, tes genouillères, prends ton portable et reste où je peux te voir'

L'époque a changé

Example 2 - Technology Struggle:
Mes enfants: 'Papa, tu fais comment pour ça?'

Moi: 'Attends, je googlelise...'

Eux: *Roulent des yeux*

Moi, fier de ma technique de recherche

Example 3 - Shopping Evolution:
Avant: On faisait les courses une fois par semaine

Maintenant: Amazon Prime en 2h

Mais on passe plus de temps à choisir quoi regarder sur Netflix

Example 4 - Social Media Reality:
Instagram: Ma vie est parfaite

Facebook: Regardez mes enfants adorables

En réalité: Je n'ai pas dormi et j'ai mangé des céréales pour le dîner`;
  } else if (categoryId === 'motivation-success') {
    exampleFormats = `
MOTIVATION & SUCCESS - PROVEN VIRAL EXAMPLES:

Example 1 - Failure Reframe:
J'ai échoué 47 fois avant mes 40 ans

Puis j'ai compris

Chaque échec me rapprochait du succès

Maintenant, j'échoue plus vite

Example 2 - Dream Evolution:
À 25 ans: Je vais changer le monde

À 35 ans: Je vais changer mon secteur

À 45 ans: Si je peux changer ma famille, c'est déjà bien

Les rêves s'ajustent

Example 3 - Success Definition:
Le succès, ce n'est pas d'avoir tout

C'est de ne plus avoir envie de tout avoir

J'ai mis 40 ans à le comprendre

Example 4 - Career Truth:
Personne ne m'avait dit qu'à 45 ans

Je changerais encore de voie

Et que c'est normal

La vie n'est pas linéaire`;
  }
}

// Enhanced base prompt with viral psychology
const basePrompt = `You are creating VIRAL FACEBOOK CAPTIONS for ${page.name}, a ${page.niche} page.

PROVEN SUCCESS DATA:
- Current engagement: ${page.engagementData}
- Audience: ${page.audience}
- Demographics: ${page.demographics}
- Language: ${page.language}
- Tone: ${page.tone}

VIRAL PSYCHOLOGY RULES (MANDATORY):
1. RELATABILITY: Use experiences 85% of your audience has had
2. SURPRISE TWIST: Start with common belief, end with unexpected truth  
3. VULNERABILITY: Admit imperfections or failures
4. GENERATIONAL BRIDGE: Connect different age perspectives
5. UNIVERSAL TRUTH: Something everyone knows but rarely says out loud

FORBIDDEN ELEMENTS:
- Generic motivational quotes
- Preachy advice  
- Perfect scenarios
- Unrealistic expectations
- Overly positive content without struggle

VIRAL CAPTION STRUCTURE (MANDATORY):
Each caption MUST follow this structure:

1. HOOK (1 line): Age-specific opener or situation setup
2. STORY/CONTRAST (2-3 lines): The revelation, comparison, or reality
3. TWIST/TRUTH (1 line): The unexpected insight or honest admission
4. RESOLUTION (1 line): Natural conclusion that feels complete

${categoryPrompt}
${topic ? `SPECIFIC TOPIC: ${topic}` : ''}

${exampleFormats}

CONTENT REQUIREMENTS:
- Generate ${quantity} complete viral captions
- Each caption should be 4-6 lines with empty lines between thoughts
- Use PROVEN viral formulas from examples above
- NO call-to-action requests (no "Tag quelqu'un", "Commentez", etc.)
- NO emojis or special characters
- Age references should target ${page.audience}
- Use PLAIN TEXT ONLY - no markdown formatting
- Focus on ANTI-PERFECT content (struggles, not solutions)

FRENCH CULTURAL SPECIFICITY:
- Reference French family dynamics
- Use French generational experiences
- Include French cultural touchstones (TV shows, social norms)
- Acknowledge French parenting/marriage realities

EMOTIONAL TRIGGER WORDS TO USE:
- "En réalité", "La vérité c'est que", "Personne ne le dit mais"
- "J'ai mis X ans à comprendre", "À X ans, j'ai réalisé"
- "Avant/Maintenant", "À l'époque/Aujourd'hui"

FORMAT YOUR RESPONSE EXACTLY AS:

CAPTION 1:
[Multi-line caption with empty lines between thoughts, following proven viral formulas]
BACKGROUND: [suggested background color]

CAPTION 2:
[Multi-line caption with empty lines between thoughts, following proven viral formulas]  
BACKGROUND: [suggested background color]

Continue for all ${quantity} captions.

Make each caption emotionally powerful using proven viral psychology and authentic French cultural experiences.`;

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
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // ✅ ENHANCED: Parse the structured response for full captions
      const captionMatches = content.match(/CAPTION \d+:\s*([\s\S]*?)(?=BACKGROUND:|$)/gi);
      const backgroundMatches = content.match(/BACKGROUND:\s*([^\n]+)/gi);
      
      if (captionMatches && backgroundMatches) {
        const parsedContent = captionMatches.map((match, index) => {
          const captionText = match.replace(/CAPTION \d+:\s*/, '').trim();
          const backgroundText = backgroundMatches[index] ? 
            backgroundMatches[index].replace(/BACKGROUND:\s*/, '').trim() : 'Purple-Pink';
          
          return {
            id: index + 1,
            // ✅ APPLY ENHANCED CLEANING
            text: cleanText(captionText),
            background: backgroundText
          };
        });
        
        setGeneratedContent(parsedContent);
      } else {
        // ✅ ENHANCED: Fallback parsing for different formats
        const sections = content.split(/CAPTION \d+:|TEXT \d+:/i).filter(section => section.trim().length > 10);
        const fallbackContent = sections.slice(0, quantity).map((section, index) => {
          const lines = section.split('\n').filter(line => line.trim().length > 0);
          const textLines = lines.filter(line => !line.includes('BACKGROUND:'));
          const backgroundLine = lines.find(line => line.includes('BACKGROUND:'));
          
          // ✅ APPLY ENHANCED CLEANING TO FALLBACK TOO
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
            🤖 AI Viral Caption Generator
          </h1>
          <p className="text-lg text-gray-600">
            Multi-line viral captions for maximum Performance Program earnings
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
                
                {/* Model Info */}
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
                  <p className="text-sm">Multi-line captions based on 289% engagement research</p>
                </div>
              ) : (
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
              <div className="font-bold text-gray-800">1. Generate Viral Captions</div>
              <div className="text-sm text-gray-600">Create multi-line captions with research-backed viral formulas</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-bold text-gray-800">2. Send to Bulk</div>
              <div className="text-sm text-gray-600">Auto-transfer all captions to bulk generator with background suggestions</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl mb-2">📸</div>
              <div className="font-bold text-gray-800">3. Generate Images</div>
              <div className="text-sm text-gray-600">Create Facebook-style images with optimal backgrounds and authentic styling</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Complete viral content pipeline: AI captions → Bulk generation → GCS upload → Content Studio export → Facebook posts → Performance Program earnings! 💰
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICaptionGenerator;