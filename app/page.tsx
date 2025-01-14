'use client';

import { useState, FormEvent } from 'react';
import { calculateLifePath, calculateExpressionNumber, getZodiacSign } from '../utils/numerology';
import { generatePredictions, Prediction, PredictionResult } from '../utils/predictions';
import { drawTarotCard, drawTarotSpread, MAJOR_ARCANA, DEFAULT_CARD, TarotCard } from '../utils/cartomancy';
import { analyzePersonalityTraits, generateLifeInsights, generateIntroDescription } from '../utils/huggingface';

const enneagramTypes = [
  {
    type: '1',
    label: 'Type 1 : Le Réformateur',
    description: 'Perfectionniste, organisé, avec un fort sens moral et éthique.',
    color: 'bg-red-100 text-red-800',
    icon: '✔️'
  },
  {
    type: '2',
    label: 'Type 2 : L\'Assistant',
    description: 'Chaleureux, empathique, toujours prêt à aider les autres.',
    color: 'bg-pink-100 text-pink-800',
    icon: '❤️'
  },
  {
    type: '3',
    label: 'Type 3 : L\'Accompli',
    description: 'Ambitieux, dynamique, orienté vers le succès et la performance.',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🏆'
  },
  {
    type: '4',
    label: 'Type 4 : L\'Individualiste',
    description: 'Créatif, émotionnel, à la recherche de sens et d\'authenticité.',
    color: 'bg-purple-100 text-purple-800',
    icon: '🎨'
  },
  {
    type: '5',
    label: 'Type 5 : L\'Investigateur',
    description: 'Analytique, curieux, en quête de connaissances et de compréhension.',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔬'
  },
  {
    type: '6',
    label: 'Type 6 : Le Loyaliste',
    description: 'Responsable, engagé, cherchant la sécurité et la stabilité.',
    color: 'bg-green-100 text-green-800',
    icon: '🛡️'
  },
  {
    type: '7',
    label: 'Type 7 : L\'Enthousiaste',
    description: 'Optimiste, aventureux, à la recherche de nouvelles expériences.',
    color: 'bg-orange-100 text-orange-800',
    icon: '🌈'
  },
  {
    type: '8',
    label: 'Type 8 : Le Leader',
    description: 'Puissant, protecteur, avec un fort désir de contrôle et de justice.',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '💪'
  },
  {
    type: '9',
    label: 'Type 9 : Le Médiateur',
    description: 'Pacifique, conciliant, en harmonie avec son environnement.',
    color: 'bg-teal-100 text-teal-800',
    icon: '☮️'
  }
];

export default function Home() {
  const [formData, setFormData] = useState({
    name: 'NKENG HIAG LOUIS OLIVIER',
    birthdate: '1985-04-13',
    birthtime: '15:00',
    birthplace: 'song-loulou',
    gender: 'male',
    email: 'louiscyrano@gmail.com',
    lifeAspect: 'love',
    enneagram: '3'
  });

  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [personalityTraits, setPersonalityTraits] = useState<any[]>([]);
  const [lifeInsights, setLifeInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Cartomancy state
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [drawnSpread, setDrawnSpread] = useState<{ cards: TarotCard[], interpretation: string } | null>(null);
  const [spreadType, setSpreadType] = useState<'Single' | 'ThreePast' | 'Celtic'>('Single');

  // États pour gérer les descriptions
  const [showNumeroDescription, setShowNumeroDescription] = useState(true);
  const [showTarotDescription, setShowTarotDescription] = useState(true);

  const resetPredictions = () => {
    setPredictions(null);
    setPersonalityTraits([]);
    setLifeInsights('');
    setShowNumeroDescription(false);
  };

  const resetTarotDraws = () => {
    setDrawnCard(null);
    setDrawnSpread(null);
    setShowTarotDescription(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const lifePath = calculateLifePath(formData.birthdate);
      const expressionNumber = calculateExpressionNumber(formData.name);
      const zodiacSign = getZodiacSign(formData.birthdate);

      // Generate predictions without cartomancy
      const generatedPredictions = await generatePredictions({
        lifePath,
        zodiacSign,
        lifeAspect: 'general',
        enneagramType: formData.enneagram
      });

      // Set predictions without cartomancy cards
      setPredictions({
        ...generatedPredictions,
        name: formData.name,
        lifePath,
        expressionNumber,
        zodiacSign
      });

      // Personality and life insights
      const traits = await analyzePersonalityTraits(formData.name);
      setPersonalityTraits(traits);

      const insights = await generateLifeInsights({
        name: formData.name,
        birthdate: formData.birthdate,
        lifeAspect: formData.lifeAspect
      });
      setLifeInsights(insights);

    } catch (error) {
      console.error('Erreur lors de la génération des prédictions:', error);
    } finally {
      setIsLoading(false);
      setShowNumeroDescription(false);
    }
  };

  const handleDrawCard = () => {
    if (spreadType === 'Single') {
      const card = drawTarotCard();
      setDrawnCard(card);
      setDrawnSpread(null);
    } else {
      const spread = drawTarotSpread(spreadType);
      setDrawnSpread(spread);
      setDrawnCard(null);
    }
    setShowTarotDescription(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Analyse Numérologique Avancée
        </h1>
        
        {/* Section Analyse Numérologique */}
        <div className="section numerology">
          <h2 className="text-2xl font-bold text-purple-800">Analyse Numérologique</h2>
          
          {/* Description qui disparaît après le premier calcul */}
          {showNumeroDescription && (
            <div className="section-description 
              bg-gradient-to-r from-blue-50 to-purple-50 
              border-l-4 border-blue-500 
              p-6 
              rounded-xl 
              shadow-md 
              mb-6 
              animate-fade-in 
              hover:shadow-lg 
              transition-all 
              duration-300 
              ease-in-out"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800 mb-3">
                    Découvrez la Magie des Nombres
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    L'Analyse Numérologique est une pratique fascinante qui explore la signification des nombres dans votre vie. 
                    Chaque nombre, basé sur votre date de naissance et votre nom, raconte une histoire unique de votre personnalité, 
                    de vos talents et de votre chemin de vie. Ce n'est pas de la magie, mais une méthode de découverte de soi 
                    qui vous aide à mieux comprendre vos forces, vos défis et votre potentiel.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nom complet
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    required 
                  />
                </label>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Date de naissance
                  <input 
                    type="date" 
                    value={formData.birthdate}
                    onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    required 
                  />
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Heure de naissance
                  <input 
                    type="time" 
                    value={formData.birthtime}
                    onChange={(e) => setFormData({...formData, birthtime: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                </label>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Aspect de vie
                  <select 
                    value={formData.lifeAspect}
                    onChange={(e) => setFormData({...formData, lifeAspect: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  >
                    <option value="love">Amour et Relations</option>
                    <option value="career">Carrière et Finances</option>
                    <option value="health">Santé et Bien-être</option>
                    <option value="personal">Développement Personnel</option>
                    <option value="spiritual">Spiritualité</option>
                  </select>
                </label>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Type d'Ennéagramme
                  <div className="relative">
                    <select 
                      value={formData.enneagram}
                      onChange={(e) => setFormData({...formData, enneagram: e.target.value})}
                      className="appearance-none w-full bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-3 
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                        text-gray-700 font-medium transition-all duration-300 ease-in-out"
                    >
                      {enneagramTypes.map(type => (
                        <option 
                          key={type.type} 
                          value={type.type} 
                          className={`${type.color} font-semibold`}
                          title={type.description}
                        >
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  {/* Description dynamique */}
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg shadow-sm transition-all duration-300 ease-in-out">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {enneagramTypes.find(t => t.type === formData.enneagram)?.icon}
                      </span>
                      <p className="text-sm text-gray-700">
                        {enneagramTypes.find(t => t.type === formData.enneagram)?.description}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      L'Ennéagramme : Un système de personnalité qui révèle vos motivations profondes et vos mécanismes de défense.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="text-center">
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 disabled:opacity-50"
              >
                {isLoading ? 'Génération en cours...' : 'Obtenir mon analyse'}
              </button>
            </div>
          </form>

          {predictions && (
            <div className="mt-12 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-800">
                  Résultats pour {predictions.name}
                </h2>
                <button 
                  onClick={resetPredictions}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
              <section className="bg-blue-50 p-6 rounded-xl">
                <p className="font-semibold">Chemin de vie : {predictions.lifePath}</p>
                <p className="text-gray-600">Votre essence numerologique</p>
              </section>
              <section className="bg-blue-50 p-6 rounded-xl">
                <p className="font-semibold">Nombre d'expression : {predictions.expressionNumber}</p>
                <p className="text-gray-600">Votre potentiel intrinsèque</p>
              </section>
              <section className="bg-blue-50 p-6 rounded-xl">
                <p className="font-semibold">Signe solaire : {predictions.zodiacSign.name} {predictions.zodiacSign.symbol}</p>
                <p className="text-gray-600">Votre identité astrologique</p>
              </section>

              {personalityTraits.length > 0 && (
                <section className="bg-purple-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4 text-purple-800">
                    Analyse des Traits de Personnalité
                  </h3>
                  {personalityTraits.map((trait, index) => (
                    <div key={index} className="mb-3">
                      <p className="font-semibold">{trait.emotion}</p>
                      <p className="text-gray-600">{trait.interpretation}</p>
                    </div>
                  ))}
                </section>
              )}

              {lifeInsights && (
                <section className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    Perspectives de Vie Personnalisées
                  </h3>
                  <p className="text-gray-700">{lifeInsights}</p>
                </section>
              )}

              <section className="bg-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-orange-800">
                  Prédictions Détaillées
                </h3>
                {Object.entries(predictions.predictions).map(([aspect, prediction]) => (
                  <div key={aspect} className="bg-white p-3 rounded-md shadow-sm">
                    <h3 className="font-semibold text-lg capitalize mb-2">{aspect}</h3>
                    <p>{prediction.text}</p>
                    {prediction.aiGeneratedInsight && (
                      <p className="text-sm text-gray-600 mt-2">
                        Insight IA : {prediction.aiGeneratedInsight}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            </div>
          )}
        </div>

        {/* Section Tirage de Tarot */}
        <div className="mt-8 bg-purple-50 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-800">Tirage de Cartes de Tarot</h2>
            {(drawnCard || drawnSpread) && (
              <button 
                onClick={resetTarotDraws}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>
          
          {/* Description qui disparaît après le premier tirage */}
          {showTarotDescription && (
            <div className="section-description 
              bg-gradient-to-r from-purple-50 to-pink-50 
              border-l-4 border-purple-500 
              p-6 
              rounded-xl 
              shadow-md 
              mb-6 
              animate-fade-in 
              hover:shadow-lg 
              transition-all 
              duration-300 
              ease-in-out"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800 mb-3">
                    Votre Miroir Intérieur
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Le Tirage de Cartes de Tarot est bien plus qu'une simple divination. 
                    C'est un miroir symbolique qui vous aide à explorer vos pensées, vos émotions et vos intuitions. 
                    Chaque carte est comme une fenêtre ouverte sur votre monde intérieur, révélant des perspectives 
                    que votre conscience immédiate n'aperçoit pas toujours.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Spread Type Selection */}
          <div className="flex space-x-4 mb-6">
            <button 
              onClick={() => setSpreadType('Single')} 
              className={`px-6 py-3 rounded-lg transition-all ${
                spreadType === 'Single' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              Carte Unique
            </button>
            <button 
              onClick={() => setSpreadType('ThreePast')} 
              className={`px-6 py-3 rounded-lg transition-all ${
                spreadType === 'ThreePast' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              Passé, Présent, Futur
            </button>
            <button 
              onClick={() => setSpreadType('Celtic')} 
              className={`px-6 py-3 rounded-lg transition-all ${
                spreadType === 'Celtic' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              Tirage Celtique
            </button>
          </div>

          {/* Draw Card Button */}
          <button 
            onClick={handleDrawCard}
            className="bg-purple-700 text-white px-8 py-4 rounded-xl 
              hover:bg-purple-800 transition-colors duration-300 
              transform hover:scale-105 active:scale-95 
              shadow-md hover:shadow-xl mb-6"
          >
            Tirer {spreadType === 'Single' ? 'une Carte' : 'les Cartes'}
          </button>

          {/* Single Card Display */}
          {drawnCard && (
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full animate-fade-in">
              <h2 className={`text-2xl font-bold mb-4 ${drawnCard.isReversed ? 'text-red-600' : 'text-green-600'}`}>
                {drawnCard.name} {drawnCard.isReversed && '(Inversé)'}
              </h2>
              
              <div className="mb-6">
                <img 
                  src={drawnCard.imageUrl} 
                  alt={drawnCard.name} 
                  className={`w-full h-80 object-cover rounded-xl shadow-lg ${drawnCard.isReversed ? 'transform rotate-180' : ''}`}
                  onError={(e) => {
                    console.error('Image load error:', e);
                    console.error('Image source:', drawnCard.imageUrl);
                  }}
                />
              </div>
              
              <div className="text-gray-700">
                <p className="font-semibold mb-2">Mots-clés : {drawnCard.keywords.join(', ')}</p>
                <p className="mb-4">{drawnCard.isReversed ? drawnCard.reversedDescription : drawnCard.description}</p>
              </div>
            </div>
          )}

          {/* Spread Display */}
          {drawnSpread && (
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-4xl w-full animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">
                {spreadType === 'ThreePast' ? 'Passé, Présent, Futur' : 'Tirage de la Croix Celtique'}
              </h2>
              
              <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                {drawnSpread.cards.map((card, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img 
                      src={card.imageUrl} 
                      alt={card.name} 
                      className={`w-full h-40 object-cover rounded-lg shadow-md 
                        ${card.isReversed ? 'transform rotate-180' : ''}`}
                      onError={(e) => {
                        console.error(`Spread Card ${index} Image load error:`, e);
                        console.error(`Spread Card ${index} Image source:`, card.imageUrl);
                      }}
                    />
                    <p className={`mt-2 text-sm text-center ${card.isReversed ? 'text-red-600' : 'text-green-600'}`}>
                      {card.name} {card.isReversed && '(Inv)'}
                    </p>
                  </div>
                ))}
              </div>

              {drawnSpread.interpretation && (
                <div className="mt-8 p-6 bg-purple-50 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 text-purple-900">Interprétation</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{drawnSpread.interpretation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
